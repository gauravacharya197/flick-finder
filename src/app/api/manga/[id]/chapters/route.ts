import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  // Get search params
  const searchParams = request.nextUrl.searchParams;
  const language = searchParams.get("language") || "en";
  const limit = searchParams.get("limit") || "100";
  
  try {
    const response = await fetch(
      `https://api.mangadex.org/manga/${id}/feed?translatedLanguage[]=${language}&limit=${limit}&order[chapter]=asc`, 
      {
        headers: {
          "User-Agent": "YourAppName/1.0"
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`MangaDex API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("MangaDex API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapters from MangaDex API" },
      { status: 500 }
    );
  }
}