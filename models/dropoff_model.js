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
const dataBase_1 = __importDefault(require("../dataBase"));
const dropoff_model = {
    // Verify dropoff code and locker number
    verifyDropoffCode: (dropoffCode, lockerNumber) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = `
        SELECT id_parcel
        FROM parcel
        WHERE pin_code = ? AND desired_dropoff_locker = ? AND status = 'ready_to_deliver'`;
            const [result] = yield dataBase_1.default.promise().query(query, [dropoffCode, lockerNumber]);
            if (result.length > 0) {
                return { isValid: true, parcelId: result[0].id_parcel };
            }
            return { isValid: false };
        }
        catch (error) {
            console.error('Error verifying dropoff code:', error);
            throw error;
        }
    }),
    // Find available cabinets for dropoff
    findAvailableCabinets: (lockerNumber) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = `
    SELECT locker.id_cabinet
    FROM locker
    JOIN parcel ON locker.locker_number = parcel.desired_dropoff_locker
    WHERE locker.cabinet_status = 'free'`;
            const [result] = yield dataBase_1.default.promise().query(query, [lockerNumber]);
            return result.map((row) => row.id_cabinet);
        }
        catch (error) {
            console.error('Error finding available cabinets:', error);
            throw error;
        }
    }),
    // Update cabinet status, parcel status, and invalidate dropoff code
    updateStatusAfterDropoff: (dropoffCode, selectedCabinet, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Update cabinet status to (package to dropoff (2))
            yield dataBase_1.default.promise().query('UPDATE locker SET cabinet_status = 2, parcel_id = ? WHERE id_cabinet = ?', [parcelId, selectedCabinet]);
            // Update parcel status to (in the dropoff locker (1))
            yield dataBase_1.default.promise().query('UPDATE parcel SET parcel_status = 1, parcel_dropoff_locker = ? WHERE id_parcel = ?', [selectedCabinet, parcelId]);
            // Update parcel id in the locker table for the specified cabinet
            yield dataBase_1.default.promise().query('UPDATE locker SET parcel_id = ? WHERE id_cabinet = ?', [parcelId, selectedCabinet]);
            // Invalidate the dropoff code
            // set it to -1 
            yield dataBase_1.default.promise().query('UPDATE parcel SET parcel_dropoff_code = -1 WHERE parcel_dropoff_code = ?', [dropoffCode]);
        }
        catch (error) {
            console.error('Error updating status after dropoff:', error);
            throw error;
        }
    }),
    // Update parcel id in the locker table for the specified cabinet
    updateParcelIdInLocker: (parcelId, cabinetId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield dataBase_1.default.promise().query('UPDATE locker SET parcel_id = ? WHERE id_cabinet = ?', [parcelId, cabinetId]);
        }
        catch (error) {
            console.error('Error updating parcel id in locker:', error);
            throw error;
        }
    }),
};
exports.default = dropoff_model;
