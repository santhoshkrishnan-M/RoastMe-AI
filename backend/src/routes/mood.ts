import express from 'express';
import { detectMood, getMoodDescription } from '../services/mood/moodEngine';

const router = express.Router();

router.post('/detect', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid text input' });
    }
    
    const result = detectMood(text);
    const description = getMoodDescription(result.mood);
    
    res.json({
      ...result,
      description
    });
  } catch (error) {
    console.error('Mood detection error:', error);
    res.status(500).json({ error: 'Failed to detect mood' });
  }
});

export default router;
