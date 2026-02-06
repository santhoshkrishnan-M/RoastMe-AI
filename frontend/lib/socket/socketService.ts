import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '../../../shared/constants';

class SocketService {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    this.url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
  }

  connect(userId: string, username: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(this.url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.socket?.emit('user:register', { userId, username });
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  on(event: string, callback: (...args: any[]) => void): void {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    this.socket?.off(event, callback);
  }

  emit(event: string, data?: any): void {
    this.socket?.emit(event, data);
  }

  sendChatMessage(text: string, userId: string, username: string): void {
    this.emit(SOCKET_EVENTS.CHAT_MESSAGE, { text, userId, username });
  }

  createRoom(userId: string, username: string): void {
    this.emit(SOCKET_EVENTS.ROOM_CREATE, { userId, username });
  }

  joinRoom(roomCode: string, userId: string, username: string): void {
    this.emit(SOCKET_EVENTS.ROOM_JOIN, { roomCode, userId, username });
  }

  leaveRoom(userId: string): void {
    this.emit(SOCKET_EVENTS.ROOM_LEAVE, { userId });
  }

  setPlayerReady(userId: string, ready: boolean): void {
    this.emit('player:ready', { userId, ready });
  }

  submitRoast(userId: string, roast: string, targetId: string): void {
    this.emit(SOCKET_EVENTS.ROAST_SUBMIT, { userId, roast, targetId });
  }

  nextRound(roomCode: string): void {
    this.emit('game:nextRound', { roomCode });
  }
}

export const socketService = new SocketService();
