import express from 'express';
import pickup_model from '../models/pickup_model';

const router = express.Router();

// verify pickup code
router.post('/user_pickup', async (req, res) => {
    const { pickupCode } = req.body;

    if (!pickupCode) {
        return res.status(400).json({ error: 'Pickup code is required' });
    }

    try {
        const isCodeValid = await pickup_model.verifyPickupCode(parseInt(pickupCode));

        if (isCodeValid) {
            // Code is valid, open the cabinet door
            res.json({ message: 'Cabinet door opened successfully, pickup your package and close the door' });
        } else {
            // Code is invalid
            res.status(403).json({ error: 'Incorrect pickup code' });
        }
    } catch (error) {
        console.error('Error opening cabinet door:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;