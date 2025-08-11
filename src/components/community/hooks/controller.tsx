"use client";

import { useState } from "react";
import { STELLAR } from "@/lib/environmentVars";
import { useStellarContract } from "@/lib/stellar/transactions/hooks/useStellarContract";
import { useStellarContractAddBadge } from "@/lib/stellar/transactions/hooks/useStellarContractAddBadge";
import { useStellarContractManager } from "@/lib/stellar/transactions/hooks/useStellarContractManager";
import { useStellarContractRemoveBadge } from "@/lib/stellar/transactions/hooks/useStellarContractRemoveBadge";
import { useAuthContext } from "@/components/auth/Context";

interface UseCommunitiesControllerParams {
  communityAddress?: string;
}

export default function useCommunitiesController({
  communityAddress,
}: UseCommunitiesControllerParams = {}) {
  const [inputText, setInputText] = useState<string>("");
  const { userAddress } = useAuthContext();

  const communityAddressFormatted =
    typeof communityAddress === "string" ? communityAddress.toUpperCase() : "";

  const stellarContractJoinCommunities = useStellarContract({
    contractId: communityAddressFormatted,
    rpcUrl: STELLAR.RPC_URL,
    userAddress: userAddress,
  });

  const stellarContractManagers = useStellarContractManager({
    contractId: communityAddressFormatted,
    rpcUrl: STELLAR.RPC_URL,
    networkType: STELLAR.NETWORK_TYPE,
  });

  const stellarContractAddBadges = useStellarContractAddBadge({
    contractId: communityAddressFormatted,
    rpcUrl: STELLAR.RPC_URL,
    networkType: STELLAR.NETWORK_TYPE,
  });

  const stellarContractRemoveBadges = useStellarContractRemoveBadge({
    contractId: communityAddressFormatted,
    rpcUrl: STELLAR.RPC_URL,
    networkType: STELLAR.NETWORK_TYPE,
  });

  return {
    inputText,
    setInputText,
    stellarContractJoinCommunities,
    stellarContractManagers,
    stellarContractAddBadges,
    stellarContractRemoveBadges,
  };
}
