'use server';

import { CommunityBadge } from '@/components/community/types';
import {
  CommunityBadgeFromApi,
  communityBadgeAdapter,
} from '@/lib/http-clients/adapters/CommunityAdapters';

/**
 * Server Actions for Community Operations - Next.js 15 App Router
 * Replaces the legacy CommunityClient with modern server actions
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL;

type BadgesFromBadgeSetResponse = {
  badges: {
    [badgeSetName: string]: {
      [assetCode: string]: CommunityBadgeFromApi;
    };
  };
};

export async function getCommunityBadges(
  community: string = 'stellar'
): Promise<CommunityBadge[]> {
  if (!API_BASE_URL) {
    console.warn('API URL not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/community/badgeSets/badges?community=${community}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(
        `Community badges API error: ${response.status} ${response.statusText}`
      );
    }

    const { badges }: BadgesFromBadgeSetResponse = await response.json();

    let communityBadges: CommunityBadge[] = [];

    Object.keys(badges).forEach(badgeSetName => {
      Object.entries(badges[badgeSetName]).forEach(([assetCode, badge]) =>
        communityBadges.push(
          communityBadgeAdapter.fromApi(
            badge,
            assetCode,
            badgeSetName,
            community
          )
        )
      );
    });

    return communityBadges;
  } catch (error) {
    console.error('Failed to fetch community badges:', error);
    return [];
  }
}
