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
  

// Find available cabinets for dropoff
findAvailableCabinets: async (lockerNumber: number): Promise<number[]> => {
  try {
    const query = `
    SELECT locker.id_cabinet
    FROM locker
    JOIN parcel ON locker.locker_number = parcel.desired_dropoff_locker
    WHERE locker.cabinet_status = 'free'`;

    const [result] = await pool.promise().query<RowDataPacket[]>(query, [lockerNumber]);

    return result.map((row) => row.id_cabinet);

  } catch (error) {
    console.error('Error finding available cabinets:', error);
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
    await pool.promise().query('UPDATE parcel SET parcel_dropoff_date = NOW() WHERE id_parcel = ?', [parcelId]);
  } catch (error) {
    console.error('Error updating status after dropoff:', error);
    throw error;
  }
},


};


export default dropoff_model;
