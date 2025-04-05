'use client';

import { useStellarContract } from '@/lib/stellar/transactions/hooks/useStellarContract';
import { useStellarContractBadge } from '@/lib/stellar/transactions/hooks/useStellarContractBadge';
import { useStellarContractManager } from '@/lib/stellar/transactions/hooks/useStellarContractManager';
import { useEffect, useState } from 'react';

export default function useCommunitiesController() {
  const [inputText, setInputText] = useState('');

  const stellarContractJoinCommunities = useStellarContract({
    contractId: `${process.env.COMMUNITIES_CONTRACT ?? 'CBGXFUQCDT2U4AUHNQFPJJEMGARLCW3WJVHFJR4OLONXHBHOWX7JBT5F'}`,
    rpcUrl: 'https://soroban-testnet.stellar.org',
    networkType: 'TESTNET',
  });

  const stellarContractManagers = useStellarContractManager({
    contractId: `${process.env.MANAGERS_CONTRACT ?? 'CDKBF73BW44S7RTY744H6TIDOKDAAPNHWLC2CFMHGUXIRZSZQ4V2OAGY'}`,
    rpcUrl: 'https://soroban-testnet.stellar.org',
    networkType: 'TESTNET',
  });

  const stellarContractBadges = useStellarContractBadge({
    contractId: `${process.env.BADGES_CONTRACT ?? 'CBQIUGALZVL5VZZHQO2IJJIJNWQQ2S2SMKMKIE2WCR6PENAPAQGXSKVK'}`,
    rpcUrl: 'https://soroban-testnet.stellar.org',
    networkType: 'TESTNET',
  });

  return {
    inputText,
    setInputText,
    stellarContractJoinCommunities,
    stellarContractManagers,
    stellarContractBadges,
  };
}
