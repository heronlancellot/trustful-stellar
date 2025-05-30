import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { status: string } }
) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: 'API URL not configured' },
      { status: 500 }
    );
  }

  try {
    const status = params.status;
    const userAddress = request.nextUrl.searchParams.get('user_address') || '';
    const userAddressFormatted = userAddress.toLowerCase();

    const response = await fetch(
      `${API_BASE_URL}/communities/${status}/${userAddressFormatted}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`External API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error(`Communities ${params.status} API error:`, error);
    return NextResponse.json(
      { error: `Failed to fetch communities with status ${params.status}` },
      { status: 500 }
    );
  }
}
