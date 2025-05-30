import * as StellarSdk from '@stellar/stellar-sdk';
import { isTestnet } from '@/lib/wallet/chains';

/**
 * Stellar network configuration
 */
export interface StellarNetworkConfig {
  horizonUrl: string;
  networkPassphrase: string;
  isTestnet: boolean;
}

/**
 * Default Stellar network URLs
 */
const DEFAULT_NETWORKS = {
  TESTNET: 'https://horizon-testnet.stellar.org',
  MAINNET: 'https://horizon.stellar.org',
} as const;

/**
 * Gets the current Stellar network configuration
 * @returns {StellarNetworkConfig} Network configuration object
 * @throws {Error} If network URLs are not properly configured
 */
export const getStellarNetworkConfig = (): StellarNetworkConfig => {
  const testnetUrl = process.env.NEXT_PUBLIC_TESTNET_NETWORK;
  const mainnetUrl = process.env.NEXT_PUBLIC_NETWORK;

  if (isTestnet) {
    const horizonUrl = testnetUrl || DEFAULT_NETWORKS.TESTNET;
    return {
      horizonUrl,
      networkPassphrase: StellarSdk.Networks.TESTNET,
      isTestnet: true,
    };
  } else {
    const horizonUrl = mainnetUrl || DEFAULT_NETWORKS.MAINNET;
    return {
      horizonUrl,
      networkPassphrase: StellarSdk.Networks.PUBLIC,
      isTestnet: false,
    };
  }
};

/**
 * Creates a configured Horizon server instance
 * @returns {StellarSdk.Horizon.Server} Configured Horizon server
 */
export const createHorizonServer = (): StellarSdk.Horizon.Server => {
  const config = getStellarNetworkConfig();
  return new StellarSdk.Horizon.Server(config.horizonUrl);
};

/**
 * Gets the current network passphrase
 * @returns {string} Network passphrase for the current environment
 */
export const getNetworkPassphrase = (): string => {
  return getStellarNetworkConfig().networkPassphrase;
};
