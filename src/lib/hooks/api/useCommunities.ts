import { Communities } from '@/types/communities';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const COMMUNITIES_QUERY_KEY = 'communities';

interface FetchCommunitiesParams {
    userAddress?: string;
}

async function fetchCommunities({ userAddress }: FetchCommunitiesParams): Promise<Communities[]> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_INTERNAL}/communities?user_address=${userAddress || ''}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch communities');
    }

    return response.json();
}

async function fetchCommunitiesByStatus(status: string, userAddress?: string): Promise<Communities[]> {
    const userAddressFormatted = userAddress?.toLowerCase();
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_INTERNAL}/communities/${status}/${userAddressFormatted}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch communities with status ${status}`);
    }

    return response.json();
}

async function fetchVerifyReputationList(userAddress: string): Promise<Communities[]> {
    const userAddressFormatted = userAddress?.toLowerCase();
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_INTERNAL}/communities/joined/${userAddressFormatted}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch verify reputation list');
    }

    return response.json();
}

async function updateCommunityVisibility(communityAddress: string): Promise<any> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_INTERNAL}/communities/${communityAddress}/visibility`,
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

    return response.json();
}

export function useCommunities(userAddress?: string) {
    return useQuery({
        queryKey: [COMMUNITIES_QUERY_KEY, userAddress],
        queryFn: () => fetchCommunities({ userAddress }),
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
        mutationFn: (communityAddress: string) => updateCommunityVisibility(communityAddress),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COMMUNITIES_QUERY_KEY] });
        },
    });
} 