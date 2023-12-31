import express from 'express';
import dropoff_model from '../models/dropoff_model';

const router = express.Router();

// Verify dropoff code and locker number
router.post('/dropoff', async (req, res) => {
  const { dropoffCode, lockerNumber } = req.body;

  if (!dropoffCode || !lockerNumber) {
    return res.status(400).json({ error: 'Dropoff code and locker number are required' });
  }

  try {
    const result = await dropoff_model.verifyDropoffCode(parseInt(dropoffCode), parseInt(lockerNumber));

    if (result.isValid) {
      // Code is valid, check locker status
      if (result.parcelId === undefined) {
        // No associated parcel, return error immediately
        return res.status(404).json({ error: 'No parcel found for the specified dropoff code and locker number' });
      }

      // get available cabinet id for dropoff
      const availableCabinetIds = await dropoff_model.findAvailableCabinetId(lockerNumber);

      // No available cabinets, notify the user
      if (availableCabinetIds.length === 0) {
        return res.status(404).json({ error: 'No available cabinets at this moment, Please contact the customer service' });
      }

      // get the cabinet number of the randomly selected cabinet
      const selectedCabinetId = availableCabinetIds[0];
      const selectedCabinetNumber = await dropoff_model.getCabinetNumber(selectedCabinetId);

      // Open the cabinet door
      res.json({
        message: `Door ${selectedCabinetNumber} open for dropoff, put your package inside and close the door`,
        lockerNumber: lockerNumber,
      });

      // after the user closes the door
      await dropoff_model.updateStatusAfterDropoff(selectedCabinetId, result.parcelId);
    } else {
      // Code is invalid or conditions not met
      res.status(403).json({ error: 'Incorrect dropoff code or locker number' });
    }
  } catch (error) {
    console.error('Error handling dropoff request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
