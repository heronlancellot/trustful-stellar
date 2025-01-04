import dotenv from "dotenv";

dotenv.config();

export const isTestnet = !!parseInt(process.env.NEXT_PUBLIC_USE_TESTNET ?? "0");
