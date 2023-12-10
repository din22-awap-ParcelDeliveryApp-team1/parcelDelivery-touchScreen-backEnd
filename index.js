"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dataBase_1 = require("./dataBase");
const dropoff_controller_1 = __importDefault(require("./controllers/dropoff_controller"));
const pickup_controller_1 = __importDefault(require("./controllers/pickup_controller"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/locker', dropoff_controller_1.default);
app.use('/locker', pickup_controller_1.default);
const port = process.env.PORT || 3001;
// Test database connection
(0, dataBase_1.getConnection)();
app.get('/', (req, res) => {
    res.status(200).json({ result: 'success' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
