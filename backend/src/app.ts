import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = config.port;

// Middlewares
app.use(cors({
  origin: [config.frontendUrl, 'http://localhost:5174'],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing API base prefixes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.use('/ping', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'AI Reminder Assistant Backend is online' });
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

// Prevent Node from exiting cleanly by keeping the event loop busy
setInterval(() => {}, 1000 * 60 * 60);

export default app;
