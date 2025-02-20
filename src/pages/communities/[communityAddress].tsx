import {
    ArrowRightIcon,
    CheckIcon,
    ContentTabs,
    PlusIcon,
    PrimaryButton,
    StarIcon,
    TagIcon,
    UserIcon,
} from "@/components";
import { SearchIcon } from "@/components/atoms/icons/SearchIcon";
import { RankIcon } from "@/components/atoms/icons/RankIcon";
import { TableEmptyScreen } from "@/components/atoms/TableEmptyScreen";
import { IssuerTableCell } from "@/components/atoms/verify-reputation/IssuerTableCell";
import { CustomTable } from "@/components/organisms/CustomTable";
import { IconPosition } from "@/types/iconPosition";
import { useRouter } from "next/router";
import tailwindConfig from "tailwind.config";
import { TrashIcon } from "@/components/atoms/icons/TrashIcon";
import { useModal } from "@/hooks/useModal";
import { CustomModal } from "./components/molecules/custom-modal";
import LeaderboardTable from "../../components/molecules/leaderboard-table"; import { useEffect, useState } from "react";
import { CommunityTableCell } from "../../components/molecules/CommunityTableCell";
import { useParams, usePathname } from "next/navigation";
import { useCommunityContext } from "@/components/community/Context";
"./components/molecules/leaderboard-table";

interface DetailsProps {
    params: {
        data: string[];
    }
}

export default function DetailsCommunity({ params }: DetailsProps) {
    const { openModal, closeModal, isOpen } = useModal();

    const router = useRouter();
    const { status, communityAddress } = router.query;

    const { getCommunitiesBadgesList,
        getCommunitiesMembersList,
        communitiesBadgesList,
        communitiesMembersList,
        getCommunitiesDetails,
        communitiesDetail,
        setCommunitiesDetail } = useCommunityContext()

    useEffect(() => {
        if (communityAddress) {
            getCommunitiesDetails(`${communityAddress}`)
            getCommunitiesBadgesList(`${communityAddress}`)
            getCommunitiesMembersList(`${communityAddress}`)
        }
    }, [communityAddress]) //eslint-disable-line react-hooks/exhaustive-deps

    const statusList = {
        all: "all",
        joined: "joined",
        created: "created",
        hidden: "hidden",
    };

    const { all, joined, created, hidden } = statusList;

    const searchedUserBadgesData = [
        {
            id: "",
            name: "",
            score: "",
            description: "",
            status: "",
        },
    ];

    const searchedUserBadges = communitiesBadgesList?.map((badge) => ({
        badgeName: (
            <div className="flex flex-row items-center h-7">
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
    }));

    if (!communityAddress || !status) {

        return <h1>Carregando...</h1>
    }

    return (
        <div className="flex flex-col w-full h-[calc(100vh-74px)] bg-brandBlack">
            <div className="flex justify-between p-8">
                <div>
                    <h1 className="text-2xl">{`${communitiesDetail?.name}`}</h1>
                    <h3 className="text-gray-500">
                        {`${communitiesDetail?.description}`}
                    </h3>
                </div>
                <div>
                    {status === all && (
                        <div className="flex justify-items-center py-2">
                            <PrimaryButton
                                className="rounded-lg w-max"
                                label="Join" //condicional rendering regarding status
                                icon={<PlusIcon color="black" width={16} height={16} />}
                                iconPosition={IconPosition.LEFT}
                            />
                        </div>
                    )}
                    {status === created && (
                        <div className="flex justify-items-center py-2 gap-2">
                            <div>
                                <PrimaryButton
                                    className=" rounded-lg w-max text-brandGreen bg-darkGreenOpacity01"
                                    label="Hide"
                                    icon={
                                        <PlusIcon
                                            color={tailwindConfig.theme.extend.colors.brandGreen}
                                            width={16}
                                            height={16}
                                        />
                                    }
                                    iconPosition={IconPosition.LEFT}
                                    onClick={() => openModal("hideCommunity")}
                                />
                            </div>
                            <div>
                                <PrimaryButton
                                    className="rounded-lg w-max"
                                    label="Managers"
                                    icon={<PlusIcon color="black" width={16} height={16} />}
                                    iconPosition={IconPosition.LEFT}
                                    onClick={() => openModal("managers")}
                                />
                            </div>
                        </div>
                    )}
                    {status === joined && (
                        <div className="flex justify-items-center py-2">
                            <PrimaryButton
                                className=" rounded-lg w-max text-brandGreen bg-darkGreenOpacity01"
                                label="Joined" //condicional rendering regarding status
                                icon={
                                    <CheckIcon
                                        color={tailwindConfig.theme.extend.colors.brandGreen}
                                        width={16}
                                        height={16}
                                    />
                                }
                                iconPosition={IconPosition.LEFT}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex px-8 gap-2 items-center">
                <div>
                    <UserIcon className="w-4" />
                </div>
                <div className="text-gray-500">Created by {communitiesDetail?.creatorAddress?.substring(0, 10)}...</div>
                <div className="text-gray-500">/</div>

                <div>
                    <UserIcon className="w-4" />
                </div>
                <div className="text-gray-500">{communitiesDetail?.totalMembers}</div>
                <div className="text-gray-500">partcipants</div>
                <div className="text-gray-500">/</div>

                <div>
                    <TagIcon className="w-4" />
                </div>
                <div className="text-gray-500">{communitiesDetail?.totalBadges}</div>
                <div className="text-gray-500">Badges</div>
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
                        <div className="p-6 border-whiteOpacity005 border-b">
                            <span className="text-base font-normal">
                                {`If you hide this community it won't be visible anymore.`}
                            </span>
                        </div>
                    </div>
                    <div className="bg-whiteOpacity008 pt-4 pr-6 pb-4 pl-6 w-[480px] h-[68px] flex justify-end gap-2">
                        <button className="text-sm text-center w-[153px] h-[36px] rounded-md bg-darkGreenOpacity01 text-brandGreen pr-2 pl-2">
                            No, keep visible
                        </button>
                        <button className="text-sm text-center w-[102px] h-[36px] rounded-md bg-othersRed text-brandBlack pr-2 pl-2">
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
                    <div className="bg-whiteOpacity008 flex items-center flex-col w-[580px] h-[428px]">
                        <div className="flex flex-col items-center w-[552px] h-[172px]">
                            <div className="w-[552px]">
                                <div className="flex gap-3 py-3">
                                    <input
                                        placeholder="Add managers by inserting the Stellar address"
                                        className="w-[440px] h-[36px] p-2 rounded-lg bg-whiteOpacity005"
                                        type="text"
                                    />
                                    <button className="flex items-center justify-center w-[100px] h-[36px] rounded-lg bg-brandGreen text-base text-brandBlack text-center">
                                        Invite
                                    </button>
                                </div>
                                <div className="w-full flex flex-col">
                                    <div className="w-full flex items-center border-b border-whiteOpacity005 border-opacity-10 py-3">
                                        <div className="w-full flex justify-between items-center gap-2">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-[35px] h-[35px] rounded-full p-2 bg-blue-500">
                                                    <StarIcon />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-normal">
                                                        winter_pudgy.eth
                                                    </span>
                                                    <span className="text-xs text-whiteOpacity05">
                                                        Manager
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => openModal("deleteBadge")}
                                                className="w-[15px] h-[15px] cursor-pointer"
                                            >
                                                <TrashIcon />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full flex items-center border-b border-whiteOpacity005 border-opacity-10 py-3">
                                        <div className="w-full flex justify-between items-center gap-2">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-[35px] h-[35px] rounded-full p-2 bg-blue-500">
                                                    <StarIcon />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-normal">
                                                        winter_pudgy.eth
                                                    </span>
                                                    <span className="text-xs text-whiteOpacity05">
                                                        Manager
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => openModal("deleteBadge")}
                                                className="w-[15px] h-[15px] cursor-pointer"
                                            >
                                                <TrashIcon />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full flex items-center border-b border-whiteOpacity005 border-opacity-10 py-3">
                                        <div className="w-full flex justify-between items-center gap-2">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-[35px] h-[35px] rounded-full p-2 bg-blue-500">
                                                    <StarIcon />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-normal">
                                                        winter_pudgy.eth
                                                    </span>
                                                    <span className="text-xs text-whiteOpacity05">
                                                        Manager
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => openModal("deleteBadge")}
                                                className="w-[15px] h-[15px] cursor-pointer"
                                            >
                                                <TrashIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </CustomModal>

            <CustomModal
                title="Delete badge?"
                isOpen={isOpen("deleteBadge")}
                onClose={() => closeModal("deleteBadge")}
                isAsync={false}
                headerBackgroundColor="bg-whiteOpacity008"
            >
                <>
                    <div className="bg-whiteOpacity008 w-[500px] h-[100px] p-6">
                        <span className="text-base font-normal">
                            If you delete this badge, it will no longer be valid as a score
                            for your community and may impact the reputation scores of your
                            community members.
                        </span>
                    </div>
                    <div className="bg-whiteOpacity008 pt-4 pr-6 pb-4 pl-6 flex justify-end gap-2">
                        <button className="text-sm text-center w-[153px] h-[36px] rounded-md bg-darkGreenOpacity01 text-brandGreen  ">
                            No, keep it
                        </button>
                        <button className="text-sm text-center w-[102px] h-[36px] rounded-md bg-othersRed text-brandBlack ">
                            Yes, delete
                        </button>
                    </div>
                </>
            </CustomModal>

            <div className="py-8">
                {status === all && (
                    <ContentTabs

                        tabs={{
                            Badges: {
                                content: (
                                    <div className="px-12">
                                        <CustomTable
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
                                        ></CustomTable>
                                    </div>
                                ),
                                tabNumber: 1,
                            },
                            Leaderboard: {
                                content: <LeaderboardTable communitiesMembersList={communitiesMembersList} />,
                                tabNumber: 2,
                            },
                        }}
                    ></ContentTabs>
                )}
                {status === created && (
                    <ContentTabs
                        tabs={{
                            Badges: {
                                content: (
                                    <div className="px-12">
                                        <CustomTable
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
                                        ></CustomTable>
                                    </div>
                                ),
                                tabNumber: 1,
                            },
                            Leaderboard: {
                                content: <LeaderboardTable communitiesMembersList={communitiesMembersList} />,
                                tabNumber: 2,
                            },
                        }}
                    ></ContentTabs>
                )}
                {status === joined && (
                    <ContentTabs
                        tabs={{
                            Badges: {
                                content: (
                                    <div className="px-12">
                                        <CustomTable
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
                                        ></CustomTable>
                                    </div>
                                ),
                                tabNumber: 1,
                            },
                            Leaderboard: {
                                content: <LeaderboardTable communitiesMembersList={communitiesMembersList} />,
                                tabNumber: 2,
                            },
                        }}
                    ></ContentTabs>
                )}
            </div>
        </div>
    );
}
