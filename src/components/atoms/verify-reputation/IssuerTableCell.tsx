import tailwindConfig from "tailwind.config";
import { UserIcon } from "../icons";
import { getEllipsedAddress } from "@/lib/utils/getEllipsedAddress";

interface IssuerTableCellProps extends React.ComponentPropsWithoutRef<"div"> {
  issuerAddress: string;
}

export const IssuerTableCell = ({ issuerAddress }: IssuerTableCellProps) => {
  return (
    <div className="flex h-7 flex-row items-center">
      <div className="mr-4 flex h-7 w-7 items-center justify-center rounded-md bg-whiteOpacity008">
        <div className="h-3 w-3">
          <UserIcon
            color={tailwindConfig.theme.extend.colors.brandGreen}
          ></UserIcon>
        </div>
      </div>
      <div>{getEllipsedAddress(issuerAddress)}</div>
    </div>
  );
};
