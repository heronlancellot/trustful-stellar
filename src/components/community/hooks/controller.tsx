'use client'

import { useStellarContract } from "@/lib/stellar/transactions/hooks/useStellarContract";
import { useStellarContractManager } from "@/lib/stellar/transactions/hooks/useStellarContractManager";
import { useEffect, useState } from "react";

export default function useCommunitiesController() {
    const [inputText, setInputText] = useState("");

    const stellarContractJoinCommunities = useStellarContract({
        contractId: 'CDKBF73BW44S7RTY744H6TIDOKDAAPNHWLC2CFMHGUXIRZSZQ4V2OAGY',
        rpcUrl: 'https://soroban-testnet.stellar.org',
        networkType: 'TESTNET',
    });

    const stellarContractManagers = useStellarContractManager({
        contractId: 'CDKBF73BW44S7RTY744H6TIDOKDAAPNHWLC2CFMHGUXIRZSZQ4V2OAGY',
        rpcUrl: 'https://soroban-testnet.stellar.org',
        networkType: 'TESTNET',
    });

    return {
        inputText,
        setInputText,
        stellarContractJoinCommunities,
        stellarContractManagers
    }
}