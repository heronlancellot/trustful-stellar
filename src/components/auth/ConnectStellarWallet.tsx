import { useAuthContext } from "@/components/auth/Context";
import {
  ALBEDO_ID,
  AlbedoModule,
  StellarWalletsKit,
  WalletNetwork,
  xBullModule,
} from "@creit.tech/stellar-wallets-kit";
import cc from "classcat";
import { UserDropdown } from "../molecules";
import { setLocalStorageUserAddress } from "@/lib/local-storage/auth";
import { checkIfWalletIsInitialized } from "@/lib/stellar/isFundedStellarWallet";
import toast from "react-hot-toast";
import { STELLAR } from "@/lib/environmentVars";

interface ConnectWalletProps {
  customClassNames?: string;
}

export const kit: StellarWalletsKit = new StellarWalletsKit({
  network: STELLAR.WALLET_NETWORK,
  selectedWalletId: ALBEDO_ID,
  modules: [new AlbedoModule()],
});

export const ConnectStellarWallet = ({
  customClassNames = "",
}: ConnectWalletProps) => {
  const { setUserAddress, userAddress } = useAuthContext();

  const handleConnect = async () => {
    try {
      kit.setWallet(ALBEDO_ID);
      const { address } = await kit.getAddress();
      await checkIfWalletIsInitialized(address);
      setUserAddress(address);
    } catch (error) {
      toast.error(
        "Can't find your wallet registry, make sure you're trying to connect an initialized(funded) wallet",
      );
      setUserAddress("");
    }
  };

  return userAddress ? (
    <UserDropdown />
  ) : (
    <button
      className={cc([
        "rounded-lg bg-brandGreen p-2 px-6 text-base font-medium text-brandBlack",
        customClassNames,
      ])}
      onClick={handleConnect}
    >
      Connect
    </button>
  );
};
