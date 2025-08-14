import { useQuery } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/environmentVars";

const COMMUNITY_DETAILS_QUERY_KEY = "community-details";
const COMMUNITY_BADGES_QUERY_KEY = "community-badges";
const COMMUNITY_MEMBERS_QUERY_KEY = "community-members";

export const useCommunityDetails = (
  communityAddress: string,
  userAddress?: string,
) => {
  return useQuery({
    queryKey: [COMMUNITY_DETAILS_QUERY_KEY, communityAddress, userAddress],
    queryFn: () =>
      fetch(
        getApiUrl(
          `/communities/${communityAddress}?user_address=${userAddress || ""}`,
        ),
      ).then((res) => res.json()),
    enabled: !!communityAddress,
  });
};

export const useCommunityBadges = (
  communityAddress: string,
  userAddress?: string,
) => {
  return useQuery({
    queryKey: [COMMUNITY_BADGES_QUERY_KEY, communityAddress, userAddress],
    queryFn: () =>
      fetch(
        getApiUrl(
          `/communities/${communityAddress}/badges?user_address=${userAddress || ""}`,
        ),
      ).then((res) => res.json()),
    enabled: !!communityAddress,
  });
};

export const useCommunityMembers = (communityAddress: string) => {
  return useQuery({
    queryKey: [COMMUNITY_MEMBERS_QUERY_KEY, communityAddress],
    queryFn: () =>
      fetch(getApiUrl(`/communities/${communityAddress}/members`)).then((res) =>
        res.json(),
      ),
    enabled: !!communityAddress,
  });
};
