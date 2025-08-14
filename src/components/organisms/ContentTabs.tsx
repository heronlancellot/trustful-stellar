"use client";

import cc from "classcat";
import { ComponentPropsWithoutRef, ReactNode, useState } from "react";
import { SearchBar } from "../search/SearchBar";
import { useCommunityContext } from "../community/Context";

export interface TabProps {
  content: ReactNode;
  tabNumber: number;
  trigger?: ReactNode;
  disabled?: boolean;
}

export interface ContentTabsProps extends ComponentPropsWithoutRef<"div"> {
  tabs: Record<string, TabProps>;
  onButtonClick?: (tabName: string) => void;
  inputText?: string;
  setInputText?: (text: string) => void;
  inputSearch?: boolean;
}

export const ContentTabs = ({
  className,
  tabs,
  inputSearch,
  inputText = "",
  setInputText,
  onButtonClick,
  ...props
}: ContentTabsProps) => {
  const [selectedTab, setSelectedTab] = useState(Object.keys(tabs)[0] ?? null);

  const { getCommunitiesDetails } = useCommunityContext();

  const onSearch = async () => {
    await getCommunitiesDetails(inputText);
  };

  return (
    <div className={cc([className, "h-max w-full bg-brandBlack"])} {...props}>
      <nav className="nav-bar flex flex-col items-center justify-between sm:flex-row sm:px-12">
        <div className="flex">
          {Object.entries(tabs)
            .sort(([_, a], [__, b]) => a.tabNumber - b.tabNumber)
            .map(([tabName, tabProps]) => {
              return (
                <div
                  key={tabName}
                  className={cc([
                    { "tab-active": tabName == selectedTab },
                    { "cursor-not-allowed opacity-50": tabProps.disabled },
                    "tab cursor-pointer p-2 px-4",
                  ])}
                  onClick={() => {
                    if (!tabProps.disabled) {
                      setSelectedTab(tabName);
                      onButtonClick?.(tabName.toLowerCase());
                    }
                  }}
                >
                  {tabProps.trigger ? tabProps.trigger : <span>{tabName}</span>}
                </div>
              );
            })}
        </div>
        <div className="flex py-4">
          {inputSearch && setInputText && (
            <SearchBar
              placeholder={"Paste the address..."}
              onButtonClick={onSearch}
              inputText={inputText}
              onChangeInputText={setInputText}
            />
          )}
        </div>
      </nav>
      <div className="w-full pt-8">
        {Object.entries(tabs).map(([tabName, tabProps]) => {
          return (
            <div
              key={tabName}
              className={cc({ hidden: selectedTab !== tabName })}
            >
              {tabProps.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
