import { rpc, TransactionBuilder, BASE_FEE, Networks, Operation, Address } from "@stellar/stellar-sdk";
import albedo from "@albedo-link/intent";
import { useAuthContext } from "@/components/auth/Context";

interface UseStellarContractProps {
    contractId: string;
    rpcUrl: string;
    networkType: "TESTNET" | "PUBLIC";
}

export const useStellarContract = ({ contractId, rpcUrl, networkType = "TESTNET" }: UseStellarContractProps) => {
    const { userAddress } = useAuthContext()
    const executeContractFunction = async (functionName: string) => {
        try {
            // Load user account via RPC
            const server = new rpc.Server(rpcUrl, { allowHttp: true });
            const account = await server.getAccount(`${userAddress}`);

            // Create and prepare transaction
            const transaction = new TransactionBuilder(account, {
                fee: BASE_FEE,
                networkPassphrase: networkType === "TESTNET" ? Networks.TESTNET : Networks.PUBLIC
            })
                .addOperation(
                    Operation.invokeContractFunction({
                        function: functionName,
                        contract: contractId,
                        args: [
                            new Address(`${userAddress}`).toScVal(),
                        ]
                    })
                )
                .setTimeout(30)
                .build();

            const preparedTransaction = await server.prepareTransaction(transaction);
            const transactionXDR = preparedTransaction.toXDR();

            // Sign with Albedo and submit
            const signResult = await albedo.tx({
                xdr: transactionXDR,
                network: networkType.toLowerCase(),
                submit: true
            });

            return { success: true, txHash: signResult.tx_hash };
        } catch (error: any) {
            console.error('Contract execution error:', error);
            return {
                success: false,
                error: error.message || "Failed to process transaction"
            };
        }
    };

    return {
        executeContractFunction,
        addUser: () => executeContractFunction('add_user'),
        removeUser: () => executeContractFunction('remove_user'),
    };
}; 