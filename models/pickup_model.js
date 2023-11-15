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
const pickup_model = {
    // Verify pickup code
    verifyPickupCode: (pickupCode) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = `
        SELECT parcel_pickup_code, locker.cabinet_status, parcel.parcel_status
        FROM parcel
        INNER JOIN locker ON parcel.locker_number = locker.locker_number
        WHERE parcel_pickup_code = ?`;
            const [result] = yield dataBase_1.default.promise().query(query, [pickupCode]);
            if (result.length > 0) {
                const cabinetStatus = result[0].cabinet_status;
                const parcelStatus = result[0].parcel_status;
                if (cabinetStatus === 3 && parcelStatus === 3) {
                    // Cabinet is open and parcel is in the pickup locker
                    // Update cabinet status to empty (1)
                    yield dataBase_1.default.promise().query('UPDATE locker SET cabinet_status = 1 WHERE locker_number = ?', [result[0].locker_number]);
                    // Update parcel status to delivered (4)
                    yield dataBase_1.default.promise().query('UPDATE parcel SET parcel_status = 4 WHERE parcel_pickup_code = ?', [pickupCode]);
                    // Invalidate the pickup code 
                    //   set it to -1 so that it can't be used again
                    yield dataBase_1.default.promise().query('UPDATE parcel SET parcel_pickup_code = -1 WHERE parcel_pickup_code = ?', [pickupCode]);
                    return true; // Code is valid, and actions are performed
                }
            }
            return false; // Code is invalid or conditions are not met
        }
        catch (error) {
            console.error('Error verifying pickup code and updating statuses:', error);
            throw error;
        }
    })
};
exports.default = pickup_model;
