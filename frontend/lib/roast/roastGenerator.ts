import { MoodType } from '../mood/moodEngine';
import { getTrainer } from './datasetTrainer';

export interface Roast {
  text: string;
  intensity: 'funny' | 'brutal' | 'sarcastic';
  category: string;
}

const ROAST_TEMPLATES = {
  funny: [
    "Your personality is like a software update - nobody asked for it and it takes forever to load",
    "You have the energy of a low battery notification at 2%",
    "Your vibe is giving 'instruction manual that nobody reads'",
    "You're the human equivalent of a pop-up ad",
    "Your personality has the loading time of dial-up internet",
    "You're like a WiFi connection - strong signal but no actual connection",
    "Your energy matches a Windows update - interrupting and unnecessary",
    "You're the 'Skip Intro' button everyone clicks",
    "Your personality is on airplane mode",
    "You're like autocorrect - trying to help but making it worse",
    "Your brain runs on Internet Explorer vibes",
    "You're giving 'Error 404: Personality Not Found'",
    "Your social skills are still buffering...",
    "You're the code that works but nobody knows why",
    "Your life is in beta and it shows",
    "You have the same energy as a broken URL",
    "Your charisma is loading... please wait... still loading...",
    "You're like a laggy livestream - present but unwatchable",
    "Your personality is stuck in safe mode",
    "You're the human version of 'Please verify you are not a robot'"
  ],
  brutal: [
    "Your confidence is inversely proportional to your self-awareness",
    "You bring the same energy as a mandatory company meeting",
    "Your personality is a masterclass in mediocrity",
    "You're the reason people invented the mute button",
    "Your vibe is 'peaked in tutorial mode'",
    "You have the charisma of a terms and conditions page",
    "Your presence is as welcome as a software bug in production",
    "You're the plot hole in your own life story",
    "Your personality is in permanent beta testing",
    "You're the error message nobody wants to debug",
    "Your existence is a Stack Overflow thread with no accepted answer",
    "You're the legacy code everyone's afraid to touch",
    "Your personality failed all unit tests",
    "You're the merge conflict nobody wants to resolve",
    "Your social skills have more bugs than a rushed release",
    "You're like a memory leak - slowly draining everyone's energy",
    "Your vibe is 'deprecated and scheduled for removal'",
    "You're the technical debt nobody wants to pay off"
  ],
  sarcastic: [
    "Oh wow, another deep thought from the philosophy factory",
    "Fascinating insight from the CEO of obvious observations",
    "What a groundbreaking perspective, truly revolutionary",
    "Your wisdom is almost as impressive as your humility",
    "That's definitely a thought you just had",
    "Incredible how you make simple things sound complicated",
    "Your self-awareness is truly inspiring... said no one",
    "What a unique take, never heard that before... this hour",
    "Your confidence is admirable, if only it was justified",
    "That's certainly one way to interpret reality",
    "Wow, did you just Google that?",
    "Amazing how you discovered something everyone already knew",
    "Your hot takes are room temperature at best",
    "Congrats on having the most mid opinion possible",
    "Your insights have the depth of a kiddie pool",
    "Peak intellectual energy right there... not"
  ]
};

const MOOD_BASED_ROASTS: Record<MoodType, string[]> = {
  confident: [
    "All that confidence and still reading the room wrong",
    "Sigma grindset but grinding in the wrong direction",
    "Main character energy in a background character life",
    "Boss vibes with employee execution",
    "Your confidence has more bugs than Windows Vista",
    "Flexing like a CPU at 100% but outputting nothing"
  ],
  funny: [
    "Trying to be the class clown but jokes on you",
    "Your humor is like expired milk - it was funny once",
    "Comedy gold? More like comedy participation award",
    "Your jokes load slower than a 1990s webpage",
    "Humor.exe has stopped working"
  ],
  sad: [
    "Even your sadness is on energy-saving mode",
    "Your vibe is 'sad playlist at 3 AM' but make it worse",
    "Collecting red flags like they're pokemon cards",
    "Your sadness has the depth of a Twitter thread",
    "Even your depression is low effort"
  ],
  reflective: [
    "All that thinking and still no conclusions",
    "Overthinking champion of the year",
    "Deep thoughts, shallow impact",
    "Your brain's running background processes but producing nothing",
    "Thinking hard but ideas.exe crashed"
  ],
  neutral: [
    "Your personality is on do not disturb mode",
    "Bringing 'unmemorable' to a whole new level",
    "The human equivalent of gray",
    "Your vibe is default settings - unchanged and boring",
    "You're like a blank text file - technically present but empty"
  ]
};

function selectRandomRoast(array: string[]): string {
  return array[Math.floor(Math.random() * array.length)];
}

function analyzeMessageContext(text: string, username?: string): string | null {
  if (!text) return null;
  
  const lowerText = text.toLowerCase();
  const name = username || 'buddy';
  
  // Analyze message patterns
  if (lowerText.length < 5) {
    const shortMessages = [
      `One-word answers, ${name}? Your conversation skills are showing.`,
      `Short and sweet? More like short and disappointing, ${name}.`,
      `Using bare minimum effort, I see. Classic ${name} move.`,
      `Wow, such eloquence, ${name}. Did you rehearse that?`,
      `Your message has fewer characters than your personality, ${name}`,
      `Is your keyboard broken or is this peak effort, ${name}?`
    ];
    return selectRandomRoast(shortMessages);
  }
  
  if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
    const greetingRoasts = [
      `Starting with 'hi', ${name}? Your creativity is as bright as a dead pixel.`,
      `What a groundbreaking opening, ${name}. Did you workshop that greeting?`,
      `Hi back, ${name}. Is that the extent of your conversational arsenal?`,
      `Hello ${name}! Your small talk is as exciting as watching paint dry.`,
      `'Hi'? That's your opening, ${name}? Even NPCs have better dialogue.`,
      `Your greeting is giving 'default text message' energy, ${name}`,
      `Wow, 'hi' ${name}. Did that take you long to come up with?`
    ];
    return selectRandomRoast(greetingRoasts);
  }
  
  if (lowerText.includes('roast me') || lowerText.includes('roast')) {
    const metaRoasts = [
      `Asking to be roasted, ${name}? Your self-esteem already did that for you.`,
      `You're literally begging for attention, ${name}. That's the real roast.`,
      `Don't worry, your life choices already roasted you better than I ever could, ${name}.`,
      `Imagine asking an AI to validate your insecurities, ${name}. Bold strategy.`,
      `Asking an AI for roasts, ${name}? Your social life must be thriving.`,
      `You need an AI to roast you, ${name}? Can't do that yourself in the mirror?`
    ];
    return selectRandomRoast(metaRoasts);
  }
  
  if (lowerText.includes('?')) {
    const questionRoasts = [
      `Asking questions you could've Googled, ${name}. Peak efficiency.`,
      `Questions, questions, ${name}... but no interesting ones.`,
      `Your curiosity is as deep as a puddle, ${name}.`,
      `Asking the real hard-hitting questions... not, ${name}.`,
      `Google exists but here you are asking me, ${name}. Interesting choice.`,
      `Your question has 'I didn't even try to Google this' energy, ${name}`
    ];
    return selectRandomRoast(questionRoasts);
  }
  
  if (lowerText.includes('lol') || lowerText.includes('haha') || lowerText.includes('lmao')) {
    const laughRoasts = [
      `Laughing at your own jokes, ${name}? That's sadder than the jokes themselves.`,
      `Using 'lol' as punctuation, ${name}. How very 2010 of you.`,
      `Your sense of humor called, ${name} - it wants a refund.`,
      `Fake laughing through text, ${name}. The desperation is real.`,
      `'Lol' isn't a personality trait, just so you know, ${name}.`,
      `Adding 'lol' doesn't make your message funny, try harder ${name}`
    ];
    return selectRandomRoast(laughRoasts);
  }
  
  if (lowerText.split(' ').length > 30) {
    const verboseRoasts = [
      "Writing a novel? Nobody asked for your autobiography.",
      "TL;DR - your message is as long as it is unnecessary.",
      "All those words and still said nothing of value.",
      "Your message has more filler than a reality TV show.",
      "That's a lot of words to say nothing at all.",
      "I lost interest halfway through and I'm literally programmed to respond"
    ];
    return selectRandomRoast(verboseRoasts);
  }
  
  return null;
}

export function generateRoast(
  intensity: 'funny' | 'brutal' | 'sarcastic',
  mood?: MoodType,
  userText?: string,
  username?: string
): Roast {
  let text: string;
  
  // Strategy: Use trained model 70% of the time, fallback to templates 30%
  const useTrainedModel = Math.random() > 0.3;
  
  if (useTrainedModel && userText) {
    try {
      const trainer = getTrainer();
      const trainedRoast = trainer.findBestRoast(userText, intensity);
      
      if (trainedRoast) {
        // Personalize with username if available
        if (username && !trainedRoast.includes(username)) {
          text = trainedRoast.replace(/\.$/, `, ${username}.`);
        } else {
          text = trainedRoast;
        }
        
        return {
          text,
          intensity,
          category: 'trained-model'
        };
      }
    } catch (error) {
      console.error('Error using trained model:', error);
      // Fall through to template-based generation
    }
  }
  
  // Fallback to context-aware roast
  const contextRoast = analyzeMessageContext(userText || '', username);
  if (contextRoast) {
    text = contextRoast;
  } else if (mood && Math.random() > 0.5 && MOOD_BASED_ROASTS[mood]) {
    text = selectRandomRoast(MOOD_BASED_ROASTS[mood]);
  } else {
    text = selectRandomRoast(ROAST_TEMPLATES[intensity]);
  }
  
  return {
    text,
    intensity,
    category: mood || 'general'
  };
}

export function scoreRoast(roast: string): number {
  const words = roast.toLowerCase().split(/\s+/);
  let score = 50;
  
  const impactWords = [
    'masterclass', 'champion', 'legendary', 'epic', 'ultimate',
    'destruction', 'annihilate', 'obliterate', 'savage', 'brutal'
  ];
  
  for (const word of impactWords) {
    if (roast.toLowerCase().includes(word)) {
      score += 10;
    }
  }
  
  if (words.length > 15) score += 5;
  if (roast.includes('?')) score += 5;
  
  return Math.min(score, 100);
}

export function getModelStats() {
  try {
    const trainer = getTrainer();
    return trainer.getStats();
  } catch (error) {
    return {
      totalPatterns: 0,
      uniqueKeywords: 0,
      responseTemplates: 0,
      intensityDistribution: { funny: 0, brutal: 0, sarcastic: 0 },
      error: 'Model not loaded'
    };
  }
}
