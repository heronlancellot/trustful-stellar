import { CommunityBadge } from "@/components/community/types";
import { communityBadgeAdapter } from "./adapters/CommunityAdapters";
import httpClient from "./HttpClient";
import { BadgesFromBadgeSetResponse } from "./types";

export class CommunityClient {
  static badgeSetsBadgesPath = "community/badgeSets/badges";
  static defaultCommunity = "stellar";

  async getCommunityBadges(community?: string): Promise<CommunityBadge[]> {
    try {
      const { badges } = await httpClient.get<
        BadgesFromBadgeSetResponse,
        { community: string }
      >(CommunityClient.badgeSetsBadgesPath, {
        community: community ?? CommunityClient.defaultCommunity,
      });
      let communityBadges: CommunityBadge[] = [];
      Object.keys(badges).forEach((badgeSetName) => {
        Object.entries(badges[badgeSetName]).forEach(([assetCode, badge]) =>
          communityBadges.push(
            communityBadgeAdapter.fromApi(
              badge,
              assetCode,
              badgeSetName,
              community ?? CommunityClient.defaultCommunity
            )
          )
        );
      });

      return communityBadges;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

const communityClient = new CommunityClient();
export default communityClient;
