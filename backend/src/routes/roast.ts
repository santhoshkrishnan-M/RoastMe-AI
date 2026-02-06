import express from 'express';
import { generateRoast, getModelStats } from '../services/roast/roastGenerator';
import { detectMood } from '../services/mood/moodEngine';

const router = express.Router();

router.post('/generate', (req, res) => {
  try {
    const { intensity, text, username } = req.body;
    
    if (!intensity || !['funny', 'brutal', 'sarcastic'].includes(intensity)) {
      return res.status(400).json({ error: 'Invalid intensity' });
    }
    
    let mood = undefined;
    if (text) {
      const moodResult = detectMood(text);
      mood = moodResult.mood;
    }
    
    const roast = generateRoast(intensity, mood, text, username);
    
    res.json(roast);
  } catch (error) {
    console.error('Roast generation error:', error);
    res.status(500).json({ error: 'Failed to generate roast' });
  }
});

router.get('/model-stats', (req, res) => {
  try {
    const stats = getModelStats();
    res.json({
      success: true,
      stats,
      message: stats.totalPatterns > 0 
        ? `Model trained with ${stats.totalPatterns} patterns`
        : 'Model not loaded, using fallback templates'
    });
  } catch (error) {
    console.error('Model stats error:', error);
    res.status(500).json({ error: 'Failed to get model stats' });
  }
});

export default router;
