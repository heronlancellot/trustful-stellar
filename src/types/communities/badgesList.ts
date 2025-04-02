export interface BadgesList {
    issuer: string;
    communityAddress: string;
    name: string;
    score: number;
    type: string;

}

export interface CommunityBadges {
    total_badges: number;
    community_badges: BadgesList[];
}