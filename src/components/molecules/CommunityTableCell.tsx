import tailwindConfig from "tailwind.config";
import { getEllipsedAddress } from "@/lib/utils/getEllipsedAddress";
import { UserIcon } from "@/components";

interface CommunityTableCellProps
  extends React.ComponentPropsWithoutRef<"div"> {
  issuerAddress: string;
}

export const CommunityTableCell = ({
  issuerAddress,
}: CommunityTableCellProps) => {
  const isStatus = issuerAddress === "Pending" || issuerAddress === "Completed";

  return (
    <div className="flex h-7 flex-row items-center">
      {isStatus ? (
        <div
          className={`rounded-full px-4 py-1 text-center text-sm font-medium ${issuerAddress === "Pending" ? "bg-[rgba(245,255,255,0.08)] text-whiteOpacity05" : "bg-darkGreenOpacity01 text-brandGreen"} `}
        >
          {issuerAddress}
        </div>
      ) : (
        <div>{issuerAddress}</div>
      )}
    </div>
  );
};
