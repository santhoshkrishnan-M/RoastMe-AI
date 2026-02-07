export type MoodType = 'funny' | 'neutral' | 'reflective' | 'sad' | 'confident';

export interface MoodScore {
  funny: number;
  sad: number;
  confident: number;
  reflective: number;
  neutral: number;
}

export interface MoodResult {
  mood: MoodType;
  scores: MoodScore;
  confidence: number;
}

const KEYWORD_WEIGHTS = {
  funny: [
    'laugh', 'lol', 'haha', 'lmao', 'joke', 'roast', 'funny', 'bro',
    'savage', 'meme', 'hilarious', 'comedy', 'humor', 'ridiculous',
    'insane', 'wild', 'crazy', 'epic', 'bruh', 'dead', 'dying'
  ],
  sad: [
    'sad', 'tired', 'alone', 'lost', 'broken', 'fail', 'depressed',
    'pain', 'give up', 'stress', 'anxiety', 'worry', 'hopeless',
    'empty', 'hurt', 'crying', 'tears', 'suffering', 'miserable',
    'unhappy', 'difficult', 'hard', 'struggle'
  ],
  confident: [
    'win', 'strong', 'ready', 'powerful', 'focus', 'success', 'sigma',
    'control', 'dominate', 'confident', 'achieve', 'master', 'boss',
    'champion', 'leader', 'unstoppable', 'determined', 'motivated',
    'crushing', 'killing', 'winning', 'best', 'top', 'great'
  ],
  reflective: [
    'think', 'why', 'meaning', 'improve', 'change', 'learn', 'growth',
    'reflect', 'understand', 'wonder', 'curious', 'question', 'ponder',
    'consider', 'realize', 'insight', 'wisdom', 'deep', 'philosophy',
    'perspective', 'introspect', 'contemplate', 'analyze'
  ]
};

const POSITIVE_WORDS = [
  'good', 'great', 'awesome', 'amazing', 'excellent', 'wonderful',
  'fantastic', 'perfect', 'love', 'happy', 'joy', 'glad', 'nice',
  'beautiful', 'brilliant', 'outstanding', 'superb', 'terrific'
];

const NEGATIVE_WORDS = [
  'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'suck',
  'disgusting', 'pathetic', 'miserable', 'dreadful', 'poor', 'weak',
  'useless', 'pointless', 'waste', 'failure', 'wrong'
];

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function calculateKeywordScore(text: string, keywords: string[]): number {
  const normalized = normalizeText(text);
  let score = 0;
  
  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = normalized.match(regex);
    if (matches) {
      score += matches.length;
    }
  }
  
  return score;
}

function getSentimentWeight(text: string): { positive: number; negative: number } {
  const normalized = normalizeText(text);
  let positive = 0;
  let negative = 0;
  
  for (const word of POSITIVE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = normalized.match(regex);
    if (matches) positive += matches.length;
  }
  
  for (const word of NEGATIVE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = normalized.match(regex);
    if (matches) negative += matches.length;
  }
  
  return { positive, negative };
}

function analyzePunctuation(text: string): { excitement: number; question: number } {
  const exclamation = (text.match(/!/g) || []).length;
  const question = (text.match(/\?/g) || []).length;
  
  return {
    excitement: exclamation,
    question
  };
}

function calculateMoodScores(text: string): MoodScore {
  const funnyScore = calculateKeywordScore(text, KEYWORD_WEIGHTS.funny);
  const sadScore = calculateKeywordScore(text, KEYWORD_WEIGHTS.sad);
  const confidentScore = calculateKeywordScore(text, KEYWORD_WEIGHTS.confident);
  const reflectiveScore = calculateKeywordScore(text, KEYWORD_WEIGHTS.reflective);
  
  const sentiment = getSentimentWeight(text);
  const punctuation = analyzePunctuation(text);
  const wordCount = text.split(/\s+/).length;
  const avgWordLength = text.length / Math.max(wordCount, 1);
  
  let scores: MoodScore = {
    funny: funnyScore,
    sad: sadScore,
    confident: confidentScore,
    reflective: reflectiveScore,
    neutral: 1
  };
  
  if (sentiment.positive > 0) {
    scores.confident += sentiment.positive * 1.5;
    scores.funny += sentiment.positive * 0.8;
  }
  
  if (sentiment.negative > 0) {
    scores.sad += sentiment.negative * 2;
  }
  
  if (punctuation.excitement > 1) {
    scores.funny += punctuation.excitement * 0.7;
    scores.confident += punctuation.excitement * 0.5;
  }
  
  if (punctuation.question > 0) {
    scores.reflective += punctuation.question * 1.2;
  }
  
  if (wordCount > 20 && avgWordLength > 5) {
    scores.reflective += 2;
  }
  
  if (wordCount < 5 && punctuation.excitement === 0) {
    scores.neutral += 1;
  }
  
  return scores;
}

function resolveFinalMood(scores: MoodScore): MoodType {
  const entries = Object.entries(scores) as [MoodType, number][];
  entries.sort((a, b) => b[1] - a[1]);
  
  const topMood = entries[0];
  const secondMood = entries[1];
  
  if (topMood[1] === 0 || (topMood[1] === secondMood[1] && topMood[0] === 'neutral')) {
    return 'neutral';
  }
  
  if (topMood[1] < 2 && topMood[0] !== 'neutral') {
    return 'neutral';
  }
  
  return topMood[0];
}

export function detectMood(text: string): MoodResult {
  if (!text || text.trim().length === 0) {
    return {
      mood: 'neutral',
      scores: { funny: 0, sad: 0, confident: 0, reflective: 0, neutral: 1 },
      confidence: 1.0
    };
  }
  
  const scores = calculateMoodScores(text);
  const mood = resolveFinalMood(scores);
  
  const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);
  const topScore = scores[mood];
  const confidence = Math.min((topScore / Math.max(totalScore, 1)) * 100, 100) / 100;
  
  return {
    mood,
    scores,
    confidence
  };
}

export function getMoodDescription(mood: MoodType): string {
  const descriptions: Record<MoodType, string> = {
    funny: 'You seem to be in a playful and humorous mood',
    sad: 'You appear to be feeling down or struggling',
    confident: 'You are radiating confidence and determination',
    reflective: 'You are in a thoughtful and introspective state',
    neutral: 'You are maintaining a balanced and neutral tone'
  };
  
  return descriptions[mood];
}
