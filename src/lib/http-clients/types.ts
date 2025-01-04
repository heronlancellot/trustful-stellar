export interface IGenericHttpClient {
  get: <T, P extends Object>(path: string, query: P) => Promise<T>;
  post: <T, P extends Object, B extends Object>(
    path: string,
    query: P,
    body: B
  ) => Promise<T>;
}

export type UserBadgeFromApi = {
  balance: string;
  limit?: string;
  buying_liabilities: string;
  selling_liabilities: string;
  sponsor?: string;
  last_modified_ledger?: number;
  is_authorized?: boolean;
  is_authorized_to_maintain_liabilities?: boolean;
  is_clawback_enabled?: boolean;
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string[];
};

export type CommunityBadgeFromApi = {
  score: number;
  issuer: string[];
  description: string;
  title: string;
};

export type BadgesFromBadgeSetResponse = {
  badges: {
    [badgeSetName: string]: {
      [assetCode: string]: CommunityBadgeFromApi;
    };
  };
};
