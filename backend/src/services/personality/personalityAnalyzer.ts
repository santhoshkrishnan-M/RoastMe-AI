import { MoodType } from '../mood/moodEngine';

export interface PersonalityTrait {
  name: string;
  score: number;
  description: string;
}

export interface PersonalityProfile {
  overall: string;
  traits: PersonalityTrait[];
  strengths: string[];
  weaknesses: string[];
  moodHistory: MoodType[];
  dominantMood: MoodType;
}

const TRAIT_KEYWORDS = {
  humor: ['laugh', 'funny', 'joke', 'lol', 'haha', 'meme', 'roast'],
  emotional: ['sad', 'happy', 'feel', 'love', 'hate', 'emotion', 'heart'],
  analytical: ['think', 'analyze', 'reason', 'logic', 'understand', 'why', 'how'],
  ambitious: ['goal', 'success', 'achieve', 'win', 'focus', 'drive', 'sigma'],
  social: ['friend', 'people', 'together', 'bro', 'we', 'us', 'everyone'],
  creative: ['create', 'idea', 'imagine', 'dream', 'art', 'design', 'new'],
  resilient: ['strong', 'overcome', 'fight', 'never', 'keep', 'persist', 'continue']
};

function calculateTraitScore(messages: string[], keywords: string[]): number {
  let score = 0;
  const allText = messages.join(' ').toLowerCase();
  
  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = allText.match(regex);
    if (matches) score += matches.length;
  }
  
  return Math.min(score * 10, 100);
}

export function analyzePersonality(
  messages: string[],
  moodHistory: MoodType[]
): PersonalityProfile {
  const traits: PersonalityTrait[] = [
    {
      name: 'Humor',
      score: calculateTraitScore(messages, TRAIT_KEYWORDS.humor),
      description: 'Your ability to find humor and make others laugh'
    },
    {
      name: 'Emotional Intelligence',
      score: calculateTraitScore(messages, TRAIT_KEYWORDS.emotional),
      description: 'Your awareness and expression of emotions'
    },
    {
      name: 'Analytical Thinking',
      score: calculateTraitScore(messages, TRAIT_KEYWORDS.analytical),
      description: 'Your logical and critical thinking abilities'
    },
    {
      name: 'Ambition',
      score: calculateTraitScore(messages, TRAIT_KEYWORDS.ambitious),
      description: 'Your drive and determination to succeed'
    },
    {
      name: 'Social Connection',
      score: calculateTraitScore(messages, TRAIT_KEYWORDS.social),
      description: 'Your engagement with others and community'
    },
    {
      name: 'Creativity',
      score: calculateTraitScore(messages, TRAIT_KEYWORDS.creative),
      description: 'Your imaginative and innovative mindset'
    },
    {
      name: 'Resilience',
      score: calculateTraitScore(messages, TRAIT_KEYWORDS.resilient),
      description: 'Your mental toughness and perseverance'
    }
  ];
  
  const moodCounts: Record<MoodType, number> = {
    funny: 0,
    sad: 0,
    confident: 0,
    reflective: 0,
    neutral: 0
  };
  
  moodHistory.forEach(mood => {
    moodCounts[mood]++;
  });
  
  const dominantMood = (Object.entries(moodCounts) as [MoodType, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
  
  const topTraits = [...traits].sort((a, b) => b.score - a.score);
  const strengths = topTraits.slice(0, 3).map(t => t.name);
  const weaknesses = topTraits.slice(-2).map(t => t.name);
  
  let overall = 'Balanced Individual';
  if (topTraits[0].score > 70) {
    overall = `${topTraits[0].name}-Driven Personality`;
  }
  
  return {
    overall,
    traits,
    strengths,
    weaknesses,
    moodHistory: moodHistory.slice(-10),
    dominantMood
  };
}
