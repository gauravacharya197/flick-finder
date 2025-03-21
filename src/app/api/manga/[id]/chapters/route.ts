import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Get search params
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const language = searchParams.get("language") || "en";
    const limit = searchParams.get("limit") || "100";

    const response = await fetch(
      `https://api.mangadex.org/manga/${id}/feed?translatedLanguage[]=${language}&limit=${limit}&order[chapter]=asc`,
      {
        headers: {
          "User-Agent": "FUI/1.0",
        },
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
