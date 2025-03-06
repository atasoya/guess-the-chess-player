import { getRandomPlayer } from '../../actions/getRandomPlayer';
import { NextResponse } from 'next/server';
import { runtime } from '../../config';

export { runtime };

export async function GET() {
  try {
    const player = await getRandomPlayer();
    return NextResponse.json({ player }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get random player' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
} 