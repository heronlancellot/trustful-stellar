import React, { createContext, useContext, useState } from "react";
import {
  CommunityContext,
  CommunityContextProviderProps,
  CommunityQuests,
} from "./types";

const communityCtx = createContext<CommunityContext | undefined>(undefined);

const CommunityContextProvider: React.FC<CommunityContextProviderProps> = (
  props: CommunityContextProviderProps
) => {
  const [communityQuests, setCommunityQuests] = useState<CommunityQuests>({});
  return (
    <communityCtx.Provider
      value={{
        communityQuests,
        setCommunityQuests,
      }}
    >
      {props.children}
    </communityCtx.Provider>
  );
};

const useCommunityContext = () => {
  const ctx = useContext(communityCtx);
  if (ctx === undefined) {
    throw new Error("userAuthContext: ctx is undefined");
  }
  return ctx;
};

export { useCommunityContext, CommunityContextProvider };
