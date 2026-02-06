export type MoodType = 'funny' | 'neutral' | 'reflective' | 'sad' | 'confident';

export interface MoodResult {
  mood: MoodType;
  confidence: number;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  mood: MoodType;
  timestamp: number;
}

export interface PersonalityScore {
  humor: number;
  emotional: number;
  analytical: number;
  ambition: number;
  social: number;
  creativity: number;
  resilience: number;
}

export interface UserProfile {
  userId: string;
  username: string;
  personalityScore: PersonalityScore;
  dominantMood: MoodType;
  moodHistory: MoodType[];
  messagesAnalyzed: number;
}

export interface RoastBattleRoom {
  roomCode: string;
  players: RoomPlayer[];
  status: 'waiting' | 'active' | 'finished';
  currentRound: number;
  maxRounds: number;
  createdAt: number;
}

export interface RoomPlayer {
  userId: string;
  username: string;
  score: number;
  roasts: string[];
  isReady: boolean;
}

export interface RoastSubmission {
  playerId: string;
  roast: string;
  targetId: string;
  score: number;
  timestamp: number;
}

export interface GameState {
  roomCode: string;
  round: number;
  timeRemaining: number;
  leaderboard: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  rank: number;
}

export interface AdviceRequest {
  category: 'career' | 'discipline' | 'focus' | 'social';
  context: string;
  mood: MoodType;
}

export interface AdviceResponse {
  category: string;
  advice: string;
  tips: string[];
  mood: MoodType;
}
