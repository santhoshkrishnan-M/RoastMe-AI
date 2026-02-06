import express from 'express';
import { multiplayerService } from '../services/multiplayer/multiplayerService';

const router = express.Router();

router.get('/:roomCode', (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = multiplayerService.getRoom(roomCode);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Failed to get room' });
  }
});

router.get('/:roomCode/leaderboard', (req, res) => {
  try {
    const { roomCode } = req.params;
    const leaderboard = multiplayerService.getLeaderboard(roomCode);
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

export default router;
