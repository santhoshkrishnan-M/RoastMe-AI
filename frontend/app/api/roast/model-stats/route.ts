import { NextRequest, NextResponse } from 'next/server';
import { getModelStats } from '@/lib/roast/roastGenerator';

export async function GET() {
  try {
    const stats = getModelStats();
    return NextResponse.json({
      success: true,
      stats,
      message: stats.totalPatterns > 0 
        ? `Model trained with ${stats.totalPatterns} patterns`
        : 'Model not loaded, using fallback templates'
    });
  } catch (error) {
    console.error('Model stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get model stats' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
