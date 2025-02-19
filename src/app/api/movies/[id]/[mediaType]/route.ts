// app/api/movies/[id]/[mediaType]/route.ts
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{
    id: string;
    mediaType: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id, mediaType } = (await params);
    console.log('id:', id);
    console.log('mediaType:', mediaType);
    const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
    const baseUrl = 'https://api.themoviedb.org/3';
    
    const response = await fetch(
      `${baseUrl}/${mediaType}/${id}/recommendations?language=en-US&page=1&api_key=${apiKey}`,
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