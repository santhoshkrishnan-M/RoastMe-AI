import { Server as SocketIOServer, Socket } from 'socket.io';
import { judgeRoast } from '../services/multiplayer/roastJudge';

interface Player {
  socketId: string;
  userId: string;
  username: string;
  score: number;
  isReady: boolean;
}

interface Room {
  roomCode: string;
  players: Map<string, Player>;
  gameState: 'waiting' | 'playing' | 'finished';
  createdAt: number;
  roasts: Array<{ username: string; message: string; score: number; timestamp: number }>;
}

const rooms = new Map<string, Room>();

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getRoomBySocketId(socketId: string): { room: Room; roomCode: string } | null {
  for (const [roomCode, room] of rooms.entries()) {
    if (room.players.has(socketId)) {
      return { room, roomCode };
    }
  }
  return null;
}

export function initializeMultiplayerSocket(io: SocketIOServer): void {
  io.on('connection', (socket: Socket) => {
    console.log(`[Multiplayer] Client connected: ${socket.id}`);

    // CREATE ROOM
    socket.on('createRoom', ({ userId, username }: { userId: string; username: string }) => {
      try {
        // Check if player is already in a room
        const existingRoom = getRoomBySocketId(socket.id);
        if (existingRoom) {
          socket.emit('error', { message: 'You are already in a room' });
          return;
        }

        const roomCode = generateRoomCode();
        const player: Player = {
          socketId: socket.id,
          userId,
          username,
          score: 0,
          isReady: false
        };

        const room: Room = {
          roomCode,
          players: new Map([[socket.id, player]]),
          gameState: 'waiting',
          createdAt: Date.now(),
          roasts: []
        };

        rooms.set(roomCode, room);
        socket.join(roomCode);

        const playerList = Array.from(room.players.values());
        socket.emit('roomCreated', { roomCode, players: playerList, gameState: room.gameState });
        
        console.log(`[Multiplayer] Room created: ${roomCode} by ${username}`);
      } catch (error) {
        console.error('[Multiplayer] Error creating room:', error);
        socket.emit('error', { message: 'Failed to create room' });
      }
    });

    // JOIN ROOM
    socket.on('joinRoom', ({ roomCode, userId, username }: { roomCode: string; userId: string; username: string }) => {
      try {
        // Validate room code
        if (!roomCode || roomCode.length !== 6) {
          socket.emit('error', { message: 'Invalid room code' });
          return;
        }

        const room = rooms.get(roomCode.toUpperCase());
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if player is already in a room
        const existingRoom = getRoomBySocketId(socket.id);
        if (existingRoom) {
          socket.emit('error', { message: 'You are already in a room' });
          return;
        }

        // Check for duplicate username in the room
        const usernameExists = Array.from(room.players.values()).some(
          p => p.username.toLowerCase() === username.toLowerCase()
        );
        if (usernameExists) {
          socket.emit('error', { message: 'Username already taken in this room' });
          return;
        }

        const player: Player = {
          socketId: socket.id,
          userId,
          username,
          score: 0,
          isReady: false
        };

        room.players.set(socket.id, player);
        socket.join(roomCode);

        const playerList = Array.from(room.players.values());
        socket.emit('roomJoined', { roomCode, players: playerList, gameState: room.gameState, roasts: room.roasts });
        socket.to(roomCode).emit('playerJoined', { player, players: playerList });

        console.log(`[Multiplayer] ${username} joined room: ${roomCode}`);
      } catch (error) {
        console.error('[Multiplayer] Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // LEAVE ROOM
    socket.on('leaveRoom', () => {
      try {
        const roomData = getRoomBySocketId(socket.id);
        if (!roomData) {
          return;
        }

        const { room, roomCode } = roomData;
        const player = room.players.get(socket.id);
        
        room.players.delete(socket.id);
        socket.leave(roomCode);

        if (room.players.size === 0) {
          // Delete empty room
          rooms.delete(roomCode);
          console.log(`[Multiplayer] Room deleted: ${roomCode}`);
        } else {
          // Notify remaining players
          const playerList = Array.from(room.players.values());
          io.to(roomCode).emit('playerLeft', { 
            username: player?.username, 
            players: playerList 
          });
        }

        socket.emit('roomLeft');
        console.log(`[Multiplayer] ${player?.username} left room: ${roomCode}`);
      } catch (error) {
        console.error('[Multiplayer] Error leaving room:', error);
      }
    });

    // SEND ROAST
    socket.on('sendRoast', ({ message }: { message: string }) => {
      try {
        if (!message || message.trim().length === 0) {
          socket.emit('error', { message: 'Roast message cannot be empty' });
          return;
        }

        const roomData = getRoomBySocketId(socket.id);
        if (!roomData) {
          socket.emit('error', { message: 'You are not in a room' });
          return;
        }

        const { room, roomCode } = roomData;
        const player = room.players.get(socket.id);
        if (!player) {
          return;
        }

        // Judge the roast
        const score = judgeRoast(message);
        player.score += score;

        // Store roast
        const roastEntry = {
          username: player.username,
          message: message.trim(),
          score,
          timestamp: Date.now()
        };
        room.roasts.push(roastEntry);

        // Broadcast to room
        io.to(roomCode).emit('roastReceived', roastEntry);

        // Update leaderboard
        const leaderboard = Array.from(room.players.values())
          .sort((a, b) => b.score - a.score)
          .map((p, index) => ({
            rank: index + 1,
            username: p.username,
            score: p.score
          }));

        io.to(roomCode).emit('leaderboardUpdate', { leaderboard });
        io.to(roomCode).emit('scoreUpdate', { 
          userId: player.userId,
          username: player.username, 
          score: player.score 
        });

        console.log(`[Multiplayer] ${player.username} roasted with score ${score}`);
      } catch (error) {
        console.error('[Multiplayer] Error sending roast:', error);
        socket.emit('error', { message: 'Failed to send roast' });
      }
    });

    // SET READY
    socket.on('setReady', ({ ready }: { ready: boolean }) => {
      try {
        const roomData = getRoomBySocketId(socket.id);
        if (!roomData) {
          return;
        }

        const { room, roomCode } = roomData;
        const player = room.players.get(socket.id);
        if (player) {
          player.isReady = ready;
          const playerList = Array.from(room.players.values());
          io.to(roomCode).emit('playerReady', { 
            username: player.username, 
            ready,
            players: playerList 
          });
        }
      } catch (error) {
        console.error('[Multiplayer] Error setting ready:', error);
      }
    });

    // GET LEADERBOARD
    socket.on('getLeaderboard', () => {
      try {
        const roomData = getRoomBySocketId(socket.id);
        if (!roomData) {
          return;
        }

        const { room, roomCode } = roomData;
        const leaderboard = Array.from(room.players.values())
          .sort((a, b) => b.score - a.score)
          .map((p, index) => ({
            rank: index + 1,
            username: p.username,
            score: p.score
          }));

        socket.emit('leaderboardUpdate', { leaderboard });
      } catch (error) {
        console.error('[Multiplayer] Error getting leaderboard:', error);
      }
    });

    // DISCONNECT
    socket.on('disconnect', () => {
      try {
        const roomData = getRoomBySocketId(socket.id);
        if (!roomData) {
          console.log(`[Multiplayer] Client disconnected: ${socket.id}`);
          return;
        }

        const { room, roomCode } = roomData;
        const player = room.players.get(socket.id);
        
        room.players.delete(socket.id);

        if (room.players.size === 0) {
          rooms.delete(roomCode);
          console.log(`[Multiplayer] Room deleted: ${roomCode}`);
        } else {
          const playerList = Array.from(room.players.values());
          io.to(roomCode).emit('playerLeft', { 
            username: player?.username, 
            players: playerList 
          });
        }

        console.log(`[Multiplayer] ${player?.username} disconnected from room: ${roomCode}`);
      } catch (error) {
        console.error('[Multiplayer] Error handling disconnect:', error);
      }
    });
  });

  // Cleanup old rooms (optional)
  setInterval(() => {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    for (const [roomCode, room] of rooms.entries()) {
      if (now - room.createdAt > maxAge && room.players.size === 0) {
        rooms.delete(roomCode);
        console.log(`[Multiplayer] Cleaned up old room: ${roomCode}`);
      }
    }
  }, 60 * 60 * 1000); // Run every hour
}
