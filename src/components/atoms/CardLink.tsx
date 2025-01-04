import cc from "classcat";
import { ReactNode } from "react";

interface CardLinkProps extends React.ComponentPropsWithoutRef<"div"> {
  mainIcon: ReactNode;
  actionIcon: ReactNode;
  title: string;
}

export const CardLink: React.FC<CardLinkProps> = ({
  children,
  mainIcon,
  actionIcon,
  title,
  className,
  ...props
}) => {
  return (
    <div
      className={cc(["flex min-w-[572px] min-h-[232px] card-link", className])}
      {...props}
    >
      <div className="flex-1 card-link-main-card">
        <div className="flex-col w-full h-full py-8 px-8">
          <div className="card-link-main-icon w-20 h-20">{mainIcon}</div>
          <div className="w-max-content h-[26px] mt-[62px]">
            <span className="text-2xl card-link-title">{title}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="card-link-notched-corner"></div>
        <div className="card-link-action-icon-container">
          <div className="w-6 h-6">{actionIcon}</div>
        </div>
      </div>
    </div>
  );
};
