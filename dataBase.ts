// import mysql, {Pool} from 'mysql2';
// import dotenv from 'dotenv';

// dotenv.config();

//     const pool:Pool = mysql.createPool({
//         user: process.env.DB_USER||'root',
//         host:  process.env.DB_HOST ||'localhost',
//         database:process.env.DB_NAME || 'parcelDelivery',
//         password: process.env.DB_PASSWORD,
//         connectionLimit: 10,
//       });
//       export default pool;
    
import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

let pool:Pool | null =null;

function getConnection(){
  console.log('initConnection');
  try{
    // The environment variables are set in the Azure App Service application settings
    // If the environment variable is not set, then use the default value for development in localhost
    let dbConfig:PoolOptions = {
        user: process.env.DB_USER||'root',
        host:  process.env.DB_HOST ||'localhost',
        database:process.env.DB_NAME || 'parcelDelivery',
        password: process.env.DB_PASSWORD,
        connectionLimit: 10,
  };
    // WEBSITE_RESOURCE_GROUP is a special environment variable set by Azure App Service
    // It is only set if the app is running in Azure App Service
    if (process.env.WEBSITE_RESOURCE_GROUP != undefined) {
      // We are running in Azure App Service
      // Use Azure Database for MySQL
      dbConfig.ssl = {
        ca: fs.readFileSync("./azure-db-ssl-cert/DigiCertGlobalRootCA.crt.pem"),
      };
    }
    pool = mysql.createPool(dbConfig);
  } catch (err:any) {
    console.log(err);
  }
};
export {getConnection,pool};