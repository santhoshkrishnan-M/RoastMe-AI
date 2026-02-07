import { NextRequest, NextResponse } from 'next/server';
import { multiplayerService } from '@/lib/multiplayer/multiplayerService';

export async function GET(
  request: NextRequest,
  { params }: { params: { roomCode: string } }
) {
  try {
    const roomCode = params.roomCode;
    const room = multiplayerService.getRoom(roomCode);
    
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    return NextResponse.json(
      { error: 'Failed to get room' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
