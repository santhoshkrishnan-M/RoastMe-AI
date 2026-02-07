import { NextRequest, NextResponse } from 'next/server';
import { generateRoast, getModelStats } from '@/lib/roast/roastGenerator';
import { detectMood } from '@/lib/mood/moodEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { intensity, text, username } = body;
    
    if (!intensity || !['funny', 'brutal', 'sarcastic'].includes(intensity)) {
      return NextResponse.json(
        { error: 'Invalid intensity' },
        { status: 400 }
      );
    }
    
    let mood = undefined;
    if (text) {
      const moodResult = detectMood(text);
      mood = moodResult.mood;
    }
    
    const roast = generateRoast(intensity, mood, text, username);
    
    return NextResponse.json(roast);
  } catch (error) {
    console.error('Roast generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate roast' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
