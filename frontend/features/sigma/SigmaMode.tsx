'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';

const SIGMA_QUOTES = [
  "Focus is currency. Distractions are theft.",
  "Your grind speaks louder than your words.",
  "Discipline today, freedom tomorrow.",
  "Results don't negotiate with excuses.",
  "Stay quiet. Work hard. Dominate.",
];

export function SigmaMode() {
  const quote = SIGMA_QUOTES[Math.floor(Math.random() * SIGMA_QUOTES.length)];

  return (
    <GlassCard className="bg-black/60 border-secondary/30" glow>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8 text-center py-8"
      >
        <div className="flex justify-center">
          <div
            className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center"
            style={{ boxShadow: '0 0 40px rgba(31, 214, 255, 0.4)' }}
          >
            <span className="text-4xl">⚡</span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-text-primary tracking-tight">
            SIGMA MODE
          </h2>
          <p className="text-xl text-secondary font-medium">ACTIVATED</p>
        </div>

        <div className="max-w-md mx-auto">
          <p className="text-2xl text-text-primary font-light leading-relaxed italic">
            "{quote}"
          </p>
        </div>

        <div className="flex justify-center gap-8 pt-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">100%</div>
            <div className="text-sm text-text-secondary">Focus</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">0</div>
            <div className="text-sm text-text-secondary">Excuses</div>
          </div>
        </div>
      </motion.div>
    </GlassCard>
  );
}
