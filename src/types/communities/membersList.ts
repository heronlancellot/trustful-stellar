interface User {
  userAddress: string;
}

export interface MembersList {
  id: number;
  user_address: string;
  isManager: boolean;
  isCreator: boolean;
  communityAddress: string;
  lastIndexedAt: string;
  user: User;
  badges: number;

  points: number;
  badges_count: number;
  rank: number;
}
