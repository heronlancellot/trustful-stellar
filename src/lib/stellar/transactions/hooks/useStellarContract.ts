import {
  rpc,
  TransactionBuilder,
  BASE_FEE,
  Networks,
  Operation,
  Address,
} from '@stellar/stellar-sdk';
import albedo from '@albedo-link/intent';

interface UseStellarContractProps {
  contractId: string;
  rpcUrl: string;
  networkType: 'TESTNET' | 'PUBLIC';
}

export const useStellarContract = ({
  contractId,
  rpcUrl,
  networkType = 'TESTNET',
}: UseStellarContractProps) => {
  const executeContractFunction = async (functionName: string) => {
    try {
      const { pubkey } = await albedo.publicKey({ require_existing: true });

      // Ensure network consistency
      const networkPassphrase =
        networkType === 'TESTNET' ? Networks.TESTNET : Networks.PUBLIC;
      const albedoNetwork = networkType === 'TESTNET' ? 'testnet' : 'public';

      // Validate network consistency
      if (networkType === 'TESTNET' && !rpcUrl.includes('testnet')) {
        console.warn(
          'Network type is TESTNET but RPC URL appears to be for mainnet'
        );
      }
      if (networkType === 'PUBLIC' && rpcUrl.includes('testnet')) {
        console.warn(
          'Network type is PUBLIC but RPC URL appears to be for testnet'
        );
      }

      // Load user account via RPC
      const server = new rpc.Server(rpcUrl, { allowHttp: true });
      const account = await server.getAccount(pubkey);

      // Create and prepare transaction
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase,
      })
        .addOperation(
          Operation.invokeContractFunction({
            function: functionName,
            contract: contractId,
            args: [new Address(pubkey).toScVal()],
          })
        )
        .setTimeout(30)
        .build();

      const preparedTransaction = await server.prepareTransaction(transaction);
      const transactionXDR = preparedTransaction.toXDR();

      console.log('Transaction details:', {
        networkType,
        networkPassphrase,
        albedoNetwork,
        rpcUrl,
        contractId,
        functionName,
      });

      // Sign with Albedo and submit - ensure network consistency
      const signResult = await albedo.tx({
        xdr: transactionXDR,
        network: albedoNetwork,
        submit: true,
      });

      return { success: true, txHash: signResult.tx_hash };
    } catch (error: any) {
      console.error('Contract execution error:', error);

      // Enhanced error handling for network mismatches
      if (
        error.message?.includes('network') ||
        error.ext?.includes('Failed to submit transaction')
      ) {
        console.error('Possible network configuration mismatch. Check:', {
          networkType,
          rpcUrl,
          contractId,
        });
      }

      return {
        success: false,
        error: error.message || 'Failed to process transaction',
        details: error,
      };
    }
  };

  return {
    executeContractFunction,
    addUser: () => executeContractFunction('add_user'),
    removeUser: () => executeContractFunction('remove_user'),
  };
};
