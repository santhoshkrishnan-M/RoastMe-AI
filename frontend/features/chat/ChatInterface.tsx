'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { useSocket } from '@/hooks/useSocket';
import { useAppStore } from '@/store/appStore';
import { MoodIndicator } from '@/components/MoodIndicator';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const { sendMessage } = useSocket();
  const { messages, currentMood } = useAppStore();

  // Track when AI is typing
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.userId !== 'ai') {
        setIsAiTyping(true);
        // Reset after 3 seconds if no response
        const timeout = setTimeout(() => setIsAiTyping(false), 3000);
        return () => clearTimeout(timeout);
      } else {
        setIsAiTyping(false);
      }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage(input);
    setInput('');
    setIsAiTyping(true);
  };

  return (
    <GlassCard className="h-full flex flex-col" glow>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-text-primary">🔥 RoastMe Chat</h2>
        <MoodIndicator mood={currentMood} />
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-text-secondary py-8">
            <p className="text-lg mb-2">Welcome to RoastMe AI!</p>
            <p className="text-sm">Start chatting and I'll roast you based on your messages... 🔥</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.userId === 'ai' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                rounded-lg p-4 border
                ${message.userId === 'ai' 
                  ? 'bg-accent/10 border-accent/30 mr-8' 
                  : 'bg-primary/10 border-primary/30 ml-8'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-semibold ${
                  message.userId === 'ai' ? 'text-accent' : 'text-primary'
                }`}>
                  {message.username}
                </span>
                <span className="text-xs text-text-secondary capitalize">
                  · {message.mood}
                </span>
              </div>
              <p className="text-text-primary whitespace-pre-wrap">{message.text}</p>
            </motion.div>
          ))
        )}
        
        {isAiTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-accent/10 rounded-lg p-4 border border-accent/30 mr-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-accent">RoastMe AI</span>
              <span className="text-xs text-text-secondary">is typing...</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3
                   text-text-primary placeholder-text-secondary
                   focus:outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-primary text-white rounded-lg
                   font-medium hover:opacity-90 transition-opacity"
        >
          Send
        </button>
      </form>
    </GlassCard>
  );
}
