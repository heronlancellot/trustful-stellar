import * as StellarSdk from '@stellar/stellar-sdk';
import { isTestnet } from '@/lib/wallet/chains';

export const checkIfWalletIsInitialized = async (address: string) => {
  const testnet = process.env.NEXT_PUBLIC_TESTNET_NETWORK ?? '';
  const publicNetwork = process.env.NEXT_PUBLIC_NETWORK ?? '';

  console.log('testnet', testnet);
  console.log('publicNetwork', publicNetwork);

  try {
    const horizonServer = new StellarSdk.Horizon.Server(
      isTestnet ? testnet : publicNetwork
    );
    await horizonServer.loadAccount(address);
    console.log('Wallet is funded');
  } catch (error) {
    throw error;
  }
};
