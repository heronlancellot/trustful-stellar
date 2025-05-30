import * as StellarSdk from '@stellar/stellar-sdk';
import { createHorizonServer } from './config/networks';

/**
 * Checks if a Stellar wallet address is funded (has been initialized on the network)
 * @param address - The Stellar wallet address to check
 * @returns {Promise<boolean>} True if the wallet is funded/initialized, false otherwise
 * @throws {Error} If the address is invalid or network request fails
 */
export const checkIfStellarWalletIsFunded = async (
  address: string
): Promise<boolean> => {
  if (!address || typeof address !== 'string') {
    throw new Error('Invalid Stellar address provided');
  }

  try {
    const horizonServer = createHorizonServer();
    await horizonServer.loadAccount(address);
    return true;
  } catch (error) {
    // If the error is a 404 (account not found), the wallet is not funded
    if (error instanceof StellarSdk.NotFoundError) {
      return false;
    }

    // For other errors (network issues, invalid address, etc.), re-throw
    throw new Error(
      `Failed to check wallet funding status: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * @deprecated Use checkIfStellarWalletIsFunded instead
 * Legacy function name for backward compatibility
 */
export const checkIfWalletIsInitialized = checkIfStellarWalletIsFunded;
