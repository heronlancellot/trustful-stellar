import { kit } from "@/components/auth/ConnectStellarWallet";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";
import * as StellarSdk from "@stellar/stellar-sdk";
import toast from "react-hot-toast";

const signTransaction = async (transactionXdr: string) => {
  const { address } = await kit.getAddress();
  const { signedTxXdr } = await kit.signTransaction(transactionXdr, {
    address,
    networkPassphrase: WalletNetwork.PUBLIC,
  });
  const transaction = new StellarSdk.Transaction(
    signedTxXdr,
    StellarSdk.Networks.PUBLIC
  );
  return transaction;
};

const signFeeBumpTransaction = async (transactionXdr: string) => {
  const { address } = await kit.getAddress();
  const { signedTxXdr } = await kit.signTransaction(transactionXdr, {
    address,
    networkPassphrase: WalletNetwork.PUBLIC,
  });
  const feeBumpTransaction = new StellarSdk.FeeBumpTransaction(
    signedTxXdr,
    StellarSdk.Networks.PUBLIC
  );
  return feeBumpTransaction;
};

export const sendSignedTransaction = async (
  transactionXdr: string,
  userAddress: string
) => {
  try {
    const network = StellarSdk.Networks.PUBLIC;
    const horizonServer = new StellarSdk.Horizon.Server(
      "https://horizon.stellar.org"
    );

    // 2. Re build the original transaction
    const originalTransaction = new StellarSdk.Transaction(
      transactionXdr,
      network
    );
    const signedTransaction = await signTransaction(
      originalTransaction.toXDR()
    );

    const multipliedBaseFee = String(parseInt(StellarSdk.BASE_FEE) * 2);
    // 3. Fee bump the original transaction
    const feeBumpTransaction: StellarSdk.FeeBumpTransaction =
      StellarSdk.TransactionBuilder.buildFeeBumpTransaction(
        userAddress,
        multipliedBaseFee,
        signedTransaction,
        network
      );

    const signedFeeBumpTransaction = await signFeeBumpTransaction(
      feeBumpTransaction.toXDR()
    );

    // 4. Submit the fee-bumped transaction
    const res = await horizonServer.submitTransaction(signedFeeBumpTransaction);
    if (res) {
      return res.hash;
    }
  } catch (error) {
    console.error(error);
    if (error === undefined) {
      throw new Error("Undefined Error");
    } else if (
      (error as StellarSdk.NetworkError)?.response?.data?.status === 400
    ) {
      if (
        (error as StellarSdk.NetworkError)?.response?.data?.title.includes(
          "Transaction Failed"
        )
      ) {
        const errorData = (error as StellarSdk.BadRequestError).response
          ?.data as StellarSdk.Horizon.HorizonApi.ErrorResponseData.TransactionFailed;
        const isLowReserveError =
          errorData.extras.result_codes.operations.includes("op_low_reserve");
        if (isLowReserveError) {
          throw new Error(
            "Transaction Failed: Your XLM reserve is too low to submit this transaction"
          );
        } else {
          throw new Error(
            "Transaction Failed: " + (error as StellarSdk.NetworkError)?.message
          );
        }
      }
    } else if (
      (error as StellarSdk.NetworkError)?.response?.data?.status === 429
    ) {
      throw new Error("Too many requests, try again later");
    } else if (
      (error as StellarSdk.NetworkError)?.response?.data?.status === 500
    ) {
      throw new Error("Internal Server Error, try again later");
    }
    throw error;
  }
};
