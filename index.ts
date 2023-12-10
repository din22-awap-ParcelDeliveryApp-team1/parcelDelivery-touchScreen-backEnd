import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import {getConnection,pool} from './dataBase';
import dropoff_controller from './controllers/dropoff_controller';
import pickup_controller from './controllers/pickup_controller';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/locker', dropoff_controller);
app.use('/locker', pickup_controller);

const port = process.env.PORT || 3001;

// Test database connection
getConnection() 

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ result: 'success' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});