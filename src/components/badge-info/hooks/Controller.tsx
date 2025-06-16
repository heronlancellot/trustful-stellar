'use client';

import { useState } from 'react';
import { getApiUrl } from '@/lib/environmentVars';

export type Badge = {
  issuer: string;
  community_address: string;
  name: string;
  score: number;
  type: string;
  created_at: string;
  user_has: boolean;
};

export type BadgeDTO = {
  badges_count: number;
  users_points: number;
  total_badges: number;
  community_badges: Badge[];
};

export type BadgeTypeDetails = {
  type: string;
};

type CustomResponse = Response & {
  statusCode?: number;
};

export default function useBadgeInfoController() {
  const [badgeTypeDetails, setBadgeTypeDetails] = useState<BadgeTypeDetails[]>(
    []
  );

  const getBadgesByTypes = async (selectedTypes: string[]) => {
    try {
      const promises = selectedTypes.map(type =>
        fetch(getApiUrl(`/badges/${type}`)).then(
          async (response: CustomResponse) => {
            return response.json();
          }
        )
      );

      const results = await Promise.all(promises);
      const flattenedResults = results.filter(result => result !== null).flat();

      setBadgeTypeDetails(flattenedResults);
      return flattenedResults;
    } catch (error) {
      console.error('Error fetching badge types:', error);
      return [];
    }
  };

  return {
    getBadgesByTypes,
    badgeTypeDetails,
  };
}
