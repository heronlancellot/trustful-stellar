import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: 'API URL not configured' },
      { status: 500 }
    );
  }

  try {
    // Use searchParams from NextRequest instead of new URL()
    const userAddress = request.nextUrl.searchParams.get('user_address') || '';

    const response = await fetch(
      `${API_BASE_URL}/communities?user_address=${userAddress}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        // Remove next cache for API routes to prevent static generation issues
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`External API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Set cache headers for client-side caching
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Communities API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communities' },
      { status: 500 }
    );
  }
}
