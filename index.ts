import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import pool from './dataBase';
import cabinet_controller from './controllers/cabinet_controller';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/cabinet', cabinet_controller);

const port: number = 3001;

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('An error occurred while connecting to the DB');
        return;
    }
    console.log('MySQL Connection established');

});

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ result: 'success' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

