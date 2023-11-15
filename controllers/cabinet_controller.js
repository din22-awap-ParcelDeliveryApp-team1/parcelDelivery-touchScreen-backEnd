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
const cabinet_model_1 = __importDefault(require("../models/cabinet_model"));
const router = express_1.default.Router();
// verify pickup code
router.post('/user_pickup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pickupCode } = req.body;
    if (!pickupCode) {
        return res.status(400).json({ error: 'Pickup code is required' });
    }
    try {
        const isCodeValid = yield cabinet_model_1.default.verifyPickupCode(parseInt(pickupCode));
        if (isCodeValid) {
            // Code is valid, open the cabinet door
            res.json({ message: 'Cabinet door opened successfully, pickup your package and close the door' });
        }
        else {
            // Code is invalid
            res.status(403).json({ error: 'Incorrect pickup code' });
        }
    }
    catch (error) {
        console.error('Error opening cabinet door:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// verify dropoff code
router.post('/user_dropoff', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dropoffCode } = req.body;
    if (!dropoffCode) {
        return res.status(400).json({ error: 'Dropoff code is required' });
    }
    try {
        const isCodeValid = yield cabinet_model_1.default.verifyDropoffCode(parseInt(dropoffCode));
        if (isCodeValid) {
            // Code is valid, open the cabinet door
            res.json({ message: 'Cabinet door opened successfully, put your package inside and close the door' });
        }
        else {
            // Code is invalid
            res.status(403).json({ error: 'Incorrect dropoff code' });
        }
    }
    catch (error) {
        console.error('Error opening cabinet door:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
