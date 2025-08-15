import {
  rpc,
  TransactionBuilder,
  BASE_FEE,
  Operation,
  Address,
} from "@stellar/stellar-sdk";
import albedo from "@albedo-link/intent";
import { STELLAR, ALBEDO } from "@/lib/environmentVars";

interface UseStellarContractProps {
  contractId: string;
  rpcUrl: string;
  userAddress?: string;
}

export const useStellarContract = ({
  contractId,
  rpcUrl,
  userAddress,
}: UseStellarContractProps) => {
  const executeContractFunction = async (functionName: string) => {
    try {
      // Validate userAddress before proceeding
      if (!userAddress || userAddress.trim() === "") {
        return { success: false, error: "User address is required" };
      }

      // Load user account via RPC
      const server = new rpc.Server(rpcUrl, { allowHttp: true });
      const account = await server.getAccount(userAddress);

      // Create and prepare transaction
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: STELLAR.NETWORK_PASSPHRASE,
      })
        .addOperation(
          Operation.invokeContractFunction({
            function: functionName,
            contract: contractId,
            args: [new Address(userAddress).toScVal()],
          }),
        )
        .setTimeout(500)
        .build();

      const preparedTransaction = await server.prepareTransaction(transaction);
      const transactionXDR = preparedTransaction.toXDR();

      const signResult = await albedo.tx({
        xdr: transactionXDR,
        network: ALBEDO.NETWORK_TYPE,
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
    addUser: () => executeContractFunction("add_user"),
    removeUser: () => executeContractFunction("remove_user"),
  };
};
