import React, { ReactNode, useState } from "react";
import { IconicButton, UserIcon } from "../atoms";
import tailwindConfig from "tailwind.config";
import { RotateLeftIcon } from "../atoms/icons/RotateLeftIcon";
import { getEllipsedAddress } from "@/lib/utils/getEllipsedAddress";
import { CopyIcon } from "../atoms/icons/CopyIcon";
import toast from "react-hot-toast";

interface ProfileBoxProps extends React.ComponentPropsWithoutRef<"div"> {
  userAddress?: string;
  userBadgesQuantity?: number;
  userScore?: number;
  onClear: () => void;
  isClearButtonVisible: boolean;
  searchBar: ReactNode;
}

export const ProfileBox = ({
  userAddress,
  userBadgesQuantity,
  userScore,
  onClear,
  isClearButtonVisible,
  searchBar,
}: ProfileBoxProps) => {
  return (
    <div className="flex flex-row w-full min-w-[500px] h-[100px] bg-whiteOpacity008 rounded-md border border-whiteOpacity008 justify-between">
      <div className="flex flex-row flex-1 min-w-[300px] p-[26px] items-center">
        <div className="h-[52px] w-[52px] flex rounded-md bg-whiteOpacity008 items-center justify-center">
          <div className="h-6 w-6">
            <UserIcon
              color={
                !userAddress
                  ? tailwindConfig.theme.extend.colors.whiteOpacity05
                  : tailwindConfig.theme.extend.colors.brandGreen
              }
            ></UserIcon>
          </div>
        </div>
        <div className="flex flex-col text-left pl-4">
          <div className="flex flex-row gap-2 items-center">
            <span className="text-brandWhite text-lg font-medium">
              {userAddress
                ? getEllipsedAddress(userAddress)
                : "No user selected"}
            </span>
            {userAddress && (
              <div
                className="w-3 h-3 hover:cursor-pointer items-center justify-center"
                onClick={() => {
                  if (!navigator.clipboard) {
                    toast.error(
                      "Copy to clipboard not allowed by the navigator"
                    );
                  } else {
                    navigator.clipboard.writeText(userAddress || "");
                    toast.success("User Address copied to the clipboard");
                  }
                }}
              >
                <CopyIcon />
              </div>
            )}
          </div>
          <div className="flex flex-row gap-4">
            {userBadgesQuantity !== undefined ? (
              <span className="text-whiteOpacity05 text-sm font-normal">
                {userBadgesQuantity > 1
                  ? `${userBadgesQuantity} badges`
                  : `${userBadgesQuantity || "0"} badge`}
              </span>
            ) : (
              <></>
            )}
            {userScore !== undefined ? (
              <span className="text-whiteOpacity05 text-sm font-normal">
                {userScore} points
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="w-max min-w-[200px] flex flex-row h-full items-center pr-[26px]">
        <div className="w-max h-10 pr-2">
          {isClearButtonVisible && (
            <IconicButton
              className="bg-darkGreenOpacity01 text-brandGreen"
              onClick={onClear}
              label={"Clear"}
              icon={
                <RotateLeftIcon
                  color={tailwindConfig.theme.extend.colors.brandGreen}
                />
              }
            />
          )}
        </div>
        <div className="min-w-[200px] w-full h-max">{searchBar}</div>
      </div>
    </div>
  );
};
