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
    <div className="flex h-[100px] w-full min-w-[500px] flex-row justify-between rounded-md border border-whiteOpacity008 bg-whiteOpacity008">
      <div className="flex min-w-[300px] flex-1 flex-row items-center p-[26px]">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-md bg-whiteOpacity008">
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
        <div className="flex flex-col pl-4 text-left">
          <div className="flex flex-row items-center gap-2">
            <span className="text-lg font-medium text-brandWhite">
              {userAddress
                ? getEllipsedAddress(userAddress)
                : "No user selected"}
            </span>
            {userAddress && (
              <div
                className="h-3 w-3 items-center justify-center hover:cursor-pointer"
                onClick={() => {
                  if (!navigator.clipboard) {
                    toast.error(
                      "Copy to clipboard not allowed by the navigator",
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
              <span className="text-sm font-normal text-whiteOpacity05">
                {userBadgesQuantity > 1
                  ? `${userBadgesQuantity} badges`
                  : `${userBadgesQuantity || "0"} badge`}
              </span>
            ) : (
              <></>
            )}
            {userScore !== undefined ? (
              <span className="text-sm font-normal text-whiteOpacity05">
                {userScore} points
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="flex h-full w-max min-w-[200px] flex-row items-center pr-[26px]">
        <div className="h-10 w-max pr-2">
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
        <div className="h-max w-full min-w-[200px]">{searchBar}</div>
      </div>
    </div>
  );
};
