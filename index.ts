import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import pool from './dataBase';

const app: Express = express();
app.use(cors());
app.use(express.json());

const port: number = 3001;

// Test database connection
pool.getConnection((err, connection) => {
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

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ result: 'success' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
