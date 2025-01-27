import { ContentTabs, PlusIcon, PrimaryButton, TagIcon, UserIcon } from "@/components";
import { SearchIcon } from "@/components/atoms/icons/SearchIcon";
import { TableEmptyScreen } from "@/components/atoms/TableEmptyScreen";
import { CustomTable } from "@/components/organisms/CustomTable";
import { IconPosition } from "@/types/iconPosition";
import tailwindConfig from "tailwind.config";



export default function DetailsLayout() {

    const searchedUserBadges = [{
        score: 6,
        description: ''
    }]
    return (
        <div className="flex flex-col w-full h-[calc(100vh-74px)] bg-brandBlack">
            <div className="flex justify-between p-8">
                <div>
                    <h1 className="text-2xl">Stellar Quests</h1>
                    <h3 className="text-gray-500">Integer malesuada leo nisi, quis ullamcorper mauris elementum ut. Suspendisse eget libero iaculis, maximus velit vitae.</h3>
                </div>
                <div>
                    <div className="flex justify-items-center py-2">
                        <PrimaryButton
                            className="rounded-lg w-max"
                            label="Create"
                            icon={<PlusIcon color="black" width={16} height={16} />}
                            iconPosition={IconPosition.LEFT}
                        />
                    </div>
                </div>
            </div>
            <div className="flex px-8 gap-2 items-center">
                <div><UserIcon className="w-4" /></div>
                <div className="text-gray-500">Created by 0xE1C...2C5</div>
                <div className="text-gray-500">/</div>

                <div><UserIcon className="w-4" /></div>
                <div className="text-gray-500">150</div>
                <div className="text-gray-500">partcipants</div>
                <div className="text-gray-500" >/</div>

                <div><TagIcon className="w-4" /></div>
                <div className="text-gray-500">20</div>
                <div className="text-gray-500">Badges</div>
            </div>

            <div className="py-8">
                <ContentTabs tabs={{
                    Badges: {
                        content: (
                            <div className="px-12">
                                <CustomTable
                                    childrenForEmptyTable={
                                        <TableEmptyScreen
                                            icon={
                                                <SearchIcon
                                                    color={tailwindConfig.theme.extend.colors.whiteOpacity05}
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
                        ), tabNumber: 1
                    },
                    Leadboard: {
                        content: (
                            <div className="px-12">
                                <CustomTable
                                    childrenForEmptyTable={
                                        <TableEmptyScreen
                                            icon={
                                                <SearchIcon
                                                    color={tailwindConfig.theme.extend.colors.whiteOpacity05}
                                                />
                                            }
                                            title="Search to start"
                                            description="Check a user's reputation by searching for their address"
                                        />
                                    }
                                    className="mt-6"
                                    headers={["Rank", "Address", "Points", "Badges"]}
                                    data={searchedUserBadges}
                                ></CustomTable>
                            </div>

                        ), tabNumber: 2
                    }
                }}>

                </ContentTabs>
            </div>
        </div>

    )
}

