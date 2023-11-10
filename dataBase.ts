import mysql, {Pool} from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

    const pool:Pool = mysql.createPool({
        user: 'root',
        host: 'localhost',
        database: 'parcelDelivery',
        password: process.env.DB_PASSWORD,
        port: 3306,
      });
      export default pool;
    