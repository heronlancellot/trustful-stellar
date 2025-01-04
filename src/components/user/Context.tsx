import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserBadge, UserContext, UserContextProviderProps } from "./types";
import { CommunityBadge } from "../community/types";
import usersClient from "@/lib/http-clients/UsersClient";
import { useAuthContext } from "../auth/Context";
import toast from "react-hot-toast";
import { BLOCKFUL_QUEST_NAME } from "@/lib/constants";

const userCtx = createContext<UserContext | undefined>(undefined);

const UserContextProvider: React.FC<UserContextProviderProps> = (
  props: UserContextProviderProps
) => {
  const { userAddress } = useAuthContext();
  const [userScore, setUserScore] = useState<number>();
  const [userBadgesImported, setUserBadgesImported] = useState<UserBadge[]>([]);
  const [userBadgesToImport, _setUserBadgesToImport] = useState<UserBadge[]>(
    []
  );
  const fetchScore = useCallback(async () => {
    if (!!userAddress) {
      try {
        const newScore = await usersClient.getScore(userAddress);
        setUserScore(newScore);
      } catch (error) {
        console.error(error);
        toast.error("Error getting user score", {
          position: "top-right",
          duration: 2000,
        });
        setUserScore(undefined);
      }
    } else if (userAddress === "") {
      setUserScore(undefined);
    }
  }, [userAddress]);

  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  const setUserBadgesToImport = (
    _userBadges: UserBadge[],
    _userBadgesImported: UserBadge[],
    _communityBadges: CommunityBadge[]
  ) => {
    // All blockful badges are opened to import,
    // so we create this array to consider all blockfulBadges as badges to be imported..
    const blockfulBadges: UserBadge[] = _communityBadges
      .filter(({ questName }) => questName === BLOCKFUL_QUEST_NAME)
      .map((communityBadge) => ({
        balance: "1",
        assetType: "credit_alphanum12",
        assetCode: communityBadge.assetCode,
        buyingLiabilities: "0",
        sellingLiabilities: "0",
      }));

    const _userBadgesToImport = _userBadges
      // And add the blockfulBadges here to be analyzed as userBadges
      .concat(blockfulBadges)
      .filter(({ assetCode }) => {
        if (!assetCode) return false;
        const communityIncludesBadge = _communityBadges.some(
          ({ assetCode: communityBadgeAssetCode }) => {
            return (
              communityBadgeAssetCode.toLocaleLowerCase() ===
              assetCode.toLocaleLowerCase()
            );
          }
        );
        const userBadgesImportedIncludesBadge = _userBadgesImported.some(
          ({ assetCode: importedBadgeAssetCode }) =>
            !!importedBadgeAssetCode &&
            assetCode.toLocaleLowerCase() ===
              importedBadgeAssetCode.toLocaleLowerCase()
        );
        return communityIncludesBadge && !userBadgesImportedIncludesBadge;
      });
    _setUserBadgesToImport(_userBadgesToImport);
  };
  return (
    <userCtx.Provider
      value={{
        userScore,
        setUserScore,
        userBadgesImported,
        setUserBadgesImported,
        userBadgesToImport,
        setUserBadgesToImport,
      }}
    >
      {props.children}
    </userCtx.Provider>
  );
};

const useUsersContext = () => {
  const ctx = useContext(userCtx);
  if (ctx === undefined) {
    throw new Error("userContext: ctx is undefined");
  }
  return ctx;
};

export { useUsersContext, UserContextProvider };
