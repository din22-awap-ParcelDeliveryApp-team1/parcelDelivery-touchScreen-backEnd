import pool from '../dataBase';
import { RowDataPacket } from 'mysql2';


const cabinet_model = {
   // Verify pickup code
   verifyPickupCode: async (pickupCode: number): Promise<boolean> => {
    try {
      const query = `
        SELECT parcel_pickup_code, locker.cabinet_status, parcel.parcel_status
        FROM parcel
        INNER JOIN locker ON parcel.locker_number = locker.locker_number
        WHERE parcel_pickup_code = ?`;

      const [result] = await pool.promise().query<RowDataPacket[]>(query, [pickupCode]);

      if (result.length > 0) {
        const cabinetStatus = result[0].cabinet_status;
        const parcelStatus = result[0].parcel_status;

        if (cabinetStatus === 3 && parcelStatus === 3) {
          // Cabinet is open and parcel is in the pickup locker

          // Update cabinet status to empty (1)
          await pool.promise().query('UPDATE locker SET cabinet_status = 1 WHERE locker_number = ?', [result[0].locker_number]);

          // Update parcel status to delivered (4)
          await pool.promise().query('UPDATE parcel SET parcel_status = 4 WHERE parcel_pickup_code = ?', [pickupCode]);

          // Invalidate the pickup code 
        //   set it to -1 so that it can't be used again
          await pool.promise().query('UPDATE parcel SET parcel_pickup_code = -1 WHERE parcel_pickup_code = ?', [pickupCode]);

          return true; // Code is valid, and actions are performed
        }
      }

      return false; // Code is invalid or conditions are not met
    } catch (error) {
      console.error('Error verifying pickup code and updating statuses:', error);
      throw error;
    }
  },


  // Verify dropoff code
  verifyDropoffCode: async (dropoffCode: number): Promise<boolean> => {
    try {
      const query = `
        SELECT parcel_dropoff_code, locker.cabinet_status, parcel.parcel_status
        FROM parcel
        INNER JOIN locker ON parcel.locker_number = locker.locker_number
        WHERE parcel_dropoff_code = ?`;

      const [result] = await pool.promise().query<RowDataPacket[]>(query, [dropoffCode]);

      if (result.length > 0) {
        const cabinetStatus = result[0].cabinet_status;
        const parcelStatus = result[0].parcel_status;

        if (cabinetStatus === 1 && parcelStatus === 1) {
          // Cabinet is open for dropoff and parcel is ready for dropoff

          // Update cabinet status to package to dropoff (2)
          await pool.promise().query('UPDATE locker SET cabinet_status = 2 WHERE locker_number = ?', [result[0].locker_number]);

          // Update parcel status to in the dropoff locker (1)
          await pool.promise().query('UPDATE parcel SET parcel_status = 1 WHERE parcel_dropoff_code = ?', [dropoffCode]);

          // Invalidate the dropoff code 
          // set it to -1 so that it can't be used again
          await pool.promise().query('UPDATE parcel SET parcel_dropoff_code = -1 WHERE parcel_dropoff_code = ?', [dropoffCode]);

          return true; // Code is valid, and actions are performed
        }
      }

      return false; // Code is invalid or conditions are not met
    } catch (error) {
      console.error('Error verifying dropoff code and updating statuses:', error);
      throw error;
    }
  },

};

export default cabinet_model;
