import { NextRequest, NextResponse } from 'next/server';
import { multiplayerService } from '@/lib/multiplayer/multiplayerService';

export async function GET(
  request: NextRequest,
  { params }: { params: { roomCode: string } }
) {
  try {
    const roomCode = params.roomCode;
    const leaderboard = multiplayerService.getLeaderboard(roomCode);
    
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to get leaderboard' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
