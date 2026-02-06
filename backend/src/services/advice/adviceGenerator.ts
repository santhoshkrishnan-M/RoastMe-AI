import { AdviceRequest, AdviceResponse } from '../../../shared/types';
import { MoodType } from '../mood/moodEngine';

interface AdviceTemplate {
  advice: string;
  tips: string[];
}

const ADVICE_DATABASE: Record<string, Record<MoodType, AdviceTemplate>> = {
  career: {
    confident: {
      advice: "Channel your confidence into strategic career moves. Focus on high-impact projects that showcase your abilities.",
      tips: [
        "Document your wins and maintain a success portfolio",
        "Seek leadership opportunities in critical projects",
        "Network with industry leaders and mentors",
        "Build your personal brand through thought leadership"
      ]
    },
    reflective: {
      advice: "Use your introspective nature to align career choices with your core values and long-term vision.",
      tips: [
        "Define your career purpose beyond titles and salary",
        "Seek roles that offer growth and learning",
        "Reflect on past experiences to identify patterns",
        "Create a vision board for your ideal career path"
      ]
    },
    sad: {
      advice: "Career struggles are temporary. Focus on small wins and remember why you started this journey.",
      tips: [
        "Break big goals into manageable daily tasks",
        "Celebrate small achievements to build momentum",
        "Seek support from mentors or career coaches",
        "Consider what aspects of work bring you joy"
      ]
    },
    funny: {
      advice: "Your positive energy is a career asset. Use it to build relationships and navigate challenges with grace.",
      tips: [
        "Bring creativity to problem-solving at work",
        "Build a network through genuine connections",
        "Don't take setbacks too seriously - learn and move on",
        "Use humor to diffuse tense workplace situations"
      ]
    },
    neutral: {
      advice: "Your balanced approach allows for rational career decisions. Focus on consistent progress and skill building.",
      tips: [
        "Set clear quarterly goals and track progress",
        "Invest in continuous learning and skill development",
        "Build a diverse professional network",
        "Maintain work-life balance for sustainable growth"
      ]
    }
  },
  discipline: {
    confident: {
      advice: "Your confidence is strong - now pair it with consistent daily habits that compound over time.",
      tips: [
        "Create a morning routine that sets the tone",
        "Use the two-minute rule for starting tasks",
        "Track your habits with a simple system",
        "Stack new habits onto existing ones"
      ]
    },
    reflective: {
      advice: "Transform your reflective nature into disciplined action. Plan deeply, execute consistently.",
      tips: [
        "Journal about your why before starting new habits",
        "Review your progress weekly and adjust",
        "Build systems instead of relying on motivation",
        "Use reflection time to plan the next day"
      ]
    },
    sad: {
      advice: "Start incredibly small. One pushup, one page, one minute. Momentum beats perfection.",
      tips: [
        "Focus on showing up, not achieving perfection",
        "Use the 5-minute rule to overcome resistance",
        "Find an accountability partner for support",
        "Celebrate consistency over intensity"
      ]
    },
    funny: {
      advice: "Make discipline fun. Gamify your habits and reward yourself for consistency.",
      tips: [
        "Create a streak tracker and compete with yourself",
        "Use fun apps or physical trackers",
        "Reward milestones with things you enjoy",
        "Share progress with friends for social motivation"
      ]
    },
    neutral: {
      advice: "Build discipline through systems and routines. Remove decision fatigue with automation.",
      tips: [
        "Design your environment to support good habits",
        "Use implementation intentions: if-then plans",
        "Batch similar tasks to reduce friction",
        "Review and optimize your systems monthly"
      ]
    }
  },
  focus: {
    confident: {
      advice: "Your drive is clear. Now eliminate distractions ruthlessly and protect your deep work time.",
      tips: [
        "Use time blocking for focused work sessions",
        "Turn off all notifications during deep work",
        "Create a dedicated focus environment",
        "Practice single-tasking on high-priority items"
      ]
    },
    reflective: {
      advice: "Mindful focus is your strength. Use meditation and intentional breaks to sustain concentration.",
      tips: [
        "Start work sessions with a brief meditation",
        "Use the Pomodoro technique with reflection breaks",
        "Journal about what pulls your focus",
        "Practice mindfulness throughout the day"
      ]
    },
    sad: {
      advice: "When focus feels impossible, start with five minutes. Build from there with compassion.",
      tips: [
        "Lower the barrier: just show up for 5 minutes",
        "Use background music or ambient sounds",
        "Take frequent breaks to reset mentally",
        "Be kind to yourself on difficult days"
      ]
    },
    funny: {
      advice: "Make focus engaging. Use timers, challenges, and variety to keep your brain interested.",
      tips: [
        "Gamify focus sessions with challenges",
        "Change your environment to stay engaged",
        "Use fun tools and apps to track focus time",
        "Reward yourself after focused work blocks"
      ]
    },
    neutral: {
      advice: "Systematic focus techniques will serve you well. Build a sustainable focus practice.",
      tips: [
        "Use the Eisenhower matrix for prioritization",
        "Schedule focus blocks like important meetings",
        "Minimize context switching between tasks",
        "Track your focus patterns to optimize timing"
      ]
    }
  },
  social: {
    confident: {
      advice: "Your social confidence is magnetic. Use it to build genuine connections and lift others up.",
      tips: [
        "Lead group activities and bring people together",
        "Mentor others who are building confidence",
        "Practice active listening despite confidence",
        "Use your energy to make others feel welcome"
      ]
    },
    reflective: {
      advice: "Quality over quantity in relationships. Your depth creates meaningful connections.",
      tips: [
        "Have deep one-on-one conversations",
        "Share your thoughts and vulnerabilities",
        "Listen actively and ask thoughtful questions",
        "Create space for others to be reflective too"
      ]
    },
    sad: {
      advice: "Connection heals. Reach out even when it feels hard. You don't have to go through this alone.",
      tips: [
        "Send a message to someone you trust",
        "Join supportive online or local communities",
        "Be honest about how you're feeling",
        "Accept help when others offer it"
      ]
    },
    funny: {
      advice: "Your humor is a social superpower. Use it to create joy and authentic connections.",
      tips: [
        "Host gatherings or game nights",
        "Share memes and content that brings joy",
        "Use humor to make others feel comfortable",
        "Balance jokes with genuine conversation"
      ]
    },
    neutral: {
      advice: "Build social connections systematically. Regular touchpoints create strong relationships.",
      tips: [
        "Schedule regular catch-ups with friends",
        "Join clubs or groups aligned with interests",
        "Practice small talk to build rapport",
        "Follow up after meeting new people"
      ]
    }
  }
};

export function generateAdvice(request: AdviceRequest): AdviceResponse {
  const { category, mood } = request;
  
  const template = ADVICE_DATABASE[category]?.[mood] || ADVICE_DATABASE[category].neutral;
  
  return {
    category,
    advice: template.advice,
    tips: template.tips,
    mood
  };
}
