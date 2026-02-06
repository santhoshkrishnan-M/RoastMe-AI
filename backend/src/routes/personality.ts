import express from 'express';
import { analyzePersonality } from '../services/personality/personalityAnalyzer';
import { MoodType } from '../services/mood/moodEngine';

const router = express.Router();

router.post('/analyze', (req, res) => {
  try {
    const { messages, moodHistory } = req.body;
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages array' });
    }
    
    const moods: MoodType[] = Array.isArray(moodHistory) ? moodHistory : [];
    
    const profile = analyzePersonality(messages, moods);
    
    res.json(profile);
  } catch (error) {
    console.error('Personality analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze personality' });
  }
});

export default router;
