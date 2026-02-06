'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { useAppStore } from '@/store/appStore';
import { useEffect, useState } from 'react';

interface Strength {
  name: string;
  value: number;
  color: string;
}

const DEFAULT_STRENGTHS: Strength[] = [
  { name: 'Resilience', value: 85, color: '#1FD6FF' },
  { name: 'Creativity', value: 72, color: '#FF7AC6' },
  { name: 'Ambition', value: 90, color: '#5A3BFF' },
  { name: 'Social', value: 68, color: '#9D7FFF' },
];

const STRENGTH_COLORS: Record<string, string> = {
  resilience: '#1FD6FF',
  creativity: '#FF7AC6',
  ambition: '#5A3BFF',
  social: '#9D7FFF',
};

export function StrengthCard() {
  const { personalityScore, messages, moodHistory } = useAppStore();
  const [strengths, setStrengths] = useState<Strength[]>(DEFAULT_STRENGTHS);
  const [description, setDescription] = useState<string>(
    "You show exceptional determination and creative problem-solving abilities. Your resilience helps you bounce back from challenges stronger than before."
  );

  useEffect(() => {
    // Fetch personality analysis when we have enough messages
    if (messages.length >= 3) {
      fetchPersonalityAnalysis();
    }
  }, [messages.length]);

  useEffect(() => {
    if (personalityScore) {
      // Map personality scores to strengths
      const dynamicStrengths: Strength[] = [
        { 
          name: 'Resilience', 
          value: personalityScore.resilience, 
          color: STRENGTH_COLORS.resilience 
        },
        { 
          name: 'Creativity', 
          value: personalityScore.creativity, 
          color: STRENGTH_COLORS.creativity 
        },
        { 
          name: 'Ambition', 
          value: personalityScore.ambition, 
          color: STRENGTH_COLORS.ambition 
        },
        { 
          name: 'Social', 
          value: personalityScore.social, 
          color: STRENGTH_COLORS.social 
        },
      ];
      
      setStrengths(dynamicStrengths);
      
      // Generate dynamic description based on top trait
      const topTrait = dynamicStrengths.reduce((max, strength) => 
        strength.value > max.value ? strength : max
      );
      
      const descriptions: Record<string, string> = {
        Resilience: "Your resilience stands out! You have exceptional mental toughness and bounce back from challenges stronger than before.",
        Creativity: "Your creativity shines through! You bring innovative ideas and unique perspectives to everything you do.",
        Ambition: "Your ambition is remarkable! You show strong drive and determination to achieve your goals.",
        Social: "Your social skills are impressive! You connect well with others and thrive in collaborative environments."
      };
      
      setDescription(descriptions[topTrait.name] || descriptions.Resilience);
    }
  }, [personalityScore]);

  const fetchPersonalityAnalysis = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/personality/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => m.text),
          moodHistory: moodHistory
        })
      });
      
      if (response.ok) {
        const profile = await response.json();
        
        // Extract scores from traits
        const scores: any = {
          humor: 0,
          emotional: 0,
          analytical: 0,
          ambition: 0,
          social: 0,
          creativity: 0,
          resilience: 0
        };
        
        profile.traits.forEach((trait: any) => {
          const key = trait.name.toLowerCase().replace(' ', '');
          if (key.includes('humor')) scores.humor = trait.score;
          else if (key.includes('emotional')) scores.emotional = trait.score;
          else if (key.includes('analytical')) scores.analytical = trait.score;
          else if (key.includes('ambition')) scores.ambition = trait.score;
          else if (key.includes('social')) scores.social = trait.score;
          else if (key.includes('creativity')) scores.creativity = trait.score;
          else if (key.includes('resilience')) scores.resilience = trait.score;
        });
        
        useAppStore.getState().setPersonalityScore(scores);
      }
    } catch (error) {
      console.error('Failed to fetch personality analysis:', error);
    }
  };

  return (
    <GlassCard className="space-y-6" glow>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Your Strengths</h2>
        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
          <span className="text-2xl">💪</span>
        </div>
      </div>

      <div className="space-y-4">
        {strengths.map((strength, index) => (
          <motion.div
            key={strength.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-primary font-medium">{strength.name}</span>
              <span className="text-text-secondary">{strength.value}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${strength.value}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: strength.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
        <p className="text-text-primary text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </GlassCard>
  );
}
