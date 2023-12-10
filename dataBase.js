"use strict";
// import mysql, {Pool} from 'mysql2';
// import dotenv from 'dotenv';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.getConnection = void 0;
// dotenv.config();
//     const pool:Pool = mysql.createPool({
//         user: process.env.DB_USER||'root',
//         host:  process.env.DB_HOST ||'localhost',
//         database:process.env.DB_NAME || 'parcelDelivery',
//         password: process.env.DB_PASSWORD,
//         connectionLimit: 10,
//       });
//       export default pool;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
let pool = null;
exports.pool = pool;
function getConnection() {
    console.log('initConnection');
    try {
        // The environment variables are set in the Azure App Service application settings
        // If the environment variable is not set, then use the default value for development in localhost
        let dbConfig = {
            user: process.env.DB_USER || 'root',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'parcelDelivery',
            password: process.env.DB_PASSWORD,
            connectionLimit: 10,
        };
        // WEBSITE_RESOURCE_GROUP is a special environment variable set by Azure App Service
        // It is only set if the app is running in Azure App Service
        if (process.env.WEBSITE_RESOURCE_GROUP != undefined) {
            // We are running in Azure App Service
            // Use Azure Database for MySQL
            dbConfig.ssl = {
                ca: fs_1.default.readFileSync("./azure-db-ssl-cert/DigiCertGlobalRootCA.crt.pem"),
            };
        }
        exports.pool = pool = promise_1.default.createPool(dbConfig);
    }
    catch (err) {
        console.log(err);
    }
}
exports.getConnection = getConnection;
;
