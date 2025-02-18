// app/api/seasons/[tvID]/[seasonNumber]/route.ts
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{
    tvID: string;
    seasonNumber: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { tvID, seasonNumber } = (await params);
    
    const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
    const baseUrl = 'https://api.themoviedb.org/3';
    
    const response = await fetch(
      `${baseUrl}/tv/${tvID}/season/${seasonNumber}?language=en-US&api_key=${apiKey}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching season data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch season data' }, 
      { status: 500 }
    );
  }
}