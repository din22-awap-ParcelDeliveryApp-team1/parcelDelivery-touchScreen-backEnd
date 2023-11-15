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

      // Find available cabinets for dropoff in the specified locker
      const availableCabinets = await dropoff_model.findAvailableCabinets(parseInt(lockerNumber));

      if (availableCabinets.length === 0) {
        // No available cabinets, notify the user
        return res.status(404).json({ error: 'No available lockers for dropoff in the specified locker, please come again later' });
      }

    // Directly use the available cabinet from the user-selected locker
    const selectedCabinet = availableCabinets[0];

    // Open the cabinet door
    res.json({
    message: `Door ${selectedCabinet} open for dropoff in locker ${lockerNumber}, put your package inside and close the door`,
    cabinetNumber: selectedCabinet,
    lockerNumber: lockerNumber,
    });
  
     // Update parcel id in the locker table for the specified cabinet
     await dropoff_model.updateParcelIdInLocker(result.parcelId, selectedCabinet);
  
    // after the user closes the door
    await dropoff_model.updateStatusAfterDropoff(parseInt(dropoffCode), selectedCabinet, result.parcelId);
  
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
