import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { multiplayerService } from '../services/multiplayer/multiplayerService';
import { detectMood } from '../services/mood/moodEngine';
import { generateRoast } from '../services/roast/roastGenerator';
import { ChatMessage, MoodResult } from '../types';

const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  CHAT_MESSAGE: 'chat:message',
  CHAT_RESPONSE: 'chat:response',
  MOOD_UPDATE: 'mood:update',
  PERSONALITY_UPDATE: 'personality:update',
  ROOM_CREATE: 'room:create',
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_UPDATE: 'room:update',
  ROAST_SUBMIT: 'roast:submit',
  ROAST_SCORE: 'roast:score',
  GAME_START: 'game:start',
  GAME_END: 'game:end',
  GAME_UPDATE: 'game:update',
  LEADERBOARD_UPDATE: 'leaderboard:update',
  ERROR: 'error',
} as const;

interface SocketData {
  userId: string;
  username: string;
}

export function initializeSocketServer(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('user:register', ({ userId, username }: { userId: string; username: string }) => {
      socket.data.userId = userId;
      socket.data.username = username;
      console.log(`User registered: ${username} (${userId})`);
    });

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, async (data: { text: string; userId: string; username: string }) => {
      try {
        const moodResult = detectMood(data.text);
        
        const userMessage: ChatMessage = {
          id: `${Date.now()}-${Math.random()}`,
          userId: data.userId,
          username: data.username,
          text: data.text,
          mood: moodResult.mood,
          timestamp: Date.now()
        };

        // Send user message back
        socket.emit(SOCKET_EVENTS.CHAT_RESPONSE, userMessage);
        socket.emit(SOCKET_EVENTS.MOOD_UPDATE, {
          mood: moodResult.mood,
          confidence: moodResult.confidence,
          timestamp: Date.now()
        });

        // Generate AI roast response
        const intensity = moodResult.mood === 'confident' ? 'brutal' : 
                         moodResult.mood === 'sad' ? 'sarcastic' : 'funny';
        
        const roast = generateRoast(intensity, moodResult.mood, data.text, data.username);
        
        // Send AI response after a short delay for realism
        setTimeout(() => {
          const aiMessage: ChatMessage = {
            id: `${Date.now()}-${Math.random()}`,
            userId: 'ai',
            username: 'RoastMe AI',
            text: roast.text,
            mood: 'funny',
            timestamp: Date.now()
          };
          
          socket.emit(SOCKET_EVENTS.CHAT_RESPONSE, aiMessage);
        }, 800);
        
      } catch (error) {
        console.error('Error processing chat message:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to process message' });
      }
    });

    socket.on(SOCKET_EVENTS.ROOM_CREATE, ({ userId, username }: { userId: string; username: string }) => {
      try {
        const room = multiplayerService.createRoom(userId, username);
        socket.join(room.roomCode);
        
        socket.emit(SOCKET_EVENTS.ROOM_UPDATE, room);
        console.log(`Room created: ${room.roomCode}`);
      } catch (error) {
        console.error('Error creating room:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to create room' });
      }
    });

    socket.on(SOCKET_EVENTS.ROOM_JOIN, ({ roomCode, userId, username }: { roomCode: string; userId: string; username: string }) => {
      try {
        const room = multiplayerService.joinRoom(roomCode, userId, username);
        
        if (!room) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room not found or full' });
          return;
        }
        
        socket.join(roomCode);
        io.to(roomCode).emit(SOCKET_EVENTS.ROOM_UPDATE, room);
        
        console.log(`User ${username} joined room: ${roomCode}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to join room' });
      }
    });

    socket.on(SOCKET_EVENTS.ROOM_LEAVE, ({ userId }: { userId: string }) => {
      try {
        const room = multiplayerService.getRoomByUserId(userId);
        
        if (room) {
          multiplayerService.leaveRoom(userId);
          socket.leave(room.roomCode);
          
          const updatedRoom = multiplayerService.getRoom(room.roomCode);
          if (updatedRoom) {
            io.to(room.roomCode).emit(SOCKET_EVENTS.ROOM_UPDATE, updatedRoom);
          }
          
          console.log(`User ${userId} left room: ${room.roomCode}`);
        }
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    });

    socket.on('player:ready', ({ userId, ready }: { userId: string; ready: boolean }) => {
      try {
        const room = multiplayerService.setPlayerReady(userId, ready);
        
        if (!room) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room not found' });
          return;
        }
        
        io.to(room.roomCode).emit(SOCKET_EVENTS.ROOM_UPDATE, room);
        
        if (multiplayerService.canStartGame(room.roomCode)) {
          const startedRoom = multiplayerService.startGame(room.roomCode);
          if (startedRoom) {
            io.to(room.roomCode).emit(SOCKET_EVENTS.GAME_START, startedRoom);
          }
        }
      } catch (error) {
        console.error('Error setting player ready:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to update ready status' });
      }
    });

    socket.on(SOCKET_EVENTS.ROAST_SUBMIT, ({ userId, roast, targetId }: { userId: string; roast: string; targetId: string }) => {
      try {
        const submission = multiplayerService.submitRoast(userId, roast, targetId);
        
        if (!submission) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to submit roast' });
          return;
        }
        
        const room = multiplayerService.getRoomByUserId(userId);
        
        if (room) {
          io.to(room.roomCode).emit(SOCKET_EVENTS.ROAST_SCORE, submission);
          
          const leaderboard = multiplayerService.getLeaderboard(room.roomCode);
          io.to(room.roomCode).emit(SOCKET_EVENTS.LEADERBOARD_UPDATE, leaderboard);
        }
      } catch (error) {
        console.error('Error submitting roast:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to submit roast' });
      }
    });

    socket.on('game:nextRound', ({ roomCode }: { roomCode: string }) => {
      try {
        const room = multiplayerService.nextRound(roomCode);
        
        if (!room) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room not found' });
          return;
        }
        
        if (room.status === 'finished') {
          const leaderboard = multiplayerService.getLeaderboard(roomCode);
          io.to(roomCode).emit(SOCKET_EVENTS.GAME_END, { room, leaderboard });
        } else {
          io.to(roomCode).emit(SOCKET_EVENTS.GAME_UPDATE, room);
        }
      } catch (error) {
        console.error('Error advancing round:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to advance round' });
      }
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log(`Client disconnected: ${socket.id}`);
      
      if (socket.data.userId) {
        const room = multiplayerService.getRoomByUserId(socket.data.userId);
        if (room) {
          multiplayerService.leaveRoom(socket.data.userId);
          const updatedRoom = multiplayerService.getRoom(room.roomCode);
          if (updatedRoom) {
            io.to(room.roomCode).emit(SOCKET_EVENTS.ROOM_UPDATE, updatedRoom);
          }
        }
      }
    });
  });

  setInterval(() => {
    multiplayerService.cleanupExpiredRooms();
  }, 30 * 60 * 1000);

  return io;
}
