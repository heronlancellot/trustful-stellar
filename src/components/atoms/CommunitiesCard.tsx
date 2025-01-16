import { SVGProps } from "react";
import cc from "classcat";
import { CheckIcon } from "./icons/CheckIcon";
import { ArrowIcon } from "./icons/ArrowIcon";
import React from "react";
import tailwindConfig from "tailwind.config";

interface CommunitiesCardProps extends React.ComponentPropsWithoutRef<"div"> {
    title: string;
}

export const CommunitiesCard: React.FC<CommunitiesCardProps> = ({
    title,
    className,
    ...props
}) => {
    return (
        <div
            className="rounded-lg flex border border-whiteOpacity008 w-[21vw] h-[25vh] bg-whiteOpacity005 hover:cursor-pointer"
            {...props}
        >
            <div className="flex flex-1 max-w-[50%] flex-col p-3 justify-between">
                <div className="flex-1 p-2 w-max">
                    <div className="w-[38px] h-[38px] p-2 rounded-full bg-whiteOpacity008">
                        <h1>icon</h1>
                    </div>
                </div>
                <div className={"title p-2 mt-3 h-max justify-center w-max"}>
                    {/* <span>{title}</span> */}
                    <span>{'Title'}</span>
                </div>
            </div>
            <div className="flex flex-1 max-w-[50%] flex-col align-center">
                <div className="flex-1 m-4 ml-6 h-[25px]">
                    <div
                        className={cc([

                            "flex text-xs font-medium justify-end",
                        ])}
                    >
                        <div className="w-3 mr-2">
                            <CheckIcon />
                        </div>
                        <span className="text-brandGreen">IMPORTED</span>
                    </div>
                    <div
                        className={cc([
                            "flex text-xs font-medium justify-end",
                        ])}
                    >
                        <div className="w-3 mr-2">
                            <ArrowIcon
                                color={tailwindConfig.theme.extend.colors.whiteOpacity05}
                            />
                        </div>
                        <span className="text-whiteOpacity05">IMPORT</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
