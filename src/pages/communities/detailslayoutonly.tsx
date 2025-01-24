import { PlusIcon, PrimaryButton, TagIcon, UserIcon } from "@/components";
import { IconPosition } from "@/types/iconPosition";


export default function DetailsLayout() {
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
        </div>

    )
}

