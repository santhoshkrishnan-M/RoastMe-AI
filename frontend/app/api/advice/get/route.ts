import { NextRequest, NextResponse } from 'next/server';
import { generateAdvice } from '@/lib/advice/adviceGenerator';
import { AdviceRequest } from '@/shared/types';

export async function POST(request: NextRequest) {
  try {
    const body: AdviceRequest = await request.json();
    
    if (!body.category || !['career', 'discipline', 'focus', 'social'].includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }
    
    if (!body.mood) {
      return NextResponse.json(
        { error: 'Mood is required' },
        { status: 400 }
      );
    }
    
    const advice = generateAdvice(body);
    
    return NextResponse.json(advice);
  } catch (error) {
    console.error('Advice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate advice' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
