import express from 'express';
import cabinet_model from '../models/cabinet_model';

const router = express.Router();

// verify pickup code
router.post('/user_pickup', async (req, res) => {
    const { pickupCode } = req.body;

    if (!pickupCode) {
        return res.status(400).json({ error: 'Pickup code is required' });
    }

    try {
        const isCodeValid = await cabinet_model.verifyPickupCode(parseInt(pickupCode));

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

// verify dropoff code
router.post('/user_dropoff', async (req, res) => {
    const { dropoffCode } = req.body;

    if (!dropoffCode) {
        return res.status(400).json({ error: 'Dropoff code is required' });
    }

    try {
        const isCodeValid = await cabinet_model.verifyDropoffCode(parseInt(dropoffCode));

        if (isCodeValid) {
            // Code is valid, open the cabinet door
            res.json({ message: 'Cabinet door opened successfully, put your package inside and close the door' });
        } else {
            // Code is invalid
            res.status(403).json({ error: 'Incorrect dropoff code' });
        }
    } catch (error) {
        console.error('Error opening cabinet door:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

