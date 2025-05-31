import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  console.log('🔍 Communities API route called');
  console.log('🔍 API_BASE_URL:', API_BASE_URL);

  if (!API_BASE_URL) {
    console.error('❌ API URL not configured');
    return NextResponse.json(
      { error: 'API URL not configured' },
      { status: 500 }
    );
  }

  try {
    // Use searchParams from NextRequest instead of new URL()
    const userAddress = request.nextUrl.searchParams.get('user_address') || '';
    console.log('🔍 User address from params:', userAddress);

    const apiUrl = `${API_BASE_URL}/communities?user_address=${userAddress}`;
    console.log('🔍 Making request to:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Remove next cache for API routes to prevent static generation issues
      cache: 'no-store',
    });

    console.log('🔍 External API response status:', response.status);
    console.log('🔍 External API response ok:', response.ok);

    if (!response.ok) {
      console.error('❌ External API error:', response.statusText);
      throw new Error(`External API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ External API data received:', data);
    console.log('✅ Data length:', data?.length);

    // Set cache headers for client-side caching
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('❌ Communities API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communities' },
      { status: 500 }
    );
  }
}
