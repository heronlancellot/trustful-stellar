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
    <div className="flex h-full min-h-[200px] w-full items-center justify-center">
      <div className="flex h-max w-max flex-col items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-whiteOpacity008">
          <div className="h-7 w-7">{icon}</div>
        </div>
        <div className="w-full items-center justify-center pt-4 text-center">
          <span>{title}</span>
        </div>
        <div className="w-full items-center justify-center text-center">
          <span className="text-sm font-light text-whiteOpacity05">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
};
