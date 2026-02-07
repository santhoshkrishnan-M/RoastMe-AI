import { NextRequest, NextResponse } from 'next/server';
import { detectMood, getMoodDescription } from '@/lib/mood/moodEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid text input' },
        { status: 400 }
      );
    }
    
    const result = detectMood(text);
    const description = getMoodDescription(result.mood);
    
    return NextResponse.json({
      ...result,
      description
    });
  } catch (error) {
    console.error('Mood detection error:', error);
    return NextResponse.json(
      { error: 'Failed to detect mood' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
