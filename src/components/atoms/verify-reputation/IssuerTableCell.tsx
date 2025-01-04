import tailwindConfig from "tailwind.config";
import { UserIcon } from "../icons";
import { getEllipsedAddress } from "@/lib/utils/getEllipsedAddress";

interface IssuerTableCellProps extends React.ComponentPropsWithoutRef<"div"> {
  issuerAddress: string;
}

export const IssuerTableCell = ({ issuerAddress }: IssuerTableCellProps) => {
  return (
    <div className="flex flex-row items-center h-7">
      <div className="w-7 h-7 mr-4 rounded-md bg-whiteOpacity008 flex items-center justify-center">
        <div className="w-3 h-3">
          <UserIcon
            color={tailwindConfig.theme.extend.colors.brandGreen}
          ></UserIcon>
        </div>
      </div>
      <div>{getEllipsedAddress(issuerAddress)}</div>
    </div>
  );
};
