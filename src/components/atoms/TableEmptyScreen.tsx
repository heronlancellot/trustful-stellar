import { ComponentPropsWithoutRef, ReactNode } from "react";

interface TableEmptyScreenProps extends ComponentPropsWithoutRef<"div"> {
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
        <div className="flex size-20 items-center justify-center rounded-full bg-whiteOpacity008">
          <div className="size-7">{icon}</div>
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
