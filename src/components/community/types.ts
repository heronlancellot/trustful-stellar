import { BadgesList, Communities, CommunityBadges, MembersList } from "@/types/communities";
import { ReactNode } from "react";

export type CommunityContext = {
  communityQuests: CommunityQuests;
  setCommunityQuests: (communityQuests: CommunityQuests) => void;
  communities: Communities[];
  setCommunities: React.Dispatch<React.SetStateAction<Communities[]>>;
  verifyReputationcommunities: Communities[];
  setVerifyReputationcommunities: React.Dispatch<React.SetStateAction<Communities[]>>;
  communitiesDetail: Communities | undefined;
  setCommunitiesDetail: Communities | undefined | any;
  communitiesBadgesList: CommunityBadges;
  setCommunitiesBadgesList: React.Dispatch<React.SetStateAction<CommunityBadges>>;
  communitiesMembersList: MembersList[];
  setCommunitiesMembersList: React.Dispatch<React.SetStateAction<MembersList[]>>;
  isJoined: boolean;
  getCommunities: () => Promise<void>;
  getCommunitiesStatus: (status: string) => Promise<void>;
  refetchCommunitiesAll: () => Promise<void>;
  getCommunitiesDetails: (communityAddress: string, userAddress?: string) => Promise<void>;
  getVerifyReputationList: (userAddress: string) => Promise<void>;
  getCommunitiesBadgesList: (communityAddress: string) => Promise<void>;
  getCommunitiesMembersList: (communityAddress: string) => Promise<void>;
  updateHideCommunities: (communityAddress: string) => Promise<void>;
  updateShowCommunities: (communityAddress: string) => Promise<void>;
};

export type CommunityContextProviderProps = {
  children: ReactNode;
};

export type CommunityBadge = {
  communityName: string;
  questName: string;
  assetCode: string;
  score: number;
  issuer: string[];
  description: string;
  title: string;
};

export type CommunityQuests = {
  [questName: string]: CommunityBadge[];
};
