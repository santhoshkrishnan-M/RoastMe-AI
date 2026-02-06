'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className = '', glow = false }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative backdrop-blur-xl bg-surface/40 rounded-2xl p-6
        border border-white/10 shadow-2xl
        ${glow ? 'shadow-primary/20' : ''}
        ${className}
      `}
    >
      {glow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-5 blur-xl" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
