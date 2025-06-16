import * as StellarSdk from '@stellar/stellar-sdk';
import { STELLAR } from '@/lib/environmentVars';

export const checkIfWalletIsInitialized = async (address: string) => {
  try {
    const horizonServer = new StellarSdk.Horizon.Server(STELLAR.NETWORK);
    await horizonServer.loadAccount(address);
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};
