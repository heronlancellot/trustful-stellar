import {
  rpc,
  TransactionBuilder,
  BASE_FEE,
  Networks,
  Operation,
  Address,
  xdr,
} from "@stellar/stellar-sdk";
import albedo from "@albedo-link/intent";
import { useAuthContext } from "@/components/auth/Context";

interface UseStellarContractBadgeProps {
  contractId: string;
  rpcUrl: string;
  networkType: "TESTNET" | "PUBLIC";
}

export const useStellarContractBadge = ({
  contractId,
  rpcUrl,
  networkType = "TESTNET",
}: UseStellarContractBadgeProps) => {
  const { userAddress } = useAuthContext();

  const executeContractFunction = async (
    functionName: string,
    badgeName: string,
    issuer: string,
    score: number,
  ) => {
    const nameScVal = xdr.ScVal.scvString(badgeName);
    const scoreScval = xdr.ScVal.scvU32(score);

    try {
      // 1. Obter chave pública via Albedo
      const { pubkey } = await albedo.publicKey({ require_existing: true });

      // Load user account via RPC
      const server = new rpc.Server(rpcUrl, { allowHttp: true });
      const account = await server.getAccount(pubkey);

      // Create and prepare transaction
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase:
          networkType === "TESTNET" ? Networks.TESTNET : Networks.PUBLIC,
      })
        .addOperation(
          Operation.invokeContractFunction({
            function: functionName,
            contract: contractId,
            args: [
              new Address(pubkey).toScVal(),
              nameScVal,
              new Address(issuer).toScVal(),
              scoreScval,
            ],
          }),
        )
        .setTimeout(30)
        .build();

      const preparedTransaction = await server.prepareTransaction(transaction);
      const transactionXDR = preparedTransaction.toXDR();

      // Sign with Albedo and submit
      const signResult = await albedo.tx({
        xdr: transactionXDR,
        network: networkType.toLowerCase(),
        submit: true,
      });

      return { success: true, txHash: signResult.tx_hash };
    } catch (error: any) {
      console.error("Contract execution error:", error);
      return {
        success: false,
        error: error.message || "Failed to process transaction",
      };
    }
  };

  return {
    executeContractFunction,
    addBadge: (badgeName: string, issuer: string, score: number) =>
      executeContractFunction("add_badge", badgeName, issuer, score),
    removeBadge: (badgeName: string, issuer: string, score: number) =>
      executeContractFunction("remove_badge", badgeName, issuer, score),
  };
};
