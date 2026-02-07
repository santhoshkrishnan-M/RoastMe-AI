/**
 * AI Roast Judge - Rule-based scoring system for roast battles
 * Scores roasts based on multiple factors: length, humor, intensity, creativity
 */

const HUMOR_KEYWORDS = [
  'lol', 'haha', 'lmao', 'rofl', 'hilarious', 'funny', 'joke', 'comedy',
  'wit', 'clever', 'brilliant', 'genius', 'epic', 'savage', 'brutal',
  'destroyed', 'murdered', 'obliterated', 'annihilated', 'wrecked'
];

const ROAST_INTENSITY_KEYWORDS = [
  'ugly', 'stupid', 'dumb', 'idiot', 'loser', 'failure', 'pathetic',
  'worthless', 'useless', 'trash', 'garbage', 'terrible', 'awful',
  'horrible', 'disgusting', 'gross', 'nasty', 'weak', 'lame', 'cringe',
  'embarrassing', 'shameful', 'disappointing', 'mediocre', 'basic',
  'boring', 'bland', 'unoriginal', 'cliche', 'predictable'
];

const CREATIVITY_KEYWORDS = [
  'like', 'as if', 'looks like', 'reminds me', 'imagine', 'picture',
  'probably', 'definitely', 'clearly', 'obviously', 'literally',
  'basically', 'technically', 'actually', 'honestly', 'seriously'
];

const PUNCTUATION_INTENSITY = ['!', '?', '...', '!!', '???', '!!!'];

export function judgeRoast(message: string): number {
  let score = 0;
  const lowerMessage = message.toLowerCase();
  const words = lowerMessage.split(/\s+/);
  const wordCount = words.length;

  // 1. LENGTH SCORE (0-20 points)
  // Optimal roast length: 10-30 words
  if (wordCount >= 5 && wordCount <= 10) {
    score += 10;
  } else if (wordCount > 10 && wordCount <= 20) {
    score += 15;
  } else if (wordCount > 20 && wordCount <= 30) {
    score += 20;
  } else if (wordCount > 30 && wordCount <= 50) {
    score += 15;
  } else if (wordCount > 50) {
    score += 10;
  } else {
    score += 5; // Too short
  }

  // 2. HUMOR KEYWORDS (0-25 points)
  let humorCount = 0;
  for (const keyword of HUMOR_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      humorCount++;
    }
  }
  score += Math.min(humorCount * 5, 25);

  // 3. ROAST INTENSITY (0-30 points)
  let intensityCount = 0;
  for (const keyword of ROAST_INTENSITY_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      intensityCount++;
    }
  }
  score += Math.min(intensityCount * 6, 30);

  // 4. CREATIVITY MARKERS (0-15 points)
  let creativityCount = 0;
  for (const keyword of CREATIVITY_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      creativityCount++;
    }
  }
  score += Math.min(creativityCount * 3, 15);

  // 5. PUNCTUATION INTENSITY (0-10 points)
  let punctuationScore = 0;
  for (const punct of PUNCTUATION_INTENSITY) {
    if (message.includes(punct)) {
      punctuationScore += 2;
    }
  }
  score += Math.min(punctuationScore, 10);

  // 6. CAPITALIZATION (0-5 points)
  const capsWords = message.split(/\s+/).filter(word => 
    word === word.toUpperCase() && word.length > 2
  );
  if (capsWords.length > 0) {
    score += Math.min(capsWords.length * 2, 5);
  }

  // 7. QUESTION OR RHETORICAL (0-5 points)
  if (message.includes('?')) {
    score += 5;
  }

  // 8. RANDOMNESS FACTOR (0-10 points)
  // Add some controlled randomness for variety
  const randomBonus = Math.floor(Math.random() * 11);
  score += randomBonus;

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return Math.round(score);
}

export function getRoastFeedback(score: number): string {
  if (score >= 90) {
    return '🔥 LEGENDARY ROAST! Absolutely devastating!';
  } else if (score >= 75) {
    return '💥 BRUTAL! That was savage!';
  } else if (score >= 60) {
    return '👊 SOLID ROAST! Nice hit!';
  } else if (score >= 40) {
    return '😐 Decent attempt, but could be spicier.';
  } else if (score >= 20) {
    return '😬 Weak roast. Try harder!';
  } else {
    return '💤 That was barely a roast...';
  }
}
