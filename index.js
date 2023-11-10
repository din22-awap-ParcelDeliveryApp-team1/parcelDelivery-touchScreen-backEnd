"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dataBase_1 = __importDefault(require("./dataBase"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = 3001;
// Test database connection
dataBase_1.default.getConnection((err, connection) => {
    if (err) {
        console.error('An error occurred while connecting to the DB');
        return;
    }
    console.log('MySQL Connection established');
    // Example query, change this to whatever you need
    connection.query('SELECT * FROM user', (queryError, results) => {
        connection.release();
        if (queryError) {
            console.error('Error querying the database:', queryError);
            return;
        }
        console.log('Query results:', results);
    });
});
app.get('/', (req, res) => {
    res.status(200).json({ result: 'success' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
