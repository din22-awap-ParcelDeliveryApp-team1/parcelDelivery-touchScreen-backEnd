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
Object.defineProperty(exports, "__esModule", { value: true });
const dataBase_1 = require("../dataBase");
const pickup_model = {
    // Verify pickup code
    verifyPickupCode: (pickupCode, lockerNumber) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const nonNullPool = dataBase_1.pool;
            const query = `
    SELECT id_parcel
    FROM parcel
    WHERE pin_code = ? AND 
      (
        CASE
          WHEN alternative_pickup_locker IS NULL THEN desired_pickup_locker
          ELSE alternative_pickup_locker
        END
      ) = ? AND status = 'parcel_in_pickup_locker';
    `;
            const [result] = yield nonNullPool.query(query, [pickupCode, lockerNumber]);
            if (result.length > 0) {
                return { isValid: true, parcelId: result[0].id_parcel };
            }
            return { isValid: false };
        }
        catch (error) {
            console.error('Error verifying pickup code:', error);
            throw error;
        }
    }),
    // Find cabinet_id with parcel_id in locker table
    findCabinetId: (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const nonNullPool = dataBase_1.pool;
            const getCabinetIdQuery = `
      SELECT id_cabinet
      FROM locker
      WHERE parcel_id = ?;
    `;
            const [cabinetResult] = yield nonNullPool.query(getCabinetIdQuery, [parcelId]);
            if (cabinetResult.length === 0) {
                // handle the case where the cabinet ID is not found
                console.error('Cabinet ID not found for parcel ID:', parcelId);
                return -1; // or throw an error, depending on your error handling strategy
            }
            return cabinetResult[0].id_cabinet;
        }
        catch (error) {
            console.error('Error finding cabinet ID:', error);
            throw error;
        }
    }),
    // Find cabinet_number with cabinet_id in locker table
    findCabinetNumber: (cabinetId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const nonNullPool = dataBase_1.pool;
            const getCabinetNumberQuery = `
      SELECT cabinet_number
      FROM locker
      WHERE id_cabinet = ?;
    `;
            const [numberResult] = yield nonNullPool.query(getCabinetNumberQuery, [cabinetId]);
            if (numberResult.length === 0) {
                // handle the case where the cabinet number is not found
                console.error('Cabinet number not found for ID:', cabinetId);
                return -1; // or throw an error, depending on your error handling strategy
            }
            return numberResult[0].cabinet_number;
        }
        catch (error) {
            console.error('Error finding cabinet number:', error);
            throw error;
        }
    }),
    // update status after pickup
    updateStatusAfterPickup: (cabinetId, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const nonNullPool = dataBase_1.pool;
            // Update cabinet status
            yield nonNullPool.query('UPDATE locker SET cabinet_status = ? WHERE id_cabinet = ?', ['free', cabinetId]);
            // Update parcel status
            yield nonNullPool.query('UPDATE parcel SET status = ? WHERE id_parcel = ?', ['reciever_recieved_parcel', parcelId]);
            // Remove pickup code from pincode in parcel table
            yield nonNullPool.query('UPDATE parcel SET pin_code = NULL WHERE id_parcel = ?', [parcelId]);
            // Remove parcel id from selected cabinet in locker table
            yield nonNullPool.query('UPDATE locker SET parcel_id = NULL WHERE id_cabinet = ?', [cabinetId]);
            // set the date of pickup
            const updatePickupDate = `
                              UPDATE parcel
                              SET parcel_pickup_date = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
                              WHERE id_parcel = ?;
                            `;
            yield nonNullPool.query(updatePickupDate, [parcelId]);
        }
        catch (error) {
            console.error('Error updating status after pickup:', error);
            throw error;
        }
    }),
};
exports.default = pickup_model;
