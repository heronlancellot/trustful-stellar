// Network configuration
export {
  getStellarNetworkConfig,
  createHorizonServer,
  getNetworkPassphrase,
  type StellarNetworkConfig,
} from './config/networks';

// Wallet utilities
export {
  checkIfStellarWalletIsFunded,
  checkIfWalletIsInitialized, // deprecated
} from './isFundedStellarWallet';

// Transaction utilities
export { sendSignedTransaction } from './signTransaction';

// Validation utilities
export { isValidStellarAddress } from './isValidStellarAddress';
