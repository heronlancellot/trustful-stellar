/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  ContentTabs,
  DappHeader,
  PlusIcon,
  PrimaryButton,
  StarIcon,
  TagIcon,
  UserIcon,
} from "@/components";
import { SearchIcon } from "@/components/atoms/icons/SearchIcon";
import { TableEmptyScreen } from "@/components/atoms/TableEmptyScreen";
import { CustomTable } from "@/components/organisms/CustomTable";
import { IconPosition } from "@/types/iconPosition";
import { useRouter, useSearchParams } from "next/navigation";
import tailwindConfig from "tailwind.config";
import { TrashIcon } from "@/components/atoms/icons/TrashIcon";
import { useModal } from "@/hooks/useModal";
import { CustomModal } from "@/components/molecules";
import { LeaderboardTable } from "@/components/molecules/leaderboard-table";
import { useState, useEffect } from "react";
import { CommunityTableCell } from "@/components/molecules/CommunityTableCell";
import { useCommunityContext } from "@/components/community/Context";
import { useAuthContext } from "@/components/auth/Context";
import useCommunitiesController from "@/components/community/hooks/controller";
import toast from "react-hot-toast";
import { ArrowLeft, Check, EyeOff, LockIcon, EyeIcon, X } from "lucide-react";
import cc from "classcat";
import {
  useCommunityBadges,
  useCommunityDetails,
  useCommunityMembers,
} from "@/lib/hooks/api/useCommunityDetails";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateCommunityVisibility } from "@/lib/hooks/api/useCommunities";
import { ActivityIndicatorModal } from "@/components/molecules/ActivityIndicatorModal";
import { NAVIGATION_STATUS_LIST } from "@/shared/constants";
import { Badge } from "@/components/badge-info/hooks/Controller";

interface DetailsProps {
  params: {
    communityAddress: string;
  };
}

export default function DetailsCommunity({ params }: DetailsProps) {
  const { openModal, closeModal, isOpen } = useModal();
  const { userAddress } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const communityAddress = params.communityAddress;
  const queryClient = useQueryClient();

  const { stellarContractJoinCommunities, stellarContractManagers } =
    useCommunitiesController({ communityAddress });

  const [newManager, setNewManager] = useState<string>("");
  const [removeManager, setRemoveManager] = useState<string>("");
  const [isHiding, setIsHiding] = useState<boolean>(false);
  const [hasOfferedRedirect, setHasOfferedRedirect] = useState<boolean>(false);

  const [isHoveringJoinButton, setIsHoveringJoinButton] =
    useState<boolean>(false);

  const { data: communitiesDetail, isLoading: isLoadingDetails } =
    useCommunityDetails(communityAddress as string, userAddress);
  const { data: communitiesBadgesList, isLoading: isLoadingBadges } =
    useCommunityBadges(communityAddress as string, userAddress);
  const { data: communitiesMembersList, isLoading: isLoadingMembers } =
    useCommunityMembers(communityAddress as string);

  const { mutate: updateHideCommunities } = useUpdateCommunityVisibility();
  const { updateShowCommunities } = useCommunityContext();

  const { setCommunitiesDetail } = useCommunityContext();

  const isJoined = communitiesDetail?.is_joined;
  const totalBadgesMemberList = communitiesDetail?.total_badges;
  const isCreator =
    userAddress &&
    communitiesDetail?.creator_address &&
    userAddress.toLowerCase() ===
      communitiesDetail.creator_address.toLowerCase();

  const { all, joined, created, hidden } = NAVIGATION_STATUS_LIST;

  useEffect(() => {
    if (
      isCreator &&
      status !== created &&
      !hasOfferedRedirect &&
      typeof window !== "undefined"
    ) {
      if (status === hidden) {
        return;
      }

      setHasOfferedRedirect(true);
      router.push(`/communities/${communityAddress}?status=created`);
    }
  }, [
    isCreator,
    status,
    created,
    communityAddress,
    router,
    hasOfferedRedirect,
  ]);

  if (!communityAddress || !status) {
    return <h1>Loading...</h1>;
  }

  if (isLoadingDetails || isLoadingBadges || isLoadingMembers) {
    return <h1>Loading...</h1>;
  }

  const handleJoinedCommunities = async (communityAddress: string) => {
    const result = await stellarContractJoinCommunities.addUser();

    if (result.success) {
      toast.success("Successful Joining Community");

      setCommunitiesDetail((prev: any) => ({
        ...prev,
        is_joined: true,
      }));

      queryClient.invalidateQueries({
        queryKey: ["community-details", communityAddress, userAddress],
      });

      console.log("Transaction successful:", result.txHash);
      closeModal("managers");
    } else {
      toast.error("Not Successful Joining Community");
      closeModal("managers");
      console.error("Transaction failed:", result.error);
    }
  };

  const handleExitCommunities = async (communityAddress: string) => {
    console.log("handleExitCommunities", communityAddress);
    const result = await stellarContractJoinCommunities.removeUser();
    console.log("result", result);

    if (result.success) {
      toast.success("Successful Exiting Community");

      setCommunitiesDetail((prev: any) => ({
        ...prev,
        is_joined: false,
      }));

      queryClient.invalidateQueries({
        queryKey: ["community-details", communityAddress, userAddress],
      });

      console.log("Transaction successful:", result.txHash);
      closeModal("managers");
    } else {
      toast.error("Not Successful Exiting Community");
      closeModal("managers");
      console.error("Transaction failed:", result.error);
    }
  };

  const handleInviteManager = async (newManager: string) => {
    if (
      !communitiesMembersList?.some(
        (member: any) => member.user_address === newManager.toLowerCase(),
      )
    ) {
      toast.error("User is not a member of the community");
      return;
    }

    const sender = userAddress as string;
    const newManagerFormatted = newManager.toUpperCase();

    const result = await stellarContractManagers.addManager(
      sender,
      newManagerFormatted,
    );

    if (result.success) {
      toast.success("Successful Inserting Manager");

      setCommunitiesDetail((prev: any) => {
        const prevData = prev || {};
        const currentManagers = prevData.managers || [];

        if (!currentManagers.includes(newManagerFormatted)) {
          return {
            ...prevData,
            managers: [...currentManagers, newManagerFormatted],
          };
        }

        return prevData;
      });

      queryClient.invalidateQueries({
        queryKey: ["community-details", communityAddress, userAddress],
      });

      console.log("Transaction successful:", result.txHash);
    } else {
      toast.error("Not Successful Inserting Manager");
      console.error("Inserting Manager failed:", result.error);
    }
  };

  const checkIfHasMoreThanOneManager = (): boolean => {
    let totalManagers = 0;
    if (
      communitiesMembersList.map((member: any) => {
        if (member.is_manager) {
          totalManagers++;
        }
      })
    ) {
      if (totalManagers <= 1) {
        return false;
      }
    }
    return true;
  };

  const handleRemoveManager = async (removedManager: string) => {
    const sender = userAddress as string;

    const removedManagerFormatted =
      typeof removedManager === "string" ? removedManager.toUpperCase() : "";

    const result = await stellarContractManagers.removeManager(
      sender,
      removedManagerFormatted,
    );

    if (result.success) {
      toast.success("Successful Removing Manager");

      setCommunitiesDetail((prev: any) => {
        const prevData = prev || {};
        const currentManagers = prevData.managers || [];

        return {
          ...prevData,
          managers: currentManagers.filter(
            (manager: string) => manager !== removedManagerFormatted,
          ),
        };
      });

      queryClient.invalidateQueries({
        queryKey: ["community-details", communityAddress, userAddress],
      });

      console.log("Transaction successful:", result.txHash);
      closeModal("removeManager");
    } else {
      toast.error("Not Successful Removing Manager");
      closeModal("removeManager");
      console.error("Removing Manager failed:", result.error);
    }
  };

  const newCommunitiesBadgesList = Array.isArray(
    communitiesBadgesList?.community_badges,
  )
    ? communitiesBadgesList.community_badges
    : [];

  const handleHideCommunity = async (communityAddress: string) => {
    setIsHiding(true);
    try {
      await updateHideCommunities(communityAddress);
      toast.success("Community hidden successfully");

      setCommunitiesDetail((prev: any) => ({
        ...prev,
        is_hidden: true,
      }));

      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["communities", userAddress] });
      queryClient.invalidateQueries({
        queryKey: ["communities", "joined", userAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["communities", "created", userAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["communities", "hidden", userAddress],
      });

      setTimeout(() => {
        router.push("/communities?status=hidden");
      }, 1000);
    } catch (error) {
      toast.error("Failed to hide community");
      console.error("Error hiding community:", error);
    } finally {
      setIsHiding(false);
      closeModal("hideCommunity");
    }
  };

  const handleShowCommunity = async (communityAddress: string) => {
    setIsHiding(true);
    try {
      await updateShowCommunities(communityAddress);
      toast.success("Community shown successfully");

      setCommunitiesDetail((prev: any) => ({
        ...prev,
        is_hidden: false,
      }));

      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["communities", userAddress] });
      queryClient.invalidateQueries({
        queryKey: ["communities", "joined", userAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["communities", "created", userAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["communities", "hidden", userAddress],
      });

      setTimeout(() => {
        router.push("/communities?status=all");
      }, 1000);
    } catch (error) {
      toast.error("Failed to show community");
      console.error("Error showing community:", error);
    } finally {
      setIsHiding(false);
    }
  };

  const searchedUserBadges = newCommunitiesBadgesList.map((badge: Badge) => ({
    badgeName: (
      <div className="flex h-7 flex-row items-center">
        <div className="flex flex-col">
          <span>{badge?.name}</span>
          <span>{badge?.score}</span>
          <span className="text-sm text-whiteOpacity05">
            Points: {badge.score}
          </span>
        </div>
      </div>
    ),
    Score: <CommunityTableCell issuerAddress={badge?.score.toString()} />,
    Name: <CommunityTableCell issuerAddress={badge?.name} />,
    Status: (
      <CommunityTableCell
        issuerAddress={badge?.user_has ? "Completed" : "Pending"}
      />
    ),
  }));

  return (
    <div className="flex h-full w-full flex-col bg-brandBlack">
      <div className="z-10 h-fit w-full">
        <DappHeader />
      </div>
      <div className="flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/communities")}
                className="flex size-8 items-center justify-center rounded-full transition-colors"
              >
                <div className="group size-4">
                  <ArrowLeft className="group-hover:text-brandGreen" />
                </div>
              </button>
              <h1 className="text-2xl">{`${communitiesDetail?.name}`}</h1>
            </div>

            <div>
              {status === all && (
                <div className="flex justify-items-center">
                  {isCreator ? (
                    <div className="flex justify-items-center gap-2">
                      <PrimaryButton
                        className="w-max rounded-lg bg-darkGreenOpacity01 text-brandGreen"
                        label="Hide"
                        icon={
                          <EyeOff
                            color={
                              tailwindConfig.theme.extend.colors.brandGreen
                            }
                            width={16}
                            height={16}
                          />
                        }
                        iconPosition={IconPosition.LEFT}
                        onClick={() => openModal("hideCommunity")}
                      />
                      <PrimaryButton
                        className="w-max rounded-lg"
                        label="Managers"
                        icon={<LockIcon color="black" width={16} height={16} />}
                        iconPosition={IconPosition.LEFT}
                        onClick={() => openModal("managers")}
                      />
                    </div>
                  ) : (
                    <div>
                      {typeof isJoined !== "undefined" && isJoined ? (
                        <PrimaryButton
                          className="group w-max rounded-lg bg-darkGreenOpacity01 text-brandGreen after:content-['']"
                          label={isHoveringJoinButton ? "Exit" : "Joined"}
                          onMouseEnter={() => setIsHoveringJoinButton(true)}
                          onMouseLeave={() => setIsHoveringJoinButton(false)}
                          icon={
                            <Check
                              color={
                                tailwindConfig.theme.extend.colors.brandGreen
                              }
                              width={24}
                              height={24}
                            />
                          }
                          iconPosition={IconPosition.LEFT}
                          onClick={() =>
                            handleExitCommunities(communityAddress as string)
                          }
                        />
                      ) : (
                        <PrimaryButton
                          className={cc([
                            "w-max rounded-lg",
                            {
                              "cursor-not-allowed bg-darkGreenOpacity01 opacity-30":
                                !userAddress,
                            },
                          ])}
                          label="Join"
                          icon={
                            <PlusIcon color="black" width={16} height={16} />
                          }
                          iconPosition={IconPosition.LEFT}
                          onClick={() =>
                            handleJoinedCommunities(communityAddress as string)
                          }
                          disabled={!userAddress}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
              {status === created && (
                <div className="flex justify-items-center gap-2">
                  <PrimaryButton
                    className="w-max rounded-lg bg-darkGreenOpacity01 text-brandGreen"
                    label="Hide"
                    icon={
                      <EyeOff
                        color={tailwindConfig.theme.extend.colors.brandGreen}
                        width={16}
                        height={16}
                      />
                    }
                    iconPosition={IconPosition.LEFT}
                    onClick={() => openModal("hideCommunity")}
                  />
                  <PrimaryButton
                    className="w-max rounded-lg"
                    label="Managers"
                    icon={<LockIcon color="black" width={16} height={16} />}
                    iconPosition={IconPosition.LEFT}
                    onClick={() => openModal("managers")}
                  />
                </div>
              )}
              {status === joined && (
                <div className="flex justify-items-center">
                  {isCreator ? (
                    <div className="flex justify-items-center gap-2">
                      <PrimaryButton
                        className="w-max rounded-lg bg-darkGreenOpacity01 text-brandGreen"
                        label="Hide"
                        icon={
                          <EyeOff
                            color={
                              tailwindConfig.theme.extend.colors.brandGreen
                            }
                            width={16}
                            height={16}
                          />
                        }
                        iconPosition={IconPosition.LEFT}
                        onClick={() => openModal("hideCommunity")}
                      />
                      <PrimaryButton
                        className="w-max rounded-lg"
                        label="Managers"
                        icon={<LockIcon color="black" width={16} height={16} />}
                        iconPosition={IconPosition.LEFT}
                        onClick={() => openModal("managers")}
                      />
                    </div>
                  ) : (
                    <div>
                      {typeof isJoined === "undefined" || !isJoined ? (
                        <PrimaryButton
                          className={cc([
                            "w-max rounded-lg",
                            {
                              "cursor-not-allowed bg-darkGreenOpacity01 opacity-30":
                                !userAddress,
                            },
                          ])}
                          label="Join"
                          icon={
                            <PlusIcon color="black" width={16} height={16} />
                          }
                          iconPosition={IconPosition.LEFT}
                          onClick={() =>
                            handleJoinedCommunities(communityAddress as string)
                          }
                          disabled={!userAddress}
                        />
                      ) : (
                        <PrimaryButton
                          className="w-max rounded-lg bg-darkGreenOpacity01 text-brandGreen"
                          label={isHoveringJoinButton ? "Exit" : "Joined"}
                          onMouseEnter={() => setIsHoveringJoinButton(true)}
                          onMouseLeave={() => setIsHoveringJoinButton(false)}
                          icon={
                            <Check
                              color={
                                tailwindConfig.theme.extend.colors.brandGreen
                              }
                              width={24}
                              height={24}
                            />
                          }
                          iconPosition={IconPosition.LEFT}
                          onClick={() =>
                            handleExitCommunities(communityAddress as string)
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
              {status === hidden && (
                <div className="flex justify-items-center">
                  <PrimaryButton
                    className="w-max rounded-lg bg-darkGreenOpacity01 text-brandGreen"
                    label="Show"
                    icon={
                      <EyeIcon
                        color={tailwindConfig.theme.extend.colors.brandGreen}
                        width={16}
                        height={16}
                      />
                    }
                    iconPosition={IconPosition.LEFT}
                    onClick={() =>
                      handleShowCommunity(communityAddress as string)
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <h3 className="pl-12 text-base text-gray-500">{`${communitiesDetail?.description}`}</h3>
        </div>

        <div className="flex items-center gap-2 pl-12">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4" />
            <span className="text-gray-500">
              Created by {communitiesDetail?.creator_address?.substring(0, 10)}
              ...
            </span>
          </div>
          <span className="text-gray-500">/</span>
          <div className="flex items-center gap-2">
            <UserIcon className="w-4" />
            <span className="text-gray-500">
              {communitiesDetail?.total_members}
            </span>
            <span className="text-gray-500">participants</span>
          </div>
          <span className="text-gray-500">/</span>
          <div className="flex items-center gap-2">
            <TagIcon className="w-4" />
            <span className="text-gray-500">
              {communitiesDetail?.total_badges}
            </span>
            <span className="text-gray-500">Badges</span>
          </div>
        </div>
      </div>

      <div className="py-8">
        {status === all && (
          <ContentTabs
            tabs={{
              Badges: {
                content: (
                  <div className="px-12">
                    <CustomTable
                      communityAddress={communityAddress}
                      childrenForEmptyTable={
                        <TableEmptyScreen
                          icon={
                            <SearchIcon
                              color={
                                tailwindConfig.theme.extend.colors
                                  .whiteOpacity05
                              }
                            />
                          }
                          title="Search to start"
                          description="Check a user's reputation by searching for their address"
                        />
                      }
                      className="mt-6"
                      headers={["Name", "Score"]}
                      data={searchedUserBadges}
                    />
                  </div>
                ),
                tabNumber: 1,
              },
              Leaderboard: {
                content: (
                  <LeaderboardTable
                    communitiesMembersList={communitiesMembersList}
                    totalBadgesMemberList={totalBadgesMemberList}
                  />
                ),
                tabNumber: 2,
              },
            }}
          ></ContentTabs>
        )}
        {status === created && ( // When the community is created, the user can see the badges that he has created and manage it
          <ContentTabs
            tabs={{
              Badges: {
                content: (
                  <div className="px-12">
                    <CustomTable
                      communityAddress={communityAddress}
                      childrenForEmptyTable={
                        <TableEmptyScreen
                          icon={
                            <SearchIcon
                              color={
                                tailwindConfig.theme.extend.colors
                                  .whiteOpacity05
                              }
                            />
                          }
                          title="Search to start"
                          description="Check a user's reputation by searching for their address"
                        />
                      }
                      className="mt-6"
                      headers={["Name", "Score", "Status"]}
                      data={newCommunitiesBadgesList}
                      isLogged
                      isCreated
                    />
                  </div>
                ),
                tabNumber: 1,
              },
              Leaderboard: {
                content: (
                  <LeaderboardTable
                    communitiesMembersList={communitiesMembersList}
                    totalBadgesMemberList={totalBadgesMemberList}
                  />
                ),
                tabNumber: 2,
              },
            }}
          />
        )}
        {status === joined && (
          <ContentTabs
            tabs={{
              Badges: {
                content: (
                  <div className="px-12">
                    <CustomTable
                      communityAddress={communityAddress}
                      childrenForEmptyTable={
                        <TableEmptyScreen
                          icon={
                            <SearchIcon
                              color={
                                tailwindConfig.theme.extend.colors
                                  .whiteOpacity05
                              }
                            />
                          }
                          title="Search to start"
                          description="Check a user's reputation by searching for their address"
                        />
                      }
                      className="mt-6"
                      headers={["Name", "Score", "Status"]}
                      data={searchedUserBadges}
                    />
                  </div>
                ),
                tabNumber: 1,
              },
              Leaderboard: {
                content: (
                  <LeaderboardTable
                    communitiesMembersList={communitiesMembersList}
                    totalBadgesMemberList={totalBadgesMemberList}
                  />
                ),
                tabNumber: 2,
              },
            }}
          ></ContentTabs>
        )}
        {status === hidden && (
          <ContentTabs
            tabs={{
              Badges: {
                content: (
                  <div className="px-12">
                    <CustomTable
                      communityAddress={communityAddress}
                      childrenForEmptyTable={
                        <TableEmptyScreen
                          icon={
                            <SearchIcon
                              color={
                                tailwindConfig.theme.extend.colors
                                  .whiteOpacity05
                              }
                            />
                          }
                          title="Search to start"
                          description="Check a user's reputation by searching for their address"
                        />
                      }
                      className="mt-6"
                      headers={["Name", "Score", "Status"]}
                      data={searchedUserBadges}
                    />
                  </div>
                ),
                tabNumber: 1,
              },
              Leaderboard: {
                content: (
                  <LeaderboardTable
                    communitiesMembersList={communitiesMembersList}
                    totalBadgesMemberList={totalBadgesMemberList}
                  />
                ),
                tabNumber: 2,
              },
            }}
          />
        )}
      </div>

      <CustomModal
        title="Hide community?"
        isOpen={isOpen("hideCommunity")}
        onClose={() => closeModal("hideCommunity")}
        isAsync={false}
        headerBackgroundColor="bg-whiteOpacity008"
      >
        <>
          <div className="w-full bg-whiteOpacity008">
            <div className="border-b border-whiteOpacity005 p-6">
              <span className="text-base font-normal">
                {`If you hide this community it won't be visible anymore.`}
              </span>
            </div>
          </div>
          <div className="flex h-[68px] w-[480px] justify-end gap-2 bg-whiteOpacity008 pb-4 pl-6 pr-6 pt-4">
            <button className="h-[36px] w-[153px] rounded-md bg-darkGreenOpacity01 pl-2 pr-2 text-center text-sm text-brandGreen">
              No, keep visible
            </button>
            <button
              className="h-[36px] w-[102px] rounded-md bg-othersRed pl-2 pr-2 text-center text-sm text-brandBlack"
              onClick={() => handleHideCommunity(communityAddress as string)}
            >
              Yes, hide
            </button>
          </div>
        </>
      </CustomModal>

      <CustomModal
        title="People that can manage"
        isOpen={isOpen("managers")}
        onClose={() => closeModal("managers")}
        isAsync={false}
        headerBackgroundColor="bg-whiteOpacity008"
      >
        <>
          <div className="flex h-[428px] w-[580px] flex-col items-center bg-whiteOpacity008">
            <div className="flex h-[172px] w-[552px] flex-col items-center">
              <div className="w-[552px]">
                <div className="flex gap-3 py-3">
                  <input
                    placeholder="Add managers by inserting the Stellar address"
                    className="h-[36px] w-[440px] rounded-lg bg-whiteOpacity005 p-2"
                    type="text"
                    onChange={(e) => setNewManager(e.target.value)}
                  />
                  <button
                    className="flex h-[36px] w-[100px] items-center justify-center rounded-lg bg-brandGreen text-center text-base text-brandBlack"
                    onClick={() => handleInviteManager(newManager)}
                  >
                    Invite
                  </button>
                </div>
                <div className="flex w-full flex-col">
                  {communitiesDetail?.managers?.map((item: string) => (
                    <div
                      key={item}
                      className="flex w-full items-center border-b border-whiteOpacity005 border-opacity-10 py-3"
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <div className="flex items-center gap-4">
                          <div className="size-[35px] rounded-full bg-blue-500 p-2">
                            <StarIcon />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-normal">
                              {`${item.slice(0, 32)}...`}
                            </span>
                            <span className="text-xs text-whiteOpacity05">
                              Manager
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (checkIfHasMoreThanOneManager()) {
                              setRemoveManager(item);
                              openModal("removeManager");
                              return;
                            } else {
                              toast.error(
                                "You need at least two managers to remove one",
                              );
                            }
                          }}
                          className="size-[15px] cursor-pointer hover:bg-whiteOpacity005"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      </CustomModal>

      <CustomModal
        title="Remove Manager?"
        isOpen={isOpen("removeManager")}
        onClose={() => closeModal("removeManager")}
        isAsync={false}
        headerBackgroundColor="bg-whiteOpacity008"
      >
        <>
          <div className="h-[100px] w-[500px] bg-whiteOpacity008 p-6">
            <span className="text-base font-normal">
              If you remove this manager, it will no longer be able to manage
              this community.
            </span>
          </div>
          <div className="flex justify-end gap-2 bg-whiteOpacity008 pb-4 pl-6 pr-6 pt-4">
            <button
              onClick={() => closeModal("removeManager")}
              className="h-[36px] w-[153px] rounded-md bg-darkGreenOpacity01 text-center text-sm text-brandGreen"
            >
              No, keep it
            </button>
            <button
              onClick={() => handleRemoveManager(removeManager)}
              className="h-[36px] w-[102px] rounded-md bg-othersRed text-center text-sm text-brandBlack"
            >
              Yes, delete
            </button>
          </div>
        </>
      </CustomModal>

      {/* Loading indicator for hide community operation */}
      <ActivityIndicatorModal isOpen={isHiding} />
    </div>
  );
}
