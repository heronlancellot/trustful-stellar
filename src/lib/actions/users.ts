'use server';

import { UserBadge } from '@/components/user/types';
import {
  userBadgeAdapter,
  UserBadgeFromApi,
} from '@/lib/http-clients/adapters/UserAdapters';

/**
 * Server Actions for Users - Next.js 15 App Router
 * Alternative to UserClient pattern using server actions
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL;

function buildUrl(path: string, params: Record<string, string>): string {
  if (!API_BASE_URL) {
    throw new Error('API URL not configured');
  }
  const url = new URL(`${API_BASE_URL}/${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}

export async function getUserBadges(publicKey: string): Promise<UserBadge[]> {
  if (!publicKey) {
    console.warn('getUserBadges: publicKey empty');
    return [];
  }

  try {
    const url = buildUrl('users/badges', { publicKey });
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user badges: ${response.statusText}`);
    }

    const badgesFromApi: UserBadgeFromApi[] = await response.json();
    return badgesFromApi.map(userBadgeAdapter.fromApi);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }
}

export async function getUserBadgesTrustful(
  publicKey: string
): Promise<UserBadge[]> {
  if (!publicKey) {
    console.warn('getUserBadgesTrustful: publicKey empty');
    return [];
  }

  try {
    const url = buildUrl('users/badges/trustful', { publicKey });
    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch trustful badges: ${response.statusText}`
      );
    }

    const badgesFromApi: UserBadgeFromApi[] = await response.json();
    return badgesFromApi.map(userBadgeAdapter.fromApi);
  } catch (error) {
    console.error('Error fetching trustful badges:', error);
    return [];
  }
}

export async function getUserScore(
  publicKey: string,
  community: string = 'stellar'
): Promise<number> {
  if (!publicKey) {
    console.warn('getUserScore: publicKey empty');
    return 0;
  }

  try {
    const url = buildUrl('users/score', { publicKey, community });
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user score: ${response.statusText}`);
    }

    const { totalScore } = await response.json();
    return totalScore || 0;
  } catch (error) {
    console.error('Error fetching user score:', error);
    return 0;
  }
}
