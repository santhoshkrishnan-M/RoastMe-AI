import { useEffect, useState } from 'react';
import { socketService } from '@/lib/socket/socketService';
import { useAppStore } from '@/store/appStore';
import { useMultiplayerStore } from '@/store/multiplayerStore';

interface Player {
  socketId: string;
  userId: string;
  username: string;
  score: number;
  isReady: boolean;
}

interface RoastEntry {
  username: string;
  message: string;
  score: number;
  timestamp: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
}

export function useMultiplayer() {
  const { userId, username } = useAppStore();
  const { setCurrentRoom, updateRoom, setLeaderboard, leaveRoom: leaveRoomStore, setInRoom } = useMultiplayerStore();
  const [error, setError] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [roasts, setRoasts] = useState<RoastEntry[]>([]);

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    // Room Created
    socket.on('roomCreated', ({ roomCode, players: playerList, gameState }: any) => {
      console.log('[Multiplayer] Room created:', roomCode);
      setCurrentRoom({ roomCode, players: playerList, gameState, roasts: [] });
      setInRoom(true);
      setPlayers(playerList);
      setError('');
    });

    // Room Joined
    socket.on('roomJoined', ({ roomCode, players: playerList, gameState, roasts: roastList }: any) => {
      console.log('[Multiplayer] Joined room:', roomCode);
      setCurrentRoom({ roomCode, players: playerList, gameState, roasts: roastList });
      setInRoom(true);
      setPlayers(playerList);
      setRoasts(roastList || []);
      setError('');
    });

    // Player Joined
    socket.on('playerJoined', ({ player, players: playerList }: any) => {
      console.log('[Multiplayer] Player joined:', player.username);
      setPlayers(playerList);
      updateRoom({ players: playerList });
    });

    // Player Left
    socket.on('playerLeft', ({ username: leftUsername, players: playerList }: any) => {
      console.log('[Multiplayer] Player left:', leftUsername);
      setPlayers(playerList);
      updateRoom({ players: playerList });
    });

    // Room Left
    socket.on('roomLeft', () => {
      console.log('[Multiplayer] You left the room');
      setInRoom(false);
      setPlayers([]);
      setRoasts([]);
      setCurrentRoom(null);
      setError('');
    });

    // Roast Received
    socket.on('roastReceived', (roastEntry: RoastEntry) => {
      console.log('[Multiplayer] Roast received:', roastEntry);
      setRoasts(prev => [...prev, roastEntry]);
    });

    // Score Update
    socket.on('scoreUpdate', ({ userId: updatedUserId, username: updatedUsername, score }: any) => {
      console.log('[Multiplayer] Score updated:', updatedUsername, score);
      setPlayers(prev => 
        prev.map(p => 
          p.userId === updatedUserId ? { ...p, score } : p
        )
      );
    });

    // Leaderboard Update
    socket.on('leaderboardUpdate', ({ leaderboard }: { leaderboard: LeaderboardEntry[] }) => {
      console.log('[Multiplayer] Leaderboard updated');
      setLeaderboard(leaderboard);
    });

    // Player Ready
    socket.on('playerReady', ({ username: readyUsername, ready, players: playerList }: any) => {
      console.log('[Multiplayer] Player ready:', readyUsername, ready);
      setPlayers(playerList);
    });

    // Error
    socket.on('error', ({ message }: { message: string }) => {
      console.error('[Multiplayer] Error:', message);
      setError(message);
      setTimeout(() => setError(''), 5000);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('playerJoined');
      socket.off('playerLeft');
      socket.off('roomLeft');
      socket.off('roastReceived');
      socket.off('scoreUpdate');
      socket.off('leaderboardUpdate');
      socket.off('playerReady');
      socket.off('error');
    };
  }, [setCurrentRoom, updateRoom, setLeaderboard, setInRoom]);

  const createRoom = () => {
    const socket = socketService.getSocket();
    if (!socket) {
      console.error('[Multiplayer] Socket not connected');
      return;
    }
    console.log('[Multiplayer] Creating room...');
    socket.emit('createRoom', { userId, username });
  };

  const joinRoom = (roomCode: string) => {
    const socket = socketService.getSocket();
    if (!socket) {
      console.error('[Multiplayer] Socket not connected');
      return;
    }
    console.log('[Multiplayer] Joining room:', roomCode);
    socket.emit('joinRoom', { roomCode: roomCode.toUpperCase(), userId, username });
  };

  const leaveRoom = () => {
    const socket = socketService.getSocket();
    if (!socket) return;
    console.log('[Multiplayer] Leaving room...');
    socket.emit('leaveRoom');
    leaveRoomStore();
  };

  const setReady = (ready: boolean) => {
    const socket = socketService.getSocket();
    if (!socket) return;
    console.log('[Multiplayer] Setting ready:', ready);
    socket.emit('setReady', { ready });
  };

  const sendRoast = (message: string) => {
    const socket = socketService.getSocket();
    if (!socket) {
      console.error('[Multiplayer] Socket not connected');
      return;
    }
    if (!message || message.trim().length === 0) {
      setError('Roast message cannot be empty');
      setTimeout(() => setError(''), 3000);
      return;
    }
    console.log('[Multiplayer] Sending roast:', message);
    socket.emit('sendRoast', { message: message.trim() });
  };

  const getLeaderboard = () => {
    const socket = socketService.getSocket();
    if (!socket) return;
    socket.emit('getLeaderboard');
  };

  return {
    createRoom,
    joinRoom,
    leaveRoom,
    setReady,
    sendRoast,
    getLeaderboard,
    error,
    players,
    roasts
  };
}
