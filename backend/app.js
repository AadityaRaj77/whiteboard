import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import nodeRoutes from './routes/node.routes.js';

import './config/db.js';

import authRoutes from './routes/auth.routes.js';
import boardRoutes from './routes/board.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/board', boardRoutes);
app.use('/ai', aiRoutes);
app.use('/node', nodeRoutes);

export default app;