import { NextRequest, NextResponse } from 'next/server';
import { analyzePersonality } from '@/lib/personality/personalityAnalyzer';
import { MoodType } from '@/lib/mood/moodEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, moodHistory } = body;
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages array' },
        { status: 400 }
      );
    }
    
    const moods: MoodType[] = Array.isArray(moodHistory) ? moodHistory : [];
    
    const profile = analyzePersonality(messages, moods);
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Personality analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze personality' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
