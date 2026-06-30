import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import authRoutes from './routes/authRoutes';
import settingsRoutes from './routes/settingsRoutes';
import calendarRoutes from './routes/calendarRoutes';
import { startScheduler } from './utils/scheduler';

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
app.use('/api/settings', settingsRoutes);
app.use('/api/calendar', calendarRoutes);

// Health check endpoint
app.use('/ping', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
  
  // Start the background jobs (auto-sync and reminders)
  startScheduler();
});

// Prevent Node from exiting cleanly by keeping the event loop busy
setInterval(() => {}, 1000 * 60 * 60);

export default app;
