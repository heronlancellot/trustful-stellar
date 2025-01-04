import cc from "classcat";
import { ReactNode } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { QuestCircleIcon } from "../atoms/icons/QuestionCircleIcon";
import tailwindConfig from "tailwind.config";
import React from "react";
import { Tooltip } from "react-tooltip";

interface PageTemplateProps extends React.ComponentPropsWithoutRef<"div"> {
  className: string;
  title: string;
  children: ReactNode;
  tooltip?: { tooltipId: string; tooltipText: string };
}

export const PageTemplate = ({
  className,
  title,
  children,
  tooltip,
}: PageTemplateProps) => {
  return (
    <div
      className={cc([
        className,
        "flex flex-col w-full h-[calc(100vh-74px)] bg-brandBlack",
      ])}
    >
      <PerfectScrollbar className="h-full flex flex-col">
        <div className="text-left text-[26px] pl-12 pt-8 pb-6 flex">
          <h1 className="font-space-grotesk">{title}</h1>{" "}
          {!!tooltip ? (
            <div className={cc(["m-2.5 ml-4 w-5 h-5"])}>
              <a
                data-tooltip-id={tooltip.tooltipId}
                data-tooltip-content={tooltip.tooltipText}
              >
                <QuestCircleIcon
                  color={tailwindConfig.theme.extend.colors.whiteOpacity05}
                  className="w-full h-full"
                ></QuestCircleIcon>
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="flex">{children}</div>
      </PerfectScrollbar>
      {!!tooltip ? <Tooltip id={tooltip?.tooltipId} /> : <></>}
    </div>
  );
};
