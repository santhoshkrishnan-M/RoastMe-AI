import { useEffect, useState } from 'react';
import { socketService } from '@/lib/socket/socketService';
import { useAppStore } from '@/store/appStore';
import { SOCKET_EVENTS } from '../../shared/constants';
import { ChatMessage, MoodResult } from '../../shared/types';

export function useSocket() {
  const { userId, username, setConnected, setCurrentMood, addMoodToHistory, addMessage } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!userId || !username || isInitialized) return;

    const socket = socketService.connect(userId, username);

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on(SOCKET_EVENTS.CHAT_RESPONSE, (message: ChatMessage) => {
      addMessage(message);
    });

    socket.on(SOCKET_EVENTS.MOOD_UPDATE, (moodResult: MoodResult) => {
      setCurrentMood(moodResult.mood);
      addMoodToHistory(moodResult.mood);
    });

    setIsInitialized(true);

    return () => {
      if (isInitialized) {
        socketService.disconnect();
        setConnected(false);
      }
    };
  }, [userId, username, isInitialized]);

  return {
    socket: socketService.getSocket(),
    isConnected: socketService.isConnected(),
    sendMessage: (text: string) => socketService.sendChatMessage(text, userId, username)
  };
}
