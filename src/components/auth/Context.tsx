"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext, AuthProviderProps } from "./types";
import {
  clearLocalStorageUserAddress,
  getLocalStorageUserAddress,
  setLocalStorageUserAddress,
} from "@/lib/local-storage/auth";
const authCtx = createContext<AuthContext | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!!userAddress) {
        setLocalStorageUserAddress(userAddress);
      } else if (userAddress === "") {
        clearLocalStorageUserAddress();
      }
    }
  }, [userAddress]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserAddress = getLocalStorageUserAddress();
      if (!!storedUserAddress) {
        setUserAddress(storedUserAddress);
      }
    }
  }, []);

  return (
    <authCtx.Provider value={{ userAddress, setUserAddress }}>
      {children}
    </authCtx.Provider>
  );
};

const useAuthContext = () => {
  const ctx = useContext(authCtx);
  if (ctx === undefined) {
    throw new Error("userAuthContext: ctx is undefined");
  }
  return ctx;
};

export { useAuthContext, AuthProvider };
