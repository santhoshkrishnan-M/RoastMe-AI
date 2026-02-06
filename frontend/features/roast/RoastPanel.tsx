'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';

const INTENSITIES = ['funny', 'brutal', 'sarcastic'] as const;

export function RoastPanel() {
  const [intensity, setIntensity] = useState<typeof INTENSITIES[number]>('funny');
  const [roast, setRoast] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateRoast = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/roast/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intensity })
      });
      const data = await response.json();
      setRoast(data.text);
    } catch (error) {
      console.error('Failed to generate roast:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateRoast();
  }, []);

  return (
    <GlassCard className="space-y-6" glow>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Roast Generator</h2>
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-2xl">🔥</span>
        </div>
      </div>

      <div className="flex gap-2">
        {INTENSITIES.map((int) => (
          <button
            key={int}
            onClick={() => setIntensity(int)}
            className={`
              px-4 py-2 rounded-lg font-medium capitalize transition-all
              ${intensity === int
                ? 'bg-accent text-white'
                : 'bg-white/5 text-text-secondary hover:bg-white/10'
              }
            `}
          >
            {int}
          </button>
        ))}
      </div>

      {roast && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-accent/10 rounded-xl p-6 border border-accent/20"
        >
          <p className="text-lg text-text-primary leading-relaxed">{roast}</p>
        </motion.div>
      )}

      <button
        onClick={generateRoast}
        disabled={isLoading}
        className="w-full py-3 bg-gradient-accent text-white rounded-lg
                 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Generate New Roast'}
      </button>
    </GlassCard>
  );
}
