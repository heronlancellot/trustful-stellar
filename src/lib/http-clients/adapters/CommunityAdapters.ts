import { CommunityBadge } from "@/components/community/types";
import { CommunityBadgeFromApi } from "../types";

export const communityBadgeAdapter = (() => {
  const fromApi = (
    communityBadgeFromApi: CommunityBadgeFromApi,
    assetCode: string,
    questName: string,
    communityName: string
  ): CommunityBadge => {
    const { score, issuer, description, title } = communityBadgeFromApi;
    return {
      questName,
      assetCode,
      communityName,
      score,
      issuer,
      description,
      title
    };
  };
  return { fromApi };
})();
