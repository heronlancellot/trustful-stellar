import cc from "classcat";
import { ComponentPropsWithoutRef, ReactNode } from "react";

interface CardLinkProps extends ComponentPropsWithoutRef<"div"> {
  mainIcon: ReactNode;
  actionIcon: ReactNode;
  title: string;
}

export const CardLink = ({
  children,
  mainIcon,
  actionIcon,
  title,
  className,
  ...props
}: CardLinkProps) => {
  return (
    <div
      className={cc([
        "card-link flex min-w-[300px] cursor-pointer sm:min-h-[232px] sm:min-w-[572px]",
        className,
      ])}
      {...props}
    >
      <div className="card-link-main-card flex-1">
        <div className="h-full w-full flex-col px-8 py-8">
          <div className="card-link-main-icon h-20 w-20">{mainIcon}</div>
          <div className="w-max-content mt-[62px] h-[26px]">
            <span className="card-link-title text-2xl">{title}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="card-link-notched-corner"></div>
        <div className="card-link-action-icon-container">
          <div className="size-6">{actionIcon}</div>
        </div>
      </div>
    </div>
  );
};
