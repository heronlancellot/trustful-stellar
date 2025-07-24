import { SVGProps } from "react";
import cc from "classcat";
import { CheckIcon } from "./icons/CheckIcon";
import { ArrowIcon } from "./icons/ArrowIcon";
import React from "react";
import tailwindConfig from "tailwind.config";

interface AttestationBadgeProps extends React.ComponentPropsWithoutRef<"div"> {
  title: string;
  imported: boolean | undefined;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const AttestationBadge: React.FC<AttestationBadgeProps> = ({
  title,
  className,
  imported,
  icon,
  ...props
}) => {
  const Icon = icon;
  return (
    <div
      className="flex h-[25vh] w-[21vw] rounded-lg border border-whiteOpacity008 bg-whiteOpacity005 hover:cursor-pointer"
      {...props}
    >
      <div className="flex max-w-[50%] flex-1 flex-col justify-between p-3">
        <div className="w-max flex-1 p-2">
          <div className="h-[38px] w-[38px] rounded-full bg-whiteOpacity008 p-2">
            <Icon
              color={
                imported
                  ? tailwindConfig.theme.extend.colors.brandGreen
                  : tailwindConfig.theme.extend.colors.whiteOpacity05
              }
            />
          </div>
        </div>
        <div className={"title mt-3 h-max w-max justify-center p-2"}>
          <span>{title}</span>
        </div>
      </div>
      <div className="align-center flex max-w-[50%] flex-1 flex-col">
        <div className="m-4 ml-6 h-[25px] flex-1">
          <div
            className={cc([
              { hidden: !imported },
              "flex justify-end text-xs font-medium",
            ])}
          >
            <div className="mr-2 w-3">
              <CheckIcon />
            </div>
            <span className="text-brandGreen">IMPORTED</span>
          </div>
          <div
            className={cc([
              { hidden: imported === true || imported === undefined },
              "flex justify-end text-xs font-medium",
            ])}
          >
            <div className="mr-2 w-3">
              <ArrowIcon
                color={tailwindConfig.theme.extend.colors.whiteOpacity05}
              />
            </div>
            <span className="text-whiteOpacity05">IMPORT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
