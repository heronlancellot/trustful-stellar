import cc from "classcat";
import React from "react";
import { Communities } from "@/types/communities";
import { InformationIcon, PlusIcon, StarIcon, TagIcon, UserIcon } from "./icons";

interface CommunitiesCardProps extends React.ComponentPropsWithoutRef<"div"> {
    community: Communities;
}

export const CommunitiesCard: React.FC<CommunitiesCardProps> = ({
    community,
    className,
    ...props
}) => {
    return (
        <div
            className={cc([
                "rounded-lg flex flex-col border border-whiteOpacity008 max-w-sm w-full bg-whiteOpacity005 hover:cursor-pointer",
                className
            ])}
            {...props}
            style={{ boxSizing: 'border-box' }}
        >
            <div className="flex justify-between p-3">
                <div className="w-[38px] h-[38px] p-2 rounded-full bg-whiteOpacity008 flex items-center justify-center overflow-hidden">
                    <div className="w-4 h-4 ">
                        <StarIcon />
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="w-8 h-8 bg-whiteOpacity005 bg-opacity-25 text-lime-400 flex items-center justify-center rounded-md"><InformationIcon /></button>
                    <button className="w-8 h-8 bg-whiteOpacity005 bg-opacity-25 text-lime-400 flex items-center justify-center rounded-md"><PlusIcon /></button>
                </div>
            </div>
            <div className="flex flex-col p-3 gap-1 justify-center" >
                <div className="title" >
                    <span className="text-lg font-bold border-s-violet-600">{community?.name}</span>
                </div>
                <div className="description">
                    <span className="text-xs block overflow-hidden text-ellipsis text-gray-500">
                        {community?.description}
                    </span>

                </div>


                <div className="flex flex-start mt-7 gap-3">
                    <div className="flex items-center text-xs justify-center gap-1">
                        <div className="w-3 h-3">
                            <UserIcon />
                        </div>
                        <div className="flex justify-center">
                            <span>{community?.totalMembers}</span>
                        </div>
                    </div>

                    <div className="flex items-center text-xs justify-center gap-1 ">
                        <div className=" w-3 h-3">
                            <TagIcon />
                        </div>
                        <div>
                            <span>{community?.totalBadges}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};