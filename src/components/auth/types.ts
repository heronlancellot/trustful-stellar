import { ReactNode } from "react";

export type AuthContext = {
  userAddress?: string;
  setUserAddress: (address: string) => void;
};

export type AuthProviderProps = {
  children: ReactNode;
};
