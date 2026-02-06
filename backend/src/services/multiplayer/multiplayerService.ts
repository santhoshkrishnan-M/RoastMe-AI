import { RoastBattleRoom, RoomPlayer, RoastSubmission, LeaderboardEntry } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { scoreRoast } from '../roast/roastGenerator';

export class MultiplayerService {
  private rooms: Map<string, RoastBattleRoom> = new Map();
  private playerRooms: Map<string, string> = new Map();

  generateRoomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    if (this.rooms.has(code)) {
      return this.generateRoomCode();
    }
    
    return code;
  }

  createRoom(userId: string, username: string): RoastBattleRoom {
    const roomCode = this.generateRoomCode();
    
    const room: RoastBattleRoom = {
      roomCode,
      players: [
        {
          userId,
          username,
          score: 0,
          roasts: [],
          isReady: false
        }
      ],
      status: 'waiting',
      currentRound: 0,
      maxRounds: 5,
      createdAt: Date.now()
    };
    
    this.rooms.set(roomCode, room);
    this.playerRooms.set(userId, roomCode);
    
    return room;
  }

  joinRoom(roomCode: string, userId: string, username: string): RoastBattleRoom | null {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return null;
    }
    
    if (room.status !== 'waiting') {
      return null;
    }
    
    if (room.players.length >= 6) {
      return null;
    }
    
    const existingPlayer = room.players.find(p => p.userId === userId);
    if (existingPlayer) {
      return room;
    }
    
    room.players.push({
      userId,
      username,
      score: 0,
      roasts: [],
      isReady: false
    });
    
    this.playerRooms.set(userId, roomCode);
    
    return room;
  }

  leaveRoom(userId: string): boolean {
    const roomCode = this.playerRooms.get(userId);
    
    if (!roomCode) {
      return false;
    }
    
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return false;
    }
    
    room.players = room.players.filter(p => p.userId !== userId);
    this.playerRooms.delete(userId);
    
    if (room.players.length === 0) {
      this.rooms.delete(roomCode);
    }
    
    return true;
  }

  setPlayerReady(userId: string, ready: boolean): RoastBattleRoom | null {
    const roomCode = this.playerRooms.get(userId);
    
    if (!roomCode) {
      return null;
    }
    
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return null;
    }
    
    const player = room.players.find(p => p.userId === userId);
    
    if (player) {
      player.isReady = ready;
    }
    
    return room;
  }

  canStartGame(roomCode: string): boolean {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return false;
    }
    
    if (room.players.length < 2) {
      return false;
    }
    
    return room.players.every(p => p.isReady);
  }

  startGame(roomCode: string): RoastBattleRoom | null {
    const room = this.rooms.get(roomCode);
    
    if (!room || !this.canStartGame(roomCode)) {
      return null;
    }
    
    room.status = 'active';
    room.currentRound = 1;
    
    return room;
  }

  submitRoast(userId: string, roastText: string, targetId: string): RoastSubmission | null {
    const roomCode = this.playerRooms.get(userId);
    
    if (!roomCode) {
      return null;
    }
    
    const room = this.rooms.get(roomCode);
    
    if (!room || room.status !== 'active') {
      return null;
    }
    
    const player = room.players.find(p => p.userId === userId);
    
    if (!player) {
      return null;
    }
    
    const score = scoreRoast(roastText);
    
    player.roasts.push(roastText);
    player.score += score;
    
    const submission: RoastSubmission = {
      playerId: userId,
      roast: roastText,
      targetId,
      score,
      timestamp: Date.now()
    };
    
    return submission;
  }

  nextRound(roomCode: string): RoastBattleRoom | null {
    const room = this.rooms.get(roomCode);
    
    if (!room || room.status !== 'active') {
      return null;
    }
    
    room.currentRound++;
    
    if (room.currentRound > room.maxRounds) {
      room.status = 'finished';
    }
    
    return room;
  }

  getLeaderboard(roomCode: string): LeaderboardEntry[] {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return [];
    }
    
    const sorted = [...room.players].sort((a, b) => b.score - a.score);
    
    return sorted.map((player, index) => ({
      userId: player.userId,
      username: player.username,
      score: player.score,
      rank: index + 1
    }));
  }

  getRoom(roomCode: string): RoastBattleRoom | null {
    return this.rooms.get(roomCode) || null;
  }

  getRoomByUserId(userId: string): RoastBattleRoom | null {
    const roomCode = this.playerRooms.get(userId);
    return roomCode ? this.rooms.get(roomCode) || null : null;
  }

  getAllRooms(): RoastBattleRoom[] {
    return Array.from(this.rooms.values());
  }

  cleanupExpiredRooms(): void {
    const now = Date.now();
    const maxAge = 2 * 60 * 60 * 1000;
    
    for (const [roomCode, room] of this.rooms.entries()) {
      if (now - room.createdAt > maxAge) {
        room.players.forEach(player => {
          this.playerRooms.delete(player.userId);
        });
        this.rooms.delete(roomCode);
      }
    }
  }
}

export const multiplayerService = new MultiplayerService();
