'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const DATA = [
  { trait: 'Patience', value: 45 },
  { trait: 'Focus', value: 60 },
  { trait: 'Organization', value: 50 },
  { trait: 'Communication', value: 55 },
  { trait: 'Consistency', value: 48 },
];

export function WeaknessRadar() {
  return (
    <GlassCard className="space-y-6" glow>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Growth Areas</h2>
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={DATA}>
            <PolarGrid stroke="#ffffff20" />
            <PolarAngleAxis
              dataKey="trait"
              tick={{ fill: '#A3A9B8', fontSize: 12 }}
            />
            <Radar
              name="Growth Areas"
              dataKey="value"
              stroke="#9D7FFF"
              fill="#9D7FFF"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Improvement Tips</h3>
        <ul className="space-y-2">
          {DATA.slice(0, 3).map((item) => (
            <motion.li
              key={item.trait}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-text-secondary flex items-start gap-2"
            >
              <span className="text-primary mt-1">•</span>
              <span>Work on {item.trait.toLowerCase()} through daily practice and reflection</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}
