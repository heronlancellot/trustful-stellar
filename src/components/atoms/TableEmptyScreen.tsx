import tailwindConfig from "tailwind.config";
import { SearchIcon } from "./icons/SearchIcon";
import { ReactNode } from "react";

interface TableEmptyScreenProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: ReactNode;
  title: string;
  description: string;
}

export const TableEmptyScreen = ({
  icon,
  title,
  description,
}: TableEmptyScreenProps) => {
  return (
    <div className="h-full w-full min-h-[200px] flex items-center justify-center">
      <div className="w-max h-max flex flex-col items-center justify-center">
        <div className="rounded-full bg-whiteOpacity008 h-20 w-20 items-center justify-center flex">
          <div className="w-7 h-7">{icon}</div>
        </div>
        <div className="w-full items-center justify-center text-center pt-4">
          <span>{title}</span>
        </div>
        <div className="w-full items-center justify-center text-center">
          <span className="text-whiteOpacity05 text-sm font-light">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
};
