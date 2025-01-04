import { ReactNode } from "react";
import { CommunityBadge } from "../community/types";

export type UserContext = {
  userScore?: number;
  userBadgesImported: UserBadge[]; // User Badges that are already imported to trustful;
  userBadgesToImport: UserBadge[];
  setUserScore: (userScore: number) => void;
  setUserBadgesImported: (userBadgesImported: UserBadge[]) => void;
  setUserBadgesToImport: (
    userBadges: UserBadge[],
    userBadgesImported: UserBadge[],
    communityBadges: CommunityBadge[]
  ) => void;
};

export type UserContextProviderProps = {
  children: ReactNode;
};

export type UserBadge = {
  balance: string;
  limit?: string;
  buyingLiabilities: string;
  sellingLiabilities: string;
  sponsor?: string;
  lastModifiedLedger?: number;
  isAuthorized?: boolean;
  isAuthorizedToMaintainLiabilities?: boolean;
  isClawbackEnabled?: boolean;
  assetType: string;
  assetCode?: string;
  assetIssuer?: string[];
};
