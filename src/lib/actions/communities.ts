'use server';

import { Communities } from '@/types/communities';

/**
 * Server Actions for Communities - Next.js 15 App Router
 * Replaces the complex HttpClient pattern with native server actions
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL;

export async function getCommunities(
  userAddress?: string
): Promise<Communities[]> {
  if (!API_BASE_URL) {
    console.warn('API URL not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/communities?user_address=${userAddress || ''}`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch communities: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching communities:', error);
    return [];
  }
}

export async function getCommunitiesByStatus(
  status: string,
  userAddress?: string
): Promise<Communities[]> {
  if (!API_BASE_URL) {
    console.warn('API URL not configured');
    return [];
  }

  try {
    const userAddressFormatted = userAddress?.toLowerCase();
    const response = await fetch(
      `${API_BASE_URL}/communities/${status}/${userAddressFormatted}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch communities with status ${status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching communities with status ${status}:`, error);
    return [];
  }
}

export async function updateCommunityVisibility(
  communityAddress: string
): Promise<{ success: boolean; error?: string }> {
  if (!API_BASE_URL) {
    return { success: false, error: 'API URL not configured' };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/communities/${communityAddress}/visibility`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_hidden: true,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update community visibility');
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating community visibility:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
