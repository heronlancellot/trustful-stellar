import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";
import { Networks } from "@stellar/stellar-sdk";
import { z } from "zod";

/**
 * Environment configuration for Trustful Stellar
 * This file centralizes all environment variables with strict Zod validation.
 * If any required variable is missing or invalid, the application will fail to start.
 * This prevents exposing incorrect APIs or misconfigured endpoints.
 */

// Strict Zod schema - no fallbacks, all required variables must be present
const environmentSchema = z.object({
  NEXT_PUBLIC_ENV: z.enum(["production", "testnet"], {
    errorMap: () => ({
      message: 'NEXT_PUBLIC_ENV must be either "production" or "testnet"',
    }),
  }),
  NEXT_PUBLIC_API_URL: z.string().url({
    message: "NEXT_PUBLIC_API_URL must be a valid URL",
  }),
  NEXT_PUBLIC_NETWORK: z.string().url({
    message: "NEXT_PUBLIC_NETWORK must be a valid Stellar Horizon URL",
  }),
  NEXT_PUBLIC_RPC_URL: z.string().url({
    message: "NEXT_PUBLIC_RPC_URL must be a valid Soroban RPC URL",
  }),
  NEXT_PUBLIC_FACTORY_CONTRACT_ID: z.string().min(1, {
    message: "NEXT_PUBLIC_FACTORY_CONTRACT_ID is required and cannot be empty",
  }),
});

// Parse and validate environment variables - fail fast if invalid
const parseResult = environmentSchema.safeParse({
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
  NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
  NEXT_PUBLIC_FACTORY_CONTRACT_ID: process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ID,
});

if (!parseResult.success) {
  console.error("❌ Environment variables validation failed:");
  console.error(parseResult.error.flatten().fieldErrors);
  console.error("\n📋 Required environment variables:");
  console.error('- NEXT_PUBLIC_ENV: "production" or "testnet"');
  console.error("- NEXT_PUBLIC_API_URL: Backend API URL");
  console.error("- NEXT_PUBLIC_NETWORK: Stellar Horizon URL");
  console.error("- NEXT_PUBLIC_RPC_URL: Soroban RPC URL");
  console.error("- NEXT_PUBLIC_FACTORY_CONTRACT_ID: Smart contract ID");

  throw new Error(
    "❌ Application cannot start with invalid environment configuration",
  );
}

// All environment variables are now guaranteed to be valid
const validatedEnv = parseResult.data;

// Environment flags derived from validated env
const isDev = validatedEnv.NEXT_PUBLIC_ENV === "testnet";
const isProduction = validatedEnv.NEXT_PUBLIC_ENV === "production";

export const envVars = {
  isDev,
  isProduction,
  isTestnet: isDev,

  NEXT_PUBLIC_ENV: validatedEnv.NEXT_PUBLIC_ENV,
  NEXT_PUBLIC_API_URL: validatedEnv.NEXT_PUBLIC_API_URL,

  STELLAR: {
    NETWORK: validatedEnv.NEXT_PUBLIC_NETWORK,
    RPC_URL: validatedEnv.NEXT_PUBLIC_RPC_URL,
    NETWORK_TYPE: (isDev ? "TESTNET" : "PUBLIC") as "TESTNET" | "PUBLIC",
    FACTORY_CONTRACT_ID: validatedEnv.NEXT_PUBLIC_FACTORY_CONTRACT_ID,
    NETWORK_PASSPHRASE: (isDev
      ? Networks.TESTNET
      : Networks.PUBLIC) as Networks,
    WALLET_NETWORK: (isDev
      ? WalletNetwork.TESTNET
      : WalletNetwork.PUBLIC) as WalletNetwork,
  },

  ALBEDO: {
    NETWORK_TYPE: (isDev ? "testnet" : "public") as "testnet" | "public",
  },
};

export const {
  isDev: isTestnetEnv,
  isProduction: isProductionEnv,
  STELLAR,
  ALBEDO,
} = envVars;

export const getCurrentNetworkConfig = () => ({
  rpcUrl: STELLAR.RPC_URL,
  networkType: STELLAR.NETWORK_TYPE,
  horizonUrl: STELLAR.NETWORK,
  isTestnet: envVars.isDev,
});

export const getApiUrl = (endpoint?: string) => {
  const baseUrl = envVars.NEXT_PUBLIC_API_URL;
  return endpoint ? `${baseUrl}${endpoint}` : baseUrl;
};

export const getStellarConfig = () => ({
  network: STELLAR.NETWORK,
  rpcUrl: STELLAR.RPC_URL,
  networkType: STELLAR.NETWORK_TYPE,
  horizonUrl: STELLAR.NETWORK,
  factoryContractId: STELLAR.FACTORY_CONTRACT_ID,
});

// Export the validated environment for external use
export const validatedEnvironment = validatedEnv;
