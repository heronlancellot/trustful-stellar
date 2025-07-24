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
    <div className="flex h-full w-full flex-col items-center justify-center p-2">
      {title && (
        <div className="flex h-full min-h-[20px] w-full items-center justify-center py-6">
          {icon && <div className="mx-4 h-[30px] w-[30px]">{icon}</div>}
          {<h2 className="text-xl">Stellar Quest</h2>}
        </div>
      )}
      {badges.length > 0 && (
        <div className="flex h-full min-h-[20px] w-full flex-col rounded-lg border border-whiteOpacity008 py-2">
          <div className="px-4">
            <span className="text-xs tracking-wider text-whiteOpacity05">
              BADGES AVAILABLE
            </span>
          </div>
          <PerfectScrollbar className="max-h-[300px] w-full">
            {badges.map(({ title, description, isImported, score }, index) => (
              <div key={index}>
                <hr className="mx-0 mb-3 mt-2 w-full border-whiteOpacity008 px-0" />
                <div className="flex px-4">
                  <div className="flex flex-1 flex-col">
                    <span
                      className={cc([
                        { "text-whiteOpacity05": isImported === undefined },
                        "flex text-sm",
                      ])}
                    >
                      {title}{" "}
                      <div
                        className={cc([
                          "m-1 ml-2 h-3 w-3",
                          { hidden: !description },
                        ])}
                      >
                        <a
                          data-tooltip-id="badge-description-tooltip"
                          data-tooltip-content={description}
                        >
                          <QuestCircleIcon
                            color={
                              tailwindConfig.theme.extend.colors.whiteOpacity05
                            }
                            className="h-full w-full"
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
