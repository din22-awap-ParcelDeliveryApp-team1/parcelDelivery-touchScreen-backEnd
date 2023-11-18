import express from 'express';
import pickup_model from '../models/pickup_model';

const router = express.Router();

// verify pickup code
router.post('/pickup', async (req, res) => {
    const { pickupCode, lockerNumber} = req.body;

    if (!pickupCode || !lockerNumber) {
        return res.status(400).json({ error: 'Pickup code and locker number are required' });
    }

try{
    const result = await pickup_model.verifyPickupCode(parseInt(pickupCode), parseInt(lockerNumber));
    if (result.isValid) {
        // Code is valid, check locker status
        if (result.parcelId === undefined) {
            // No associated parcel, return error
            return res.status(404).json({ error: 'No parcel found for the specified pickup code and locker number' });
        }
        // Open the cabinet door
        const cabinetNumber = await pickup_model.findCabinetNumber(result.parcelId);
        res.json({
            message: `Door ${cabinetNumber} open for pickup, take your package and close the door`,
            lockerNumber: lockerNumber,
        });
        // after the user closes the door
        const cabinetId = await pickup_model.findCabinetId(result.parcelId);
        await pickup_model.updateStatusAfterPickup(cabinetId, result.parcelId);
    } else {
        // Code is invalid or conditions not met
        res.status(403).json({ error: 'Incorrect pickup code or locker number' });
    }
} catch (error) {
    console.error('Error handling pickup request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
export default router;