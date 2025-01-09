import * as StellarSdk from "@stellar/stellar-sdk";
import { isTestnet } from "@/lib/wallet/chains";


export const checkIfWalletIsInitialized = async (address: string) => {
  const testnet = process.env.NEXT_PUBLIC_TESTNET_NETWORK ?? ""
  const publicNetwork = process.env.NEXT_PUBLIC_NETWORK ?? ""

  try {
    const horizonServer = new StellarSdk.Horizon.Server(
      isTestnet ? testnet : publicNetwork
    );
    await horizonServer.loadAccount(address);
  } catch (error) {
    throw error;
  }
};
