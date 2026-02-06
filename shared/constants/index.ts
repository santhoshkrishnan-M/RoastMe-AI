export const COLORS = {
  PRIMARY: '#5A3BFF',
  SECONDARY: '#1FD6FF',
  ACCENT: '#FF7AC6',
  BACKGROUND: '#0A0A12',
  SURFACE: '#151521',
  TEXT_PRIMARY: '#F1F3F8',
  TEXT_SECONDARY: '#A3A9B8',
} as const;

export const MOOD_COLORS: Record<string, string> = {
  funny: '#FF7AC6',
  sad: '#6B7DFF',
  confident: '#1FD6FF',
  reflective: '#9D7FFF',
  neutral: '#A3A9B8',
};

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  
  CHAT_MESSAGE: 'chat:message',
  CHAT_RESPONSE: 'chat:response',
  MOOD_UPDATE: 'mood:update',
  PERSONALITY_UPDATE: 'personality:update',
  
  ROOM_CREATE: 'room:create',
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_UPDATE: 'room:update',
  
  ROAST_SUBMIT: 'roast:submit',
  ROAST_SCORE: 'roast:score',
  
  GAME_START: 'game:start',
  GAME_END: 'game:end',
  GAME_UPDATE: 'game:update',
  
  LEADERBOARD_UPDATE: 'leaderboard:update',
  
  ERROR: 'error',
} as const;

export const GAME_CONFIG = {
  MAX_ROUNDS: 5,
  ROUND_TIME: 60,
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 6,
  ROAST_MIN_LENGTH: 10,
  ROAST_MAX_LENGTH: 200,
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
  VERY_SLOW: 0.8,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  MOOD: '/api/mood',
  PERSONALITY: '/api/personality',
  ROAST: '/api/roast',
  ADVICE: '/api/advice',
  ROOM: '/api/room',
} as const;

export const ROAST_INTENSITIES = ['funny', 'brutal', 'sarcastic'] as const;
export type RoastIntensity = typeof ROAST_INTENSITIES[number];

export const ADVICE_CATEGORIES = ['career', 'discipline', 'focus', 'social'] as const;
export type AdviceCategory = typeof ADVICE_CATEGORIES[number];
