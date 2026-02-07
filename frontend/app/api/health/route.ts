import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    message: 'ROASTME API is running'
  });
}

export const dynamic = 'force-dynamic';
