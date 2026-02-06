import { create } from 'zustand';
import { MoodType, ChatMessage, PersonalityScore } from '../../shared/types';

interface AppState {
  userId: string;
  username: string;
  currentMood: MoodType;
  moodHistory: MoodType[];
  messages: ChatMessage[];
  personalityScore: PersonalityScore | null;
  isConnected: boolean;
  
  setUserId: (userId: string) => void;
  setUsername: (username: string) => void;
  setCurrentMood: (mood: MoodType) => void;
  addMoodToHistory: (mood: MoodType) => void;
  addMessage: (message: ChatMessage) => void;
  setPersonalityScore: (score: PersonalityScore) => void;
  setConnected: (connected: boolean) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  userId: '',
  username: '',
  currentMood: 'neutral',
  moodHistory: [],
  messages: [],
  personalityScore: null,
  isConnected: false,

  setUserId: (userId) => set({ userId }),
  
  setUsername: (username) => set({ username }),
  
  setCurrentMood: (mood) => set({ currentMood: mood }),
  
  addMoodToHistory: (mood) =>
    set((state) => ({
      moodHistory: [...state.moodHistory, mood].slice(-20)
    })),
  
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message]
    })),
  
  setPersonalityScore: (score) => set({ personalityScore: score }),
  
  setConnected: (connected) => set({ isConnected: connected }),
  
  reset: () =>
    set({
      currentMood: 'neutral',
      moodHistory: [],
      messages: [],
      personalityScore: null
    })
}));
