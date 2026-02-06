'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TamboContextValue {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

const TamboContext = createContext<TamboContextValue | undefined>(undefined);

async function generateRoastResponse(text: string): Promise<string> {
  try {
    // Detect mood first
    const moodResponse = await fetch('http://localhost:4000/api/mood/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const moodData = await moodResponse.json();

    // Generate roast based on detected mood
    const intensity = moodData.mood === 'confident' ? 'brutal' : 
                     moodData.mood === 'sad' ? 'sarcastic' : 'funny';
    
    const roastResponse = await fetch('http://localhost:4000/api/roast/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intensity, text })
    });
    const roastData = await roastResponse.json();

    return roastData.text || "Nice try, but I've seen better from a broken chatbot.";
  } catch (error) {
    console.error('Error generating roast:', error);
    // Fallback roasts if backend is unavailable
    const fallbacks = [
      "Your message has the same energy as a typo in a professional email.",
      "That's the kind of take that gets left on read.",
      "Your vibe is 'sent from my iPhone' but make it sadder.",
      "Bro really thought that was it.",
      "The confidence is admirable, the execution? Not so much.",
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export function TamboProvider({ children, apiKey }: { children: ReactNode; apiKey?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Generate roast based on user's message
      const roastText = await generateRoastResponse(text);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: roastText
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Even my error messages are better than your personality."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TamboContext.Provider value={{ messages, sendMessage, isLoading }}>
      {children}
    </TamboContext.Provider>
  );
}

export function useTambo() {
  const context = useContext(TamboContext);
  if (context === undefined) {
    throw new Error('useTambo must be used within a TamboProvider');
  }
  return context;
}
