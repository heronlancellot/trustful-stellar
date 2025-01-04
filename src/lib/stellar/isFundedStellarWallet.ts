import * as StellarSdk from "@stellar/stellar-sdk";

export const checkIfWalletIsInitialized = async (address: string) => {
  try {
    const horizonServer = new StellarSdk.Horizon.Server(
      "https://horizon.stellar.org"
    );
    await horizonServer.loadAccount(address);
  } catch (error) {
    throw error;
  }
};
