"use client";

import { createContext, useContext, useState } from "react";
import {
  CommunityContext,
  CommunityContextProviderProps,
  CommunityQuests,
} from "./types";
import { Communities, CommunityBadges, MembersList } from "@/types/communities";
import { useAuthContext } from "../auth/Context";
import { useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/environmentVars";

const communityCtx = createContext<CommunityContext | undefined>(undefined);

const CommunityContextProvider = ({
  children,
}: CommunityContextProviderProps) => {
  const [communityQuests, setCommunityQuests] = useState<CommunityQuests>({});
  const { userAddress } = useAuthContext();
  const queryClient = useQueryClient();

  const [communities, setCommunities] = useState<Communities[]>([]);
  const [verifyReputationcommunities, setVerifyReputationcommunities] =
    useState<Communities[]>([]);
  const [communitiesDetail, setCommunitiesDetail] = useState<
    Communities | any
  >();
  const [communitiesBadgesList, setCommunitiesBadgesList] =
    useState<CommunityBadges>({ total_badges: 0, community_badges: [] });
  const [communitiesMembersList, setCommunitiesMembersList] = useState<
    MembersList[]
  >([]);

  const isJoined = communitiesDetail?.is_joined;

  const getCommunities = async () => {
    try {
      const response = await fetch(
        getApiUrl(`/communities?user_address=${userAddress}`),
      );
      const data = await response.json();

      setCommunities(data);

      queryClient.setQueryData(["communities", userAddress], data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCommunitiesStatus = async (status: string) => {
    const userAddresFormated = userAddress?.toLowerCase();
    try {
      const response = await fetch(
        getApiUrl(`/communities/${status}/${userAddresFormated}`),
      );
      const data = await response.json();

      setCommunities(data);

      queryClient.setQueryData(["communities", status, userAddress], data);
    } catch (error) {
      console.error(error);
    }
  };

  const getVerifyReputationList = async (userAddress: string) => {
    const userAddresFormated = userAddress?.toLowerCase();
    try {
      const response = await fetch(
        getApiUrl(`/communities/joined/${userAddresFormated}`),
      );
      const data = await response.json();
      setVerifyReputationcommunities(data);

      queryClient.setQueryData(
        ["communities", "verify-reputation", userAddress],
        data,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getCommunitiesDetails = async (
    communityAdress: string,
    userAddress?: string,
  ) => {
    try {
      const response = await fetch(
        getApiUrl(
          `/communities/${communityAdress}?user_address=${userAddress}`,
        ),
      );
      const data = await response.json();

      setCommunitiesDetail(data);
      setCommunities([data]);

      queryClient.setQueryData(
        ["community-details", communityAdress, userAddress],
        data,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const refetchCommunitiesAll = async () => {
    try {
      const response = await fetch(
        getApiUrl(`/communities?user_address=${userAddress}`),
      );
      const data = await response.json();

      setCommunities(data);

      queryClient.setQueryData(["communities", userAddress], data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCommunitiesBadgesList = async (communityAddress: string) => {
    try {
      const response = await fetch(
        getApiUrl(
          `/communities/${communityAddress}/badges?user_address=${userAddress}`,
        ),
      );
      const data = await response.json();

      setCommunitiesBadgesList(data);

      queryClient.setQueryData(
        ["community-badges", communityAddress, userAddress],
        data,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getCommunitiesMembersList = async (communityAddress: string) => {
    try {
      const response = await fetch(
        getApiUrl(`/communities/${communityAddress}/members`),
      );
      const data = await response.json();

      setCommunitiesMembersList(data);

      queryClient.setQueryData(["community-members", communityAddress], data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateHideCommunities = async (communityAddress: string) => {
    try {
      const response = await fetch(
        getApiUrl(`/communities/${communityAddress}/visibility`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_hidden: true,
          }),
        },
      );
      const data = await response.json();

      queryClient.invalidateQueries({ queryKey: ["communities"] });

      getCommunities();
    } catch (error) {
      console.error(error);
    }
  };

  const updateShowCommunities = async (communityAddress: string) => {
    try {
      const response = await fetch(
        getApiUrl(`/communities/${communityAddress}/visibility`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_hidden: false,
          }),
        },
      );
      const data = await response.json();

      queryClient.invalidateQueries({ queryKey: ["communities"] });

      getCommunities();
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
        isJoined,
        getVerifyReputationList,
        verifyReputationcommunities,
        setVerifyReputationcommunities,
        updateHideCommunities,
        updateShowCommunities,
      }}
    >
      {children}
    </communityCtx.Provider>
  );
};

export const useCommunityContext = () => {
  const context = useContext(communityCtx);

  if (context === undefined) {
    throw new Error(
      "useCommunityContext must be used within a CommunityContextProvider",
    );
  }

  return context;
};

export { CommunityContextProvider };
