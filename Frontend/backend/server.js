
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRouter from './contactRoute.js';
import connectDB from './serverdb.js';
import loginRouter from './loginRoute.js';

dotenv.config();

const app = express();

connectDB(); 
app.use(cors());
app.use(express.json());
app.use('/api/loginRouter', loginRouter);

app.use('/api/contact', contactRouter);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
