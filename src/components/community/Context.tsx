import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CommunityContext,
  CommunityContextProviderProps,
  CommunityQuests,
} from "./types";
import { BadgesList, Communities, MembersList } from "@/types/communities";
import { useAuthContext } from "../auth/Context";

const communityCtx = createContext<CommunityContext | undefined>(undefined);

const CommunityContextProvider: React.FC<CommunityContextProviderProps> = (
  props: CommunityContextProviderProps
) => {
  const [communityQuests, setCommunityQuests] = useState<CommunityQuests>({});
  const [communities, setCommunities] = useState<Communities[]>([])
  const [communitiesDetail, setCommunitiesDetail] = useState<Communities | any>();
  const [communitiesBadgesList, setCommunitiesBadgesList] = useState<BadgesList[]>([])
  const [communitiesMembersList, setCommunitiesMembersList] = useState<MembersList[]>([])
  const isJoined = communitiesDetail?.isJoined
  const { userAddress } = useAuthContext()
  const userAddresFormated = userAddress?.toLowerCase()

  useEffect(() => {
    const getCommunities = async () => {
      try {
        const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities`);
        const data = await response.json();

        setCommunities(data)

      } catch (error) {
        console.error(error);
      }
    };

    getCommunities()
  }, [])

  const getCommunities = async () => {
    try {
      const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities`);
      const data = await response.json();

      setCommunities(data)

    } catch (error) {
      console.error(error);
    }
  };

  const getCommunitiesStatus = async (status: string) => {
    try {
      const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities/${status}/${userAddresFormated}`);
      const data = await response.json();

      setCommunities(data)

    } catch (error) {
      console.error(error);
    }
  };

  const getCommunitiesDetails = async (communityAdress: string) => {
    try {
      const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities/${communityAdress}`);
      const data = await response.json();

      setCommunitiesDetail(data)
      setCommunities([data])

    } catch (error) {
      console.error(error);
    }
  };

  const refetchCommunitiesAll = async () => {
    try {
      const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities`);
      const data = await response.json();

      setCommunities(data)

    } catch (error) {
      console.error(error);
    }
  };

  const getCommunitiesBadgesList = async (communityAddress: string) => {
    try {
      const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities/${communityAddress}/badges`);
      const data = await response.json();

      setCommunitiesBadgesList(data)

    } catch (error) {
      console.error(error);
    }
  };

  const getCommunitiesMembersList = async (communityAddress: string) => {
    try {
      const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities/${communityAddress}/members`);
      const data = await response.json();

      setCommunitiesMembersList(data)

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <communityCtx.Provider
      value={{
        communityQuests,
        setCommunityQuests,
        communities,
        setCommunities,
        getCommunities,
        getCommunitiesStatus,
        refetchCommunitiesAll,
        getCommunitiesDetails,
        getCommunitiesBadgesList,
        getCommunitiesMembersList,
        communitiesBadgesList,
        setCommunitiesBadgesList,
        communitiesMembersList,
        setCommunitiesMembersList,
        communitiesDetail,
        setCommunitiesDetail,
        isJoined
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
