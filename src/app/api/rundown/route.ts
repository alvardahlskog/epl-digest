import { NextResponse } from 'next/server';
import { getPremierLeagueRundown } from '@/lib/rundownService';

export async function GET() {
  try {
    const data = await getPremierLeagueRundown();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error in /api/rundown:', error);
    return NextResponse.json({ error: 'Failed to retrieve rundown data' }, { status: 500 });
  }
}
