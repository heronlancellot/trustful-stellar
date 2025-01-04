import { useAuthContext } from "@/components/auth/Context";
import {
  ALBEDO_ID,
  AlbedoModule,
  StellarWalletsKit,
  WalletNetwork,
} from "@creit.tech/stellar-wallets-kit";
import cc from "classcat";
import { UserDropdown } from "../molecules";
import { isTestnet } from "@/lib/wallet/chains";
import { setLocalStorageUserAddress } from "@/lib/local-storage/auth";
import { checkIfWalletIsInitialized } from "@/lib/stellar/isFundedStellarWallet";
import toast from "react-hot-toast";

interface ConnectWalletProps {
  customClassNames?: string;
}

export const kit: StellarWalletsKit = new StellarWalletsKit({
  network: isTestnet ? WalletNetwork.TESTNET : WalletNetwork.PUBLIC,
  selectedWalletId: ALBEDO_ID,
  modules: [new AlbedoModule()],
});

export const ConnectStellarWallet = ({
  customClassNames = "",
}: ConnectWalletProps) => {
  const { setUserAddress, userAddress } = useAuthContext();
  return userAddress ? (
    <UserDropdown />
  ) : (
    <button
      className={cc([
        "text-base text-brandBlack font-medium bg-brandGreen p-2 px-6 rounded-lg",
        customClassNames,
      ])}
      onClick={async (e: any) => {
        try {
          kit.setWallet(ALBEDO_ID);
          const { address } = await kit.getAddress();
          await checkIfWalletIsInitialized(address);
          setUserAddress(address);
        } catch (error) {
          toast.error(
            "Can't find your wallet registry, make sure you're trying to connect an initialized(funded) wallet"
          );
          setUserAddress("");
        }
      }}
    >
      Connect
    </button>
  );
};
