import { create } from 'zustand';
import { RoastBattleRoom, LeaderboardEntry } from '../../shared/types';

interface MultiplayerState {
  currentRoom: RoastBattleRoom | null;
  leaderboard: LeaderboardEntry[];
  isInRoom: boolean;
  
  setCurrentRoom: (room: RoastBattleRoom | null) => void;
  updateRoom: (room: RoastBattleRoom) => void;
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
  setInRoom: (inRoom: boolean) => void;
  leaveRoom: () => void;
}

export const useMultiplayerStore = create<MultiplayerState>((set) => ({
  currentRoom: null,
  leaderboard: [],
  isInRoom: false,

  setCurrentRoom: (room) =>
    set({
      currentRoom: room,
      isInRoom: room !== null
    }),

  updateRoom: (room) => set({ currentRoom: room }),

  setLeaderboard: (leaderboard) => set({ leaderboard }),

  setInRoom: (inRoom) => set({ isInRoom: inRoom }),

  leaveRoom: () =>
    set({
      currentRoom: null,
      leaderboard: [],
      isInRoom: false
    })
}));
