'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { useSocket } from '@/hooks/useSocket';
import { useTambo } from '@/hooks/useTambo';
import { TamboChatInterface } from '@/features/chat/TamboChatInterface';
import { ChatInterface } from '@/features/chat/ChatInterface';
import { RoastPanel } from '@/features/roast/RoastPanel';
import { StrengthCard } from '@/features/personality/StrengthCard';
import { WeaknessRadar } from '@/features/radar/WeaknessRadar';
import { AdviceGenerator } from '@/features/advice/AdviceGenerator';
import { SigmaMode } from '@/features/sigma/SigmaMode';
import { MultiplayerLobby } from '@/features/games/MultiplayerLobby';

const COMPONENTS = {
  RoastPanel,
  StrengthCard,
  WeaknessRadar,
  AdviceGenerator,
  SigmaMode,
};

export default function Home() {
  const { setUserId, setUsername, userId } = useAppStore();
  const [isSetup, setIsSetup] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const { isConnected } = useSocket();
  const { activeComponent, animation } = useTambo();

  useEffect(() => {
    if (!userId) {
      const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setUserId(id);
    }
  }, [userId, setUserId]);

  const handleSetup = () => {
    if (nameInput.trim()) {
      setUsername(nameInput.trim());
      setIsSetup(true);
    }
  };

  if (!isSetup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center space-y-2">
            <motion.h1 
              className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              RoastMe AI
            </motion.h1>
            <motion.p 
              className="text-text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Smart Funny Personality Analyzer with Real-Time Mood Detection
            </motion.p>
          </div>

          <motion.div 
            className="backdrop-blur-xl bg-surface/40 rounded-2xl p-8 border border-white/10 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSetup()}
              placeholder="Enter your name"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                       text-text-primary placeholder-text-secondary text-center
                       focus:outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={handleSetup}
              disabled={!nameInput.trim()}
              className="w-full py-3 bg-gradient-primary text-white rounded-lg
                       font-medium hover:opacity-90 transition-opacity
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Experience
            </button>
          </motion.div>

          <motion.div
            className="text-center text-xs text-text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Real-time mood detection • Dynamic UI • Multiplayer battles
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const ActiveFeature = COMPONENTS[activeComponent.component as keyof typeof COMPONENTS];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              RoastMe AI
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {isConnected ? '🟢 Connected' : '🔴 Connecting...'} • Powered by Tambo SDK
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="backdrop-blur-xl bg-surface/40 rounded-lg px-4 py-2 border border-white/10">
              <span className="text-xs text-text-secondary">Real-time Analysis Active</span>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[600px]">
            <ChatInterface />
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeComponent.component}
                initial={{
                  opacity: 0,
                  ...(animation.type === 'slide' && { x: 50 }),
                  ...(animation.type === 'scale' && { scale: 0.9 }),
                }}
                animate={{
                  opacity: 1,
                  ...(animation.type === 'slide' && { x: 0 }),
                  ...(animation.type === 'scale' && { scale: 1 }),
                }}
                exit={{
                  opacity: 0,
                  ...(animation.type === 'slide' && { x: -50 }),
                  ...(animation.type === 'scale' && { scale: 0.9 }),
                }}
                transition={{ duration: animation.duration }}
              >
                {ActiveFeature && <ActiveFeature />}
              </motion.div>
            </AnimatePresence>

            <MultiplayerLobby />
          </div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-text-secondary py-4"
        >
          Built with Modern Tech Stack • Real-time Mood Detection • Dynamic UI Switching
        </motion.footer>
      </div>
    </div>
  );
}
