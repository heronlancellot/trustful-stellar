'use client';

import { useAuthContext } from '@/components/auth/Context';
import { useStellarContractBadge } from '@/lib/stellar/transactions/hooks/useStellarContractBadge';
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

export default function useVerifyReputationController() {
  const [badgeDetails, setBadgeDetails] = useState<BadgeDTO | null>(null);
  const { userAddress } = useAuthContext();

  const getBagdeDetails = async (communityAddress: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_INTERNAL}/communities/${communityAddress}/badges?user_address=${userAddress}`
      );
      const data: BadgeDTO = await response.json();

      setBadgeDetails(data);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getBagdeDetails,
    badgeDetails,
    setBadgeDetails,
  };
}
