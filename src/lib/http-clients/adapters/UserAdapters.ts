import { UserBadge } from "@/components/user/types";
import { UserBadgeFromApi } from "../types";

export const userBadgeAdapter = (() => {
  const fromApi = (userBadgeFromApi: UserBadgeFromApi): UserBadge => {
    return {
      balance: userBadgeFromApi.balance,
      limit: userBadgeFromApi.limit,
      buyingLiabilities: userBadgeFromApi.buying_liabilities,
      sellingLiabilities: userBadgeFromApi.selling_liabilities,
      sponsor: userBadgeFromApi.sponsor,
      lastModifiedLedger: userBadgeFromApi.last_modified_ledger,
      isAuthorized: userBadgeFromApi.is_authorized,
      isAuthorizedToMaintainLiabilities:
        userBadgeFromApi.is_authorized_to_maintain_liabilities,
      isClawbackEnabled: userBadgeFromApi.is_clawback_enabled,
      assetType: userBadgeFromApi.asset_type,
      assetCode: userBadgeFromApi.asset_code,
      assetIssuer: userBadgeFromApi.asset_issuer,
    };
  };

  return { fromApi };
})();
