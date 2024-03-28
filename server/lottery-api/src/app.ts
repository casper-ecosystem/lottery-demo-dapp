import express, { Request, Response } from 'express';
import accountsRouter from './routes/accounts';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3030;

app.use(express.json());
app.use('/accounts', accountsRouter);


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});