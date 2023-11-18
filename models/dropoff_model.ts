import pool from '../dataBase';
import { RowDataPacket } from 'mysql2';

const dropoff_model = {
  // Verify dropoff code and locker number
  verifyDropoffCode: async (dropoffCode: number, lockerNumber: number): Promise<{ isValid: boolean; parcelId?: number }> => {
    try {
      const query = `
        SELECT id_parcel
        FROM parcel
        WHERE pin_code = ? AND desired_dropoff_locker = ? AND status = 'ready_to_deliver'`;
  
      const [result] = await pool.promise().query<RowDataPacket[]>(query, [dropoffCode, lockerNumber]);
  
      if (result.length > 0) {
        return { isValid: true, parcelId: result[0].id_parcel };
      }
  
      return { isValid: false };
    } catch (error) {
      console.error('Error verifying dropoff code:', error);
      throw error;
    }
  },
  

// Find available cabinet id for dropoff
findAvailableCabinetId: async (lockerNumber: number): Promise<number[]> => {
  try {
    const query = `
    SELECT locker.id_cabinet
    FROM locker
    JOIN parcel ON locker.locker_number = parcel.desired_dropoff_locker
    WHERE locker.locker_number = ? AND locker.cabinet_status = 'free'`;

    const [result] = await pool.promise().query<RowDataPacket[]>(query, [lockerNumber]);

    return result.map((row) => row.id_cabinet);

  } catch (error) {
    console.error('Error finding available cabinets:', error);
    throw error;
  }
},
// get the cabinet number by cabinet id
getCabinetNumber: async (cabinetId: number): Promise<number> => {
  try {
    const query = `
    SELECT cabinet_number
      FROM locker
      WHERE id_cabinet = ?;`;

    const [result] = await pool.promise().query<RowDataPacket[]>(query, [cabinetId]);

    if (result.length === 0) {
      // handle the case where the cabinet ID is not found
      console.error('Cabinet ID not found:', cabinetId);
      return -1; // or throw an error, depending on your error handling strategy
    }

    const cabinetNumber= result[0].cabinet_number;
    console.log(`Cabinet Number for Cabinet ID ${cabinetId}: ${cabinetNumber}`)
    return cabinetNumber;
  } catch (error) {
    console.error('Error finding cabinet number:', error);
    throw error;
  }
},


 // Update cabinet status, parcel status, and invalidate dropoff code
 updateStatusAfterDropoff: async (selectedCabinet: number, parcelId: number): Promise<void> => {
  try {
    // Add parcel id to selected cabinet in locker table
    await pool.promise().query('UPDATE locker SET parcel_id = ? WHERE id_cabinet = ?', [parcelId, selectedCabinet]);

    // Update cabinet status
    await pool.promise().query('UPDATE locker SET cabinet_status = ? WHERE id_cabinet = ?', ['has_dropoff_parcel', selectedCabinet]);

    // Update parcel status
    await pool.promise().query('UPDATE parcel SET status = ? WHERE id_parcel = ?', ['parcel_at_dropoff_locker', parcelId]);

    // Remove dropoff code from pincode in parcel table
    await pool.promise().query('UPDATE parcel SET pin_code = NULL WHERE id_parcel = ?', [parcelId]);

    // set the date of dropoff
    const updateDropoffDate =`
                              UPDATE parcel
                              SET parcel_dropoff_date = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
                              WHERE id_parcel = ?;
                            `;
    await pool.promise().query(updateDropoffDate, [parcelId]);
  } catch (error) {
    console.error('Error updating status after dropoff:', error);
    throw error;
  }
},


};


export default dropoff_model;
