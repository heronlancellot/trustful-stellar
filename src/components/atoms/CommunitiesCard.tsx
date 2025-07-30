import { ComponentPropsWithoutRef } from "react";
import cc from "classcat";
import { Communities } from "@/types/communities";
import {
  CakeIcon,
  InformationIcon,
  PlusIcon,
  TagIcon,
  UserIcon,
} from "@/components/atoms/icons";
import { Minus } from "lucide-react";
import { useStellarContract } from "@/lib/stellar/transactions/hooks/useStellarContract";
import toast from "react-hot-toast";
import { useAuthContext } from "../auth/Context";
import { useQueryClient } from "@tanstack/react-query";
import { useCommunityContext } from "../community/Context";
import { STELLAR } from "@/lib/environmentVars";

interface CommunitiesCardProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onClick"> {
  community: Communities;
  onClick?: () => void;
  currentTab?: "all" | "joined" | "created" | "hidden";
}

export const CommunitiesCard = ({
  community,
  className,
  onClick,
  currentTab = "all",
  ...props
}: CommunitiesCardProps) => {
  const { userAddress, setUserAddress } = useAuthContext();
  const queryClient = useQueryClient();
  const { getCommunities } = useCommunityContext();

  const formattedContractAddress = community.community_address.toUpperCase();

  const hideExitButton =
    (currentTab === "joined" || currentTab === "all") &&
    userAddress &&
    community.creator_address.toLocaleLowerCase() ===
      userAddress.toLocaleLowerCase();

  const stellarContractJoinCommunities = useStellarContract({
    contractId: formattedContractAddress,
    rpcUrl: STELLAR.RPC_URL,
    userAddress: userAddress,
  });

  const handleJoin = async () => {
    if (!userAddress) {
      toast.error("Please connect your wallet first");
      return;
    }
    try {
      const result = await stellarContractJoinCommunities.addUser();
      if (result.success) {
        toast.success("Successfully joined community");

        queryClient.invalidateQueries({ queryKey: ["communities"] });
        queryClient.invalidateQueries({
          queryKey: ["communities", "joined", userAddress],
        });
        queryClient.invalidateQueries({
          queryKey: [
            "community-details",
            community.community_address,
            userAddress,
          ],
        });

        await getCommunities();

        setTimeout(() => {
          queryClient.resetQueries();
        }, 500);

        const currentData = queryClient.getQueryData([
          "communities",
          userAddress,
        ]) as Communities[] | undefined;
        if (currentData) {
          const updatedData = currentData.map((c) =>
            c.community_address === community.community_address
              ? { ...c, is_joined: true }
              : c,
          );
          queryClient.setQueryData(["communities", userAddress], updatedData);
        }
      } else {
        toast.error("Failed to join community");
        console.error("Transaction failed:", result.error);
      }
    } catch (error) {
      toast.error(
        "Can't find your wallet registry, make sure you're trying to connect an initialized(funded) wallet",
      );
      setUserAddress("");
    }
  };

  const handleExit = async () => {
    if (!userAddress) {
      toast.error("Please connect your wallet first");
      return;
    }
    try {
      console.log("handleExit - userAddress:", userAddress);
      const result = await stellarContractJoinCommunities.removeUser();
      console.log("handleExit - result:", result);

      if (result.success) {
        toast.success("Successfully left community");

        queryClient.invalidateQueries({ queryKey: ["communities"] });
        queryClient.invalidateQueries({
          queryKey: ["communities", "joined", userAddress],
        });
        queryClient.invalidateQueries({
          queryKey: [
            "community-details",
            community.community_address,
            userAddress,
          ],
        });

        await getCommunities();

        setTimeout(() => {
          queryClient.resetQueries();
        }, 500);

        const currentData = queryClient.getQueryData([
          "communities",
          userAddress,
        ]) as Communities[] | undefined;
        if (currentData) {
          const updatedData = currentData.map((c) =>
            c.community_address === community.community_address
              ? { ...c, is_joined: false }
              : c,
          );
          queryClient.setQueryData(["communities", userAddress], updatedData);
        }
        console.log("handleExit - currentData:", currentData);
      } else {
        toast.error("Failed to leave community");
        console.error("Transaction failed:", result.error);
      }
    } catch (error) {
      console.error("handleExit - error:", error);
      toast.error(
        "Can't find your wallet registry, make sure you're trying to connect an initialized(funded) wallet",
      );
      setUserAddress("");
    }
  };

  return (
    <div
      className={cc([
        "group flex h-[212px] w-[376px] max-w-sm flex-col rounded-lg border border-whiteOpacity008 bg-whiteOpacity005 transition-colors duration-300 ease-linear hover:bg-whiteOpacity008",
        className,
      ])}
      {...props}
      style={{ boxSizing: "border-box" }}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex h-[38px] w-[38px] items-center justify-center overflow-hidden rounded-full bg-whiteOpacity008 p-2">
          <div className="h-4 w-4">
            {community?.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={community?.icon}
                alt="icon image"
                width={24}
                height={24}
              />
            ) : (
              <CakeIcon />
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div>
            <button
              className="flex h-8 w-8 items-center justify-center gap-2 overflow-hidden rounded-md bg-whiteOpacity005 bg-opacity-25 px-3 text-lime-400 transition-all duration-300 ease-in-out hover:bg-whiteOpacity008 group-hover:w-16 group-hover:justify-start"
              onClick={onClick}
            >
              {" "}
              <div className="flex items-center justify-center">
                <InformationIcon className="transition-all duration-500 ease-in-out" />
                <span className="ml-2 hidden font-inter text-sm transition-all duration-500 ease-in-out group-hover:inline-block group-hover:opacity-100">
                  Info
                </span>
              </div>
            </button>
          </div>

          {currentTab !== "created" &&
            currentTab !== "hidden" &&
            !hideExitButton && (
              <div>
                <button
                  className={cc([
                    "flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-whiteOpacity005 bg-opacity-25 px-2 text-lime-400 transition-all duration-300 ease-in-out hover:bg-whiteOpacity008 group-hover:w-auto group-hover:min-w-16 group-hover:justify-start group-hover:px-3",
                    { "cursor-not-allowed opacity-50": !userAddress },
                  ])}
                  disabled={!userAddress}
                >
                  {!("is_joined" in community) ? (
                    <div className="flex items-center justify-center">
                      <Minus className="transition-all duration-500 ease-in-out" />
                      <span
                        className="ml-2 hidden font-inter text-sm transition-all duration-500 ease-in-out group-hover:inline-block group-hover:opacity-100"
                        onClick={handleExit}
                      >
                        Exit
                      </span>
                    </div>
                  ) : community.is_joined ? (
                    <div className="flex items-center justify-center">
                      <Minus className="transition-all duration-500 ease-in-out" />
                      <span
                        className="ml-2 hidden whitespace-nowrap font-inter text-sm transition-all duration-500 ease-in-out group-hover:inline-block group-hover:opacity-100"
                        onClick={handleExit}
                      >
                        Exit
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <PlusIcon className="transition-all duration-500 ease-in-out" />
                      <span
                        className="ml-2 hidden font-inter text-sm transition-all duration-500 ease-in-out group-hover:inline-block group-hover:opacity-100"
                        onClick={handleJoin}
                      >
                        Join
                      </span>
                    </div>
                  )}
                </button>
              </div>
            )}
        </div>
      </div>
      <div className="flex flex-col justify-center gap-1 p-3">
        <div className="title">
          <span className="border-s-violet-600 font-inter text-lg font-medium">
            {community?.name}
          </span>
        </div>
        <div className="description">
          <span className="block overflow-hidden text-ellipsis font-inter text-sm font-normal text-whiteOpacity05">
            {community?.description}
          </span>
        </div>

        <div className="flex-start mt-10 flex gap-3">
          <div className="flex items-center justify-center gap-1 text-xs">
            <div className="h-3 w-3">
              <UserIcon />
            </div>
            <div className="flex justify-center">
              <span>{community?.total_members}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs">
            <div className="h-3 w-3">
              <TagIcon />
            </div>
            <div className="flex justify-center">
              <span>{community?.total_badges}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
