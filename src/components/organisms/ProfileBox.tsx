import { ReactNode } from "react";
import {
  IconicButton,
  UserIcon,
  RotateLeftIcon,
  CopyAndPasteButton,
} from "@/components/atoms";
import { getEllipsedAddress } from "@/lib/utils/getEllipsedAddress";

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
    <div className="flex h-auto min-h-[100px] w-full min-w-[320px] flex-col justify-between rounded-md border border-whiteOpacity008 bg-whiteOpacity008 md:h-[100px] md:min-w-[500px] md:flex-row">
      <div className="flex min-w-0 flex-1 flex-row items-center p-4 md:min-w-[300px] md:p-[26px]">
        <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-md bg-whiteOpacity008">
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
        <div className="flex min-w-0 flex-1 flex-col pl-4 text-left">
          <div className="flex flex-row items-center gap-2">
            <span className="truncate text-lg font-medium text-brandWhite">
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
      <div className="flex h-auto w-full flex-row items-center justify-between gap-2 p-4 md:h-full md:w-max md:min-w-[200px] md:justify-end md:pr-[26px]">
        <div className="h-10 w-max">
          {isClearButtonVisible && (
            <IconicButton
              className="bg-darkGreenOpacity01 text-brandGreen"
              onClick={onClear}
              label="Clear"
              icon={<RotateLeftIcon color="rgba(177, 239, 66, 1)" />}
            />
          )}
        </div>
        <div className="h-max w-full min-w-0 md:min-w-[200px]">{searchBar}</div>
      </div>
    </div>
  );
};
