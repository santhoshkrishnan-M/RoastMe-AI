import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeSocketServer } from './sockets/socketHandler';
import { initializeMultiplayerSocket } from './sockets/multiplayerSocket';
import moodRoutes from './routes/mood';
import roastRoutes from './routes/roast';
import personalityRoutes from './routes/personality';
import adviceRoutes from './routes/advice';
import roomRoutes from './routes/room';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.use('/api/mood', moodRoutes);
app.use('/api/roast', roastRoutes);
app.use('/api/personality', personalityRoutes);
app.use('/api/advice', adviceRoutes);
app.use('/api/room', roomRoutes);

const io = initializeSocketServer(httpServer);
initializeMultiplayerSocket(io);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server initialized`);
  console.log(`� Multiplayer system ready`);
  console.log(`�🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

export { app, io };
