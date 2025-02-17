import tailwindConfig from "tailwind.config";
import { getEllipsedAddress } from "@/lib/utils/getEllipsedAddress";
import { UserIcon } from "@/components";

interface CommunityTableCellProps extends React.ComponentPropsWithoutRef<"div"> {
    issuerAddress: string;
}

export const CommunityTableCell = ({ issuerAddress }: CommunityTableCellProps) => {
    return (
        <div className="flex flex-row items-center h-7">
            <div>{issuerAddress}</div>
        </div>
    );
};
