"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pickup_model_1 = __importDefault(require("../models/pickup_model"));
const router = express_1.default.Router();
// verify pickup code
router.post('/pickup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pickupCode, lockerNumber } = req.body;
    if (!pickupCode || !lockerNumber) {
        return res.status(400).json({ error: 'Pickup code and locker number are required' });
    }
    try {
        const result = yield pickup_model_1.default.verifyPickupCode(parseInt(pickupCode), parseInt(lockerNumber));
        if (result.isValid) {
            // Code is valid, check locker status
            if (result.parcelId === undefined) {
                // No associated parcel, return error
                return res.status(404).json({ error: 'No parcel found for the specified pickup code and locker number' });
            }
            // Open the cabinet door
            const cabinetNumber = yield pickup_model_1.default.findCabinetNumber(result.parcelId);
            res.json({
                message: `Door ${cabinetNumber} open for pickup, take your package and close the door`,
                lockerNumber: lockerNumber,
            });
            // after the user closes the door
            const cabinetId = yield pickup_model_1.default.findCabinetId(result.parcelId);
            yield pickup_model_1.default.updateStatusAfterPickup(cabinetId, result.parcelId);
        }
        else {
            // Code is invalid or conditions not met
            res.status(403).json({ error: 'Incorrect pickup code or locker number' });
        }
    }
    catch (error) {
        console.error('Error handling pickup request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
