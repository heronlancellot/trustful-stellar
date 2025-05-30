'use server';

/**
 * Server Actions for Assets - Next.js 15 App Router
 * Alternative to AssetClient pattern using server actions
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL;

export async function postAsset(
  receivingPublicKey: string,
  assetName: string[],
  community: string = 'stellar'
): Promise<{ success: boolean; transaction?: string; error?: string }> {
  if (!API_BASE_URL) {
    return { success: false, error: 'API URL not configured' };
  }

  if (!receivingPublicKey) {
    return { success: false, error: 'Receiving public key is required' };
  }

  if (!assetName || assetName.length === 0) {
    return { success: false, error: 'Asset name is required' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/asset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receivingPublicKey,
        assetName,
        community,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Asset API error: ${response.status} ${response.statusText}`
      );
    }

    const { transaction } = await response.json();
    return { success: true, transaction };
  } catch (error) {
    console.error('Error posting asset:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
