'use client';

import { useTambo } from '@/lib/tamboMock/TamboProvider';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { useAppStore } from '@/store/appStore';
import { MoodIndicator } from '@/components/MoodIndicator';

export function TamboChatInterface() {
  const { messages, sendMessage, isLoading } = useTambo();
  const { currentMood, setCurrentMood, addMoodToHistory, addMessage } = useAppStore();

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      
      if (latestMessage.role === 'user' && latestMessage.content) {
        detectMoodFromMessage(latestMessage.content);
        
        addMessage({
          id: `${Date.now()}-${Math.random()}`,
          userId: 'user',
          username: 'You',
          text: latestMessage.content,
          mood: currentMood,
          timestamp: Date.now()
        });
      }
    }
  }, [messages]);

  const detectMoodFromMessage = async (text: string) => {
    try {
      const response = await fetch('http://localhost:4000/api/mood/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const result = await response.json();
      
      if (result.mood) {
        setCurrentMood(result.mood);
        addMoodToHistory(result.mood);
      }
    } catch (error) {
      console.error('Mood detection failed:', error);
    }
  };

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;
    await sendMessage(text);
  };

  return (
    <GlassCard className="h-full flex flex-col" glow>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-text-primary">RoastMe Chat</h2>
        <MoodIndicator mood={currentMood} />
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-text-secondary py-8">
            <p className="text-lg mb-2">Welcome to RoastMe AI!</p>
            <p className="text-sm">Start chatting to see real-time mood analysis...</p>
          </div>
        ) : (
          messages.map((message: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                rounded-lg p-4 border
                ${message.role === 'user' 
                  ? 'bg-primary/10 border-primary/30 ml-8' 
                  : 'bg-white/5 border-white/10 mr-8'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-text-primary">
                  {message.role === 'user' ? 'You' : 'RoastMe AI'}
                </span>
              </div>
              <p className="text-text-primary whitespace-pre-wrap">{message.content}</p>
            </motion.div>
          ))
        )}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10 mr-8"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200" />
            </div>
          </motion.div>
        )}
      </div>

      <TamboMessageInput onSubmit={handleSubmit} disabled={isLoading} />
    </GlassCard>
  );
}

function TamboMessageInput({ onSubmit, disabled }: { onSubmit: (text: string) => void; disabled: boolean }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3
                 text-text-primary placeholder-text-secondary
                 focus:outline-none focus:border-primary transition-colors
                 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="px-6 py-3 bg-gradient-primary text-white rounded-lg
                 font-medium hover:opacity-90 transition-opacity
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  );
}
