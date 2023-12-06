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
const dropoff_model_1 = __importDefault(require("../models/dropoff_model"));
const router = express_1.default.Router();
// Verify dropoff code and locker number
router.post('/dropoff', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dropoffCode, lockerNumber } = req.body;
    if (!dropoffCode || !lockerNumber) {
        return res.status(400).json({ error: 'Dropoff code and locker number are required' });
    }
    try {
        const result = yield dropoff_model_1.default.verifyDropoffCode(parseInt(dropoffCode), parseInt(lockerNumber));
        if (result.isValid) {
            // Code is valid, check locker status
            if (result.parcelId === undefined) {
                // No associated parcel, return error immediately
                return res.status(404).json({ error: 'No parcel found for the specified dropoff code and locker number' });
            }
            // get available cabinet id for dropoff
            const availableCabinetIds = yield dropoff_model_1.default.findAvailableCabinetId(lockerNumber);
            // No available cabinets, notify the user
            if (availableCabinetIds.length === 0) {
                return res.status(404).json({ error: 'No available cabinets at this moment, Please contact the customer service' });
            }
            // get the cabinet number of the randomly selected cabinet
            const selectedCabinetId = availableCabinetIds[0];
            const selectedCabinetNumber = yield dropoff_model_1.default.getCabinetNumber(selectedCabinetId);
            // Open the cabinet door
            res.json({
                message: `Door ${selectedCabinetNumber} open for dropoff, put your package inside and close the door`,
                lockerNumber: lockerNumber,
            });
            // after the user closes the door
            yield dropoff_model_1.default.updateStatusAfterDropoff(selectedCabinetId, result.parcelId);
        }
        else {
            // Code is invalid or conditions not met
            res.status(403).json({ error: 'Incorrect dropoff code or locker number' });
        }
    }
    catch (error) {
        console.error('Error handling dropoff request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
