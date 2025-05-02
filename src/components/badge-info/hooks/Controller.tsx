'use client';

import { useState } from 'react';

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
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL_INTERNAL}/badges/${type}`
        ).then(async (response: CustomResponse) => {
          if (response?.statusCode === 404) {
            console.error(
              `${response?.statusCode} Error fetching badge ${type}`
            );
            return null;
          }
          return response.json();
        })
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
