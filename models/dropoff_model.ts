import pool from '../dataBase';
import { RowDataPacket } from 'mysql2';

const dropoff_model = {
  // Verify dropoff code and locker number
<<<<<<< HEAD
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
  
=======
verifyDropoffCode: async (dropoffCode: number, lockerNumber: number): Promise<{ isValid: boolean; parcelId?: number }> => {
  try {
    const query = `
      SELECT parcel.id_parcel, locker.cabinet_status, parcel.parcel_status
      FROM parcel
      INNER JOIN locker ON parcel.parcel_dropoff_locker = locker.locker_number
      WHERE parcel_dropoff_code = ? AND locker.locker_number = ?`;

    const [result] = await pool.promise().query<RowDataPacket[]>(query, [dropoffCode, lockerNumber]);

    if (result.length > 0) {
      // const cabinetStatus = result[0].cabinet_status;
      const parcelStatus = result[0].parcel_status;

      // Check if the cabinet status is empty (1) and the parcel status is ready (0)
      if (parcelStatus === 0) {
        return { isValid: true, parcelId: result[0].id_parcel };
      }
    }

    return { isValid: false };
  } catch (error) {
    console.error('Error verifying dropoff code and updating statuses:', error);
    throw error;
  }
},
>>>>>>> databaseChanges

// Find available cabinets for dropoff
findAvailableCabinets: async (lockerNumber: number): Promise<number[]> => {
  try {
    const query = `
<<<<<<< HEAD
    SELECT locker.id_cabinet
    FROM locker
    JOIN parcel ON locker.locker_number = parcel.desired_dropoff_locker
    WHERE locker.cabinet_status = 'free'`;
=======
      SELECT locker.id_cabinet
      FROM locker
      JOIN parcel ON locker.locker_number = parcel.parcel_dropoff_locker
      WHERE locker.cabinet_status = 1 AND locker.locker_number = ? AND parcel.parcel_status = 0`;
>>>>>>> databaseChanges

    const [result] = await pool.promise().query<RowDataPacket[]>(query, [lockerNumber]);

    return result.map((row) => row.id_cabinet);

  } catch (error) {
    console.error('Error finding available cabinets:', error);
    throw error;
  }
},

 // Update cabinet status, parcel status, and invalidate dropoff code
 updateStatusAfterDropoff: async (dropoffCode: number, selectedCabinet: number, parcelId: number): Promise<void> => {
  try {
    // Update cabinet status to (package to dropoff (2))
    await pool.promise().query('UPDATE locker SET cabinet_status = 2, parcel_id = ? WHERE id_cabinet = ?', [parcelId, selectedCabinet]);

    // Update parcel status to (in the dropoff locker (1))
    await pool.promise().query('UPDATE parcel SET parcel_status = 1, parcel_dropoff_locker = ? WHERE id_parcel = ?', [selectedCabinet, parcelId]);

    // Update parcel id in the locker table for the specified cabinet
    await pool.promise().query('UPDATE locker SET parcel_id = ? WHERE id_cabinet = ?', [parcelId, selectedCabinet]);


    // Invalidate the dropoff code
    // set it to -1 
    await pool.promise().query('UPDATE parcel SET parcel_dropoff_code = -1 WHERE parcel_dropoff_code = ?', [dropoffCode]);
  } catch (error) {
    console.error('Error updating status after dropoff:', error);
    throw error;
  }
},
// Update parcel id in the locker table for the specified cabinet
updateParcelIdInLocker: async (parcelId: number, cabinetId: number): Promise<void> => {
  try {
    await pool.promise().query('UPDATE locker SET parcel_id = ? WHERE id_cabinet = ?', [parcelId, cabinetId]);
  } catch (error) {
    console.error('Error updating parcel id in locker:', error);
    throw error;
  }
},


};


export default dropoff_model;
