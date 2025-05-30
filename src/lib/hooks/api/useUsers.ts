import { UserBadge } from '@/components/user/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserBadges,
  getUserBadgesTrustful,
  getUserScore,
} from '@/lib/actions/users';

/**
 * Modern React Query hooks for User operations
 * Uses Server Actions for optimal performance and caching
 */

const USERS_QUERY_KEY = 'users';

export function useUserBadges(publicKey?: string) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, 'badges', publicKey],
    queryFn: () => getUserBadges(publicKey!),
    enabled: !!publicKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUserBadgesTrustful(publicKey?: string) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, 'badges', 'trustful', publicKey],
    queryFn: () => getUserBadgesTrustful(publicKey!),
    enabled: !!publicKey,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useUserScore(
  publicKey?: string,
  community: string = 'stellar'
) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, 'score', publicKey, community],
    queryFn: () => getUserScore(publicKey!, community),
    enabled: !!publicKey,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// For complex user operations that need direct API calls
export function useUserMutations() {
  const queryClient = useQueryClient();

  const postAssetMutation = useMutation({
    mutationFn: async ({
      receivingPublicKey,
      assetName,
      community = 'stellar',
    }: {
      receivingPublicKey: string;
      assetName: string[];
      community?: string;
    }) => {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_URL_INTERNAL;
      if (!API_BASE_URL) {
        throw new Error('API URL not configured');
      }

      const response = await fetch(`${API_BASE_URL}/asset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      return response.json();
    },
    onSuccess: () => {
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });

  return {
    postAsset: postAssetMutation,
  };
}
