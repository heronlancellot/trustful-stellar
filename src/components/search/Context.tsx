import React, { createContext, useContext, useState } from "react";
import {
  SearchContext,
  SearchContextProviderProps,
  SearchedUserBadge,
} from "./types";

const searchCtx = createContext<SearchContext | undefined>(undefined);

const SearchContextProvider: React.FC<SearchContextProviderProps> = (
  props: SearchContextProviderProps
) => {
  const [searchedUserAddress, setSearchedUserAddress] = useState<string>("");

  const [searchedUserBadges, setSearchedUserBadges] = useState<
    SearchedUserBadge[]
  >();

  const [searchedUserScore, setSearchedUserScore] = useState<number>();

  return (
    <searchCtx.Provider
      value={{
        searchedUserAddress,
        setSearchedUserAddress,
        searchedUserBadges,
        setSearchedUserBadges,
        searchedUserScore,
        setSearchedUserScore,
      }}
    >
      {props.children}
    </searchCtx.Provider>
  );
};

const useSearchContext = () => {
  const ctx = useContext(searchCtx);
  if (ctx === undefined) {
    throw new Error("userAuthContext: ctx is undefined");
  }
  return ctx;
};

export { useSearchContext, SearchContextProvider };
