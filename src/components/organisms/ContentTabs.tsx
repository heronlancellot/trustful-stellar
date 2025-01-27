import { Tabs } from "@/components/organisms/types";
import cc from "classcat";
import React, { useState } from "react";
import { SearchIconPrimary } from "../atoms";


export interface ContentTabsProps extends React.ComponentPropsWithoutRef<"div"> {
  tabs: Tabs;
  inputText?: string;
  onButtonClick?: (value: string) => void;
  inputSearch?: Boolean;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({
  className,
  tabs,
  inputSearch,
  ...props
}) => {
  const [selectedTab, setSelectedTab] = useState(Object.keys(tabs)[0] ?? null);
  return (
    <div className={cc([className, "w-screen h-max bg-brandBlack"])} {...props}>
      <nav className="flex nav-bar px-12 justify-between cursor-pointer items-center">
        <div className="flex">
          {Object.entries(tabs)
            .sort(([_, a], [__, b]) => a.tabNumber - b.tabNumber)
            .map(([tabName, tabProps]) => {
              return (
                <div
                  key={tabName}
                  className={cc([
                    { "tab-active": tabName == selectedTab },
                    "tab p-2 px-4"
                  ])}
                  onClick={() => setSelectedTab(tabName)}
                >
                  {tabProps.trigger ? tabProps.trigger : <span>{tabName}</span>}
                </div>
              );
            })}
        </div>
        <div>
          {inputSearch && (
            <SearchIconPrimary />
          )}

        </div>
      </nav>
      <div className="w-full pt-8">
        {Object.entries(tabs).map(([tabName, tabProps]) => {
          return (
            <div key={tabName} className={cc({ hidden: selectedTab !== tabName })}>
              {tabProps.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
