import express from 'express';
import { generateAdvice } from '../services/advice/adviceGenerator';
import { AdviceRequest } from '../types';

const router = express.Router();

router.post('/get', (req, res) => {
  try {
    const request: AdviceRequest = req.body;
    
    if (!request.category || !['career', 'discipline', 'focus', 'social'].includes(request.category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    if (!request.mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }
    
    const advice = generateAdvice(request);
    
    res.json(advice);
  } catch (error) {
    console.error('Advice generation error:', error);
    res.status(500).json({ error: 'Failed to generate advice' });
  }
});

export default router;
