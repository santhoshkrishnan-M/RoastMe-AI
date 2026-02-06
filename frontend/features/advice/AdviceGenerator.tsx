'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { useAppStore } from '@/store/appStore';

const CATEGORIES = ['career', 'discipline', 'focus', 'social'] as const;

export function AdviceGenerator() {
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('career');
  const [advice, setAdvice] = useState('');
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentMood } = useAppStore();

  const generateAdvice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/advice/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, mood: currentMood, context: '' })
      });
      const data = await response.json();
      setAdvice(data.advice);
      setTips(data.tips);
    } catch (error) {
      console.error('Failed to generate advice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="space-y-6" glow>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Life Advice</h2>
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <span className="text-2xl">💡</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`
              px-4 py-2 rounded-lg font-medium capitalize transition-all
              ${category === cat
                ? 'bg-primary text-white'
                : 'bg-white/5 text-text-secondary hover:bg-white/10'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {advice && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
            <p className="text-text-primary leading-relaxed">{advice}</p>
          </div>

          {tips.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-text-primary">Action Steps</h3>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm text-text-secondary flex items-start gap-2"
                  >
                    <span className="text-secondary mt-1">•</span>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      <button
        onClick={generateAdvice}
        disabled={isLoading}
        className="w-full py-3 bg-gradient-primary text-white rounded-lg
                 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Get Advice'}
      </button>
    </GlassCard>
  );
}
