import { MoodType } from '../../../shared/types';

export interface TamboUIConfig {
  component: string;
  props: Record<string, any>;
  animation: {
    type: 'fade' | 'slide' | 'scale' | 'blur';
    duration: number;
    ease: string;
  };
}

const MOOD_UI_MAP: Record<MoodType, TamboUIConfig> = {
  funny: {
    component: 'RoastPanel',
    props: {
      variant: 'playful',
      color: '#FF7AC6',
      intensity: 'funny'
    },
    animation: {
      type: 'slide',
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  neutral: {
    component: 'StrengthCard',
    props: {
      variant: 'balanced',
      color: '#A3A9B8'
    },
    animation: {
      type: 'fade',
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  reflective: {
    component: 'WeaknessRadar',
    props: {
      variant: 'introspective',
      color: '#9D7FFF',
      showInsights: true
    },
    animation: {
      type: 'scale',
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  sad: {
    component: 'AdviceGenerator',
    props: {
      variant: 'calm',
      color: '#6B7DFF',
      supportive: true
    },
    animation: {
      type: 'blur',
      duration: 0.6,
      ease: 'easeInOut'
    }
  },
  confident: {
    component: 'SigmaMode',
    props: {
      variant: 'bold',
      color: '#1FD6FF',
      intensity: 'high'
    },
    animation: {
      type: 'slide',
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export class TamboEngine {
  private currentMood: MoodType = 'neutral';
  private previousMood: MoodType = 'neutral';
  private transitionInProgress = false;

  getCurrentUI(): TamboUIConfig {
    return MOOD_UI_MAP[this.currentMood];
  }

  switchUI(newMood: MoodType): TamboUIConfig {
    if (this.transitionInProgress) {
      return this.getCurrentUI();
    }

    this.previousMood = this.currentMood;
    this.currentMood = newMood;
    this.transitionInProgress = true;

    setTimeout(() => {
      this.transitionInProgress = false;
    }, MOOD_UI_MAP[newMood].animation.duration * 1000);

    return this.getCurrentUI();
  }

  getCurrentMood(): MoodType {
    return this.currentMood;
  }

  getPreviousMood(): MoodType {
    return this.previousMood;
  }

  isTransitioning(): boolean {
    return this.transitionInProgress;
  }

  shouldTransition(newMood: MoodType): boolean {
    return newMood !== this.currentMood && !this.transitionInProgress;
  }

  getTransitionAnimation(mood: MoodType) {
    return MOOD_UI_MAP[mood].animation;
  }

  getComponentProps(mood: MoodType) {
    return MOOD_UI_MAP[mood].props;
  }

  reset(): void {
    this.currentMood = 'neutral';
    this.previousMood = 'neutral';
    this.transitionInProgress = false;
  }
}

export const tamboEngine = new TamboEngine();
