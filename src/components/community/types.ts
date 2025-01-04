import { ReactNode } from "react";

export type CommunityContext = {
  communityQuests: CommunityQuests;
  setCommunityQuests: (communityQuests: CommunityQuests) => void;
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
