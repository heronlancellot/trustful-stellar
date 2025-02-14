export interface Communities {
    communityAddress: string;
    factoryAddress?: string;
    name: string;
    description: string;
    creatorAddress?: string;
    isHidden?: boolean;
    blocktimestamp?: string;
    totalBadges?: number;
    totalMembers?: number;
    managers?: string[];
}