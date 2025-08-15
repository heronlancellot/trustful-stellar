import {
  rpc,
  TransactionBuilder,
  BASE_FEE,
  Networks,
  Operation,
  Address,
} from "@stellar/stellar-sdk";
import albedo from "@albedo-link/intent";

interface UseStellarContractProps {
  contractId: string;
  rpcUrl: string;
  networkType: "TESTNET" | "PUBLIC";
}

export const useStellarContractManager = ({
  contractId,
  rpcUrl,
  networkType = "TESTNET",
}: UseStellarContractProps) => {
  const executeContractFunction = async (
    functionName: string,
    sender: string,
    newManagerAddress: string,
  ) => {
    try {
      // Load user account via RPC
      const server = new rpc.Server(rpcUrl, { allowHttp: true });
      const account = await server.getAccount(sender);

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
              new Address(sender).toScVal(),
              new Address(newManagerAddress).toScVal(),
            ],
          }),
        )
        .setTimeout(500)
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
    addManager: (sender: string, newManagerAddress: string) =>
      executeContractFunction("add_manager", sender, newManagerAddress),
    removeManager: (sender: string, newManagerAddress: string) =>
      executeContractFunction("remove_manager", sender, newManagerAddress),
  };
};
