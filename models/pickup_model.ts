import {pool} from '../dataBase';
import { RowDataPacket } from 'mysql2';

const pickup_model = {
 // Verify pickup code
 verifyPickupCode: async (pickupCode: number, lockerNumber: number): Promise<{ isValid: boolean; parcelId?: number }> => {
  try {
    const nonNullPool = pool!;
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

    const [result] = await nonNullPool.query<RowDataPacket[]>(query, [pickupCode, lockerNumber]);

    if (result.length > 0) {
      return { isValid: true, parcelId: result[0].id_parcel };
    }

    return { isValid: false };
  } catch (error) {
    console.error('Error verifying pickup code:', error);
    throw error;
  }
},
// Find cabinet_id with parcel_id in locker table
findCabinetId: async (parcelId: number): Promise<number> => {
  try {
    const nonNullPool = pool!;
    const getCabinetIdQuery = `
      SELECT id_cabinet
      FROM locker
      WHERE parcel_id = ?;
    `;

    const [cabinetResult] = await nonNullPool.query<RowDataPacket[]>(getCabinetIdQuery, [parcelId]);

    if (cabinetResult.length === 0) {
      // handle the case where the cabinet ID is not found
      console.error('Cabinet ID not found for parcel ID:', parcelId);
      return -1; // or throw an error, depending on your error handling strategy
    }

    return cabinetResult[0].id_cabinet;

  } catch (error) {
    console.error('Error finding cabinet ID:', error);
    throw error;
  }
},

// Find cabinet_number with cabinet_id in locker table
findCabinetNumber: async (cabinetId: number): Promise<number> => {
  try {
    const nonNullPool = pool!;
    const getCabinetNumberQuery = `
      SELECT cabinet_number
      FROM locker
      WHERE id_cabinet = ?;
    `;

    const [numberResult] = await nonNullPool.query<RowDataPacket[]>(getCabinetNumberQuery, [cabinetId]);

    if (numberResult.length === 0) {
      // handle the case where the cabinet number is not found
      console.error('Cabinet number not found for ID:', cabinetId);
      return -1; // or throw an error, depending on your error handling strategy
    }

    return numberResult[0].cabinet_number;

  } catch (error) {
    console.error('Error finding cabinet number:', error);
    throw error;
  }
},


  // update status after pickup
  updateStatusAfterPickup: async (cabinetId: number, parcelId: number): Promise<void> => {
    try {
      const nonNullPool = pool!;
      // Update cabinet status
      await nonNullPool.query('UPDATE locker SET cabinet_status = ? WHERE id_cabinet = ?', ['free', cabinetId]);

      // Update parcel status
      await nonNullPool.query('UPDATE parcel SET status = ? WHERE id_parcel = ?', ['reciever_recieved_parcel', parcelId]);

      // Remove pickup code from pincode in parcel table
      await nonNullPool.query('UPDATE parcel SET pin_code = NULL WHERE id_parcel = ?', [parcelId]);

      // Remove parcel id from selected cabinet in locker table
      await nonNullPool.query('UPDATE locker SET parcel_id = NULL WHERE id_cabinet = ?', [cabinetId]);

      // set the date of pickup
      const updatePickupDate =`
                              UPDATE parcel
                              SET parcel_pickup_date = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
                              WHERE id_parcel = ?;
                            `;
    await nonNullPool.query(updatePickupDate, [parcelId]);
    
    } catch (error) {
      console.error('Error updating status after pickup:', error);
      throw error;
    }
  },

}
export default pickup_model;
