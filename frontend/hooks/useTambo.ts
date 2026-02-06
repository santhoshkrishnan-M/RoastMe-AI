import { useEffect, useState } from 'react';
import { tamboEngine } from '@/lib/tambo/tamboEngine';
import { useAppStore } from '@/store/appStore';
import { MoodType } from '../../shared/types';

export function useTambo() {
  const { currentMood } = useAppStore();
  const [activeComponent, setActiveComponent] = useState(tamboEngine.getCurrentUI());

  useEffect(() => {
    if (tamboEngine.shouldTransition(currentMood)) {
      const newUI = tamboEngine.switchUI(currentMood);
      setActiveComponent(newUI);
    }
  }, [currentMood]);

  return {
    activeComponent,
    currentMood: tamboEngine.getCurrentMood(),
    isTransitioning: tamboEngine.isTransitioning(),
    animation: tamboEngine.getTransitionAnimation(currentMood)
  };
}
