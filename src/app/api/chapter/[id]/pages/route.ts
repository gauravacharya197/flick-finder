import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    console.log("Chapter ID:", id);

    // Step 1: Get chapter data
    const chapterResponse = await fetch(`https://api.mangadex.org/chapter/${id}`, {
      headers: {
        "User-Agent": "FUI/1.0"
      }
    });

    if (!chapterResponse.ok) {
      throw new Error(`MangaDex API responded with status: ${chapterResponse.status}`);
    }

    const chapterData = await chapterResponse.json();

    if (!chapterData.data) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    // Step 2: Get pages (images) data
    const atHomeResponse = await fetch(`https://api.mangadex.org/at-home/server/${id}`, {
      headers: {
        "User-Agent": "YourAppName/1.0"
      }
    });

    if (!atHomeResponse.ok) {
      throw new Error(`MangaDex at-home API responded with status: ${atHomeResponse.status}`);
    }

    const atHomeData = await atHomeResponse.json();

    if (!atHomeData.baseUrl) {
      return NextResponse.json(
        { error: "Images data not found" },
        { status: 404 }
      );
    }

    // Build image URLs
    const chapter = chapterData.data;
    const imageUrls = atHomeData.chapter.data.map((filename: string) => 
      `${atHomeData.baseUrl}/data/${atHomeData.chapter.hash}/${filename}`
    );

    return NextResponse.json({
      chapter: chapter,
      pages: imageUrls
    });
  } catch (error) {
    console.error("MangaDex API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapter pages from MangaDex API" },
      { status: 500 }
    );
  }
}