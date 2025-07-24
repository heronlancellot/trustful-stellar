"use client";

import { STELLAR } from "@/lib/environmentVars";
import { useStellarContract } from "@/lib/stellar/transactions/hooks/useStellarContract";
import { useStellarContractBadge } from "@/lib/stellar/transactions/hooks/useStellarContractBadge";
import { useStellarContractManager } from "@/lib/stellar/transactions/hooks/useStellarContractManager";
import { useStellarContractRemoveBadge } from "@/lib/stellar/transactions/hooks/useStellarContractRemoveBadge";
import { useState } from "react";

interface UseCommunitiesControllerParams {
  communityAddress?: string;
}

export default function useCommunitiesController({
  communityAddress,
}: UseCommunitiesControllerParams = {}) {
  const [inputText, setInputText] = useState("");

  const communityAddressFormatted =
    typeof communityAddress === "string" ? communityAddress.toUpperCase() : "";

  const stellarContractJoinCommunities = useStellarContract({
    contractId: communityAddressFormatted,
    rpcUrl: STELLAR.RPC_URL,
  });

  const stellarContractManagers = useStellarContractManager({
    contractId: communityAddressFormatted,
    rpcUrl: STELLAR.RPC_URL,
    networkType: STELLAR.NETWORK_TYPE,
  });

  const stellarContractBadges = useStellarContractBadge({
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
    stellarContractBadges,
    stellarContractRemoveBadges,
  };
}
