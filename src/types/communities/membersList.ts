interface User {
    userAddress: string;
}

export interface MembersList {
    id: number;
    userAddress: string;
    isManager: boolean;
    isCreator: boolean;
    communityAddress: string;
    lastIndexedAt: string;
    user: User;
}