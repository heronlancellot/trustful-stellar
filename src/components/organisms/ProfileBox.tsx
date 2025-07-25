import { ReactNode } from "react";
import { IconicButton, UserIcon } from "../atoms";
import { RotateLeftIcon } from "../atoms/icons/RotateLeftIcon";
import { getEllipsedAddress } from "@/lib/utils/getEllipsedAddress";
import { CopyAndPasteButton } from "../atoms/CopyAndPasteButton";

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
  // console.log("userAddress2", userAddress);
  return (
    <div className="flex h-[100px] w-full min-w-[500px] flex-row justify-between rounded-md border border-whiteOpacity008 bg-whiteOpacity008">
      <div className="flex min-w-[300px] flex-1 flex-row items-center p-[26px]">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-md bg-whiteOpacity008">
          <div className="h-6 w-6">
            <UserIcon
              color={
                !userAddress
                  ? "rgba(245, 255, 255, 0.5)"
                  : "rgba(177, 239, 66, 1)"
              }
            />
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
              <CopyAndPasteButton
                textToCopy={userAddress}
                size="sm"
                className="flex-shrink-0"
              />
            )}
          </div>
          <div className="flex flex-row gap-4">
            {userBadgesQuantity !== undefined ? (
              <span className="text-sm font-normal text-whiteOpacity05">
                {userBadgesQuantity > 1
                  ? `${userBadgesQuantity} badges`
                  : `${userBadgesQuantity || "0"} badge`}
              </span>
            ) : null}
            {userScore !== undefined ? (
              <span className="text-sm font-normal text-whiteOpacity05">
                {userScore} points
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex h-full w-max min-w-[200px] flex-row items-center pr-[26px]">
        <div className="h-10 w-max pr-2">
          {isClearButtonVisible && (
            <IconicButton
              className="bg-darkGreenOpacity01 text-brandGreen"
              onClick={onClear}
              label="Clear"
              icon={<RotateLeftIcon color="rgba(177, 239, 66, 1)" />}
            />
          )}
        </div>
        <div className="h-max w-full min-w-[200px]">{searchBar}</div>
      </div>
    </div>
  );
};
