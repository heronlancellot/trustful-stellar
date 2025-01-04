import { ReactNode } from "react";
import { AttestationSymbol } from "../atoms/AttestationSymbol";
import PerfectScrollbar from "react-perfect-scrollbar";
import cc from "classcat";
import { Tooltip } from "react-tooltip";
import { QuestCircleIcon } from "../atoms/icons/QuestionCircleIcon";
import tailwindConfig from "tailwind.config";

interface ImportBadgesModalContentProps {
  badges: {
    title: string;
    description: string;
    isImported: boolean | undefined;
    assetCode: string;
    score: number;
  }[];
  title: string;
  icon?: ReactNode;
}

export const ImportBadgesModalContent = ({
  badges,
  title,
  icon,
}: ImportBadgesModalContentProps) => {
  return (
    <div className="p-2 w-full h-full items-center justify-center flex flex-col">
      {title && (
        <div className="w-full h-full min-h-[20px] items-center justify-center flex py-6">
          {icon && <div className="h-[30px] w-[30px] mx-4">{icon}</div>}
          {<h2 className="text-xl">Stellar Quest</h2>}
        </div>
      )}
      {badges.length > 0 && (
        <div className="w-full h-full min-h-[20px] rounded-lg border border-whiteOpacity008 py-2 flex flex-col">
          <div className="px-4">
            <span className="text-xs text-whiteOpacity05 tracking-wider">
              BADGES AVAILABLE
            </span>
          </div>
          <PerfectScrollbar className="w-full max-h-[300px]">
            {badges.map(({ title, description, isImported, score }, index) => (
              <div key={index}>
                <hr className="border-whiteOpacity008 w-full px-0 mx-0 mt-2 mb-3" />
                <div className="px-4 flex">
                  <div className="flex-1 flex flex-col">
                    <span
                      className={cc([
                        { "text-whiteOpacity05": isImported === undefined },
                        "text-sm flex",
                      ])}
                    >
                      {title}{" "}
                      <div
                        className={cc(["m-1 ml-2 w-3 h-3", { hidden: !description }])}
                      >
                        <a
                          data-tooltip-id="badge-description-tooltip"
                          data-tooltip-content={description}
                        >
                          <QuestCircleIcon
                            color={
                              tailwindConfig.theme.extend.colors.whiteOpacity05
                            }
                            className="w-full h-full"
                          ></QuestCircleIcon>
                        </a>
                      </div>
                    </span>
                    <span className="text-sm text-whiteOpacity05">
                      Points: {score}
                    </span>
                  </div>
                  {isImported !== undefined && (
                    <div>
                      <AttestationSymbol
                        checked={isImported}
                      ></AttestationSymbol>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </PerfectScrollbar>
          <Tooltip id="badge-description-tooltip" />
        </div>
      )}
    </div>
  );
};
