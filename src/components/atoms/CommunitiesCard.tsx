import cc from "classcat";
import React from "react";
import { Communities } from "@/types/communities";
import { InformationIcon, PlusIcon, StarIcon, TagIcon, UserIcon } from "./icons";
import { mainTestnet } from "@/testCall";

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
                "group rounded-lg flex flex-col border border-whiteOpacity008 max-w-sm w-[376px] h-[212px] bg-whiteOpacity005 hover:bg-whiteOpacity008 hover:cursor-pointer transition-colors duration-300 ease-linear",
                className
            ])}
            {...props}
            style={{ boxSizing: 'border-box' }}
        >
            <div className="flex  justify-between items-center p-3">
                <div className="w-[38px] h-[38px] p-2 rounded-full bg-whiteOpacity008 flex items-center justify-center overflow-hidden">
                    <div className="w-4 h-4 ">
                        <StarIcon />
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div>
                        <button className="overflow-hidden w-8 h-8 group-hover:w-16 bg-whiteOpacity005 bg-opacity-25 text-lime-400 flex items-center justify-center gap-2 group-hover:justify-start px-3 rounded-md hover:bg-whiteOpacity008 transition-all duration-300 ease-in-out">
                            <div className="flex justify-center items-center">
                                <InformationIcon className="transition-all duration-500 ease-in-out" />
                                <span className="hidden font-inter text-sm group-hover:inline-block ml-2  group-hover:opacity-100 transition-all duration-500 ease-in-out">
                                    Info
                                </span>
                            </div>

                        </button>
                    </div>

                    <div >
                        <button className="overflow-hidden w-8 h-8 group-hover:w-16 bg-whiteOpacity005 bg-opacity-25 text-lime-400 flex items-center justify-center group-hover:justify-start px-2 rounded-md hover:bg-whiteOpacity008 transition-all duration-300 ease-in-out">
                            <div className="flex justify-center items-center">
                                <PlusIcon className="transition-all duration-500 ease-in-out" />
                                <span className="hidden font-inter text-sm group-hover:inline-block ml-2 group-hover:opacity-100 transition-all duration-500 ease-in-out" onClick={mainTestnet}>
                                    Join
                                </span>
                            </div>

                        </button>
                    </div>
                </div>

            </div>
            <div className="flex flex-col p-3 gap-1 justify-center" >
                <div className="title" >
                    <span className="text-lg font-inter font-medium border-s-violet-600">{community?.name}</span>
                </div>
                <div className="description">
                    <span className="font-inter font-normal text-sm block overflow-hidden text-ellipsis text-whiteOpacity05">
                        {community?.description}
                    </span>

                </div>


                <div className="flex flex-start mt-10 gap-3">
                    <div className="flex items-center text-xs justify-center gap-1">
                        <div className="w-3 h-3">
                            <UserIcon />
                        </div>
                        <div className="flex justify-center">
                            <span>{community?.totalMembers}</span>
                        </div>
                    </div>

                    <div className="flex items-center text-xs justify-center gap-2">
                        <div className=" w-3 h-3">
                            <TagIcon />
                        </div>
                        <div className="flex justify-center">
                            <span>{community?.totalBadges}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};