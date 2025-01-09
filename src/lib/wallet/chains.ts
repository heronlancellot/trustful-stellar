import dotenv from "dotenv";

dotenv.config();

export const isTestnet = Boolean(process.env.NEXT_PUBLIC_USE_TESTNET);