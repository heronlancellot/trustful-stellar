import { Communities } from '@/types/communities';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const COMMUNITIES_QUERY_KEY = 'communities';

// Simple fetch utility - no complex HttpClient needed
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Use Next.js API routes for better caching and error handling
async function fetchCommunities(userAddress?: string): Promise<Communities[]> {
  try {
    const data = await fetchAPI<Communities[]>(
      `/api/communities?user_address=${userAddress || ''}`
    );
    return data;
  } catch (error) {
    console.error('Error fetching communities:', error);
    return [];
  }
}

async function fetchCommunitiesByStatus(
  status: string,
  userAddress?: string
): Promise<Communities[]> {
  try {
    const data = await fetchAPI<Communities[]>(
      `/api/communities/${status}?user_address=${userAddress || ''}`
    );
    return data;
  } catch (error) {
    console.error(`Error fetching communities with status ${status}:`, error);
    return [];
  }
}

async function fetchVerifyReputationList(
  userAddress: string
): Promise<Communities[]> {
  const userAddressFormatted = userAddress?.toLowerCase();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_INTERNAL}/communities/joined/${userAddressFormatted}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch verify reputation list');
  }

  return response.json();
}

// React Query hooks remain the same - just simpler fetch functions
export function useCommunities(userAddress?: string) {
  return useQuery({
    queryKey: [COMMUNITIES_QUERY_KEY, userAddress],
    queryFn: () => fetchCommunities(userAddress),
    enabled: !!userAddress || userAddress === '',
  });
}

export function useCommunitiesByStatus(status: string, userAddress?: string) {
  return useQuery({
    queryKey: [COMMUNITIES_QUERY_KEY, status, userAddress],
    queryFn: () => fetchCommunitiesByStatus(status, userAddress),
    enabled: !!status && (!!userAddress || userAddress === ''),
  });
}

export function useVerifyReputationList(userAddress: string) {
  return useQuery({
    queryKey: [COMMUNITIES_QUERY_KEY, 'verify-reputation', userAddress],
    queryFn: () => fetchVerifyReputationList(userAddress),
    enabled: !!userAddress,
  });
}

export function useUpdateCommunityVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (communityAddress: string) => {
      // Direct fetch to external API for mutations
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL_INTERNAL ||
        process.env.NEXT_PUBLIC_API_URL;

      if (!API_BASE_URL) {
        throw new Error('API URL not configured');
      }

      const response = await fetch(
        `${API_BASE_URL}/communities/${communityAddress}/visibility`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_hidden: true }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update community visibility');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMUNITIES_QUERY_KEY] });
    },
  });
}
