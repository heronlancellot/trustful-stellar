import { StrKey } from "@stellar/stellar-sdk";

export const isValidStellarAddress = (address: string) => {
  return StrKey.isValidEd25519PublicKey(address);
};
