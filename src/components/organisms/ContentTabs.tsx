'use client';

import { Tabs } from '@/components/organisms/types';
import cc from 'classcat';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { SearchIconPrimary } from '../atoms';
import { SearchBar } from '../search/SearchBar';
import useCommunitiesController from '../community/hooks/controller';
import { useCommunityContext } from '../community/Context';

export interface TabProps {
  content: React.ReactNode;
  tabNumber: number;
  trigger?: React.ReactNode;
  disabled?: boolean;
}

export interface ContentTabsProps
  extends React.ComponentPropsWithoutRef<'div'> {
  tabs: Record<string, TabProps>;
  onButtonClick?: (tabName: string) => void;
  inputText?: string;
  setInputText?: (text: string) => void;
  inputSearch?: boolean;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({
  className,
  tabs,
  inputSearch,
  inputText = '',
  setInputText,
  onButtonClick,
  ...props
}) => {
  const [selectedTab, setSelectedTab] = useState(Object.keys(tabs)[0] ?? null);

  const { getCommunitiesDetails } = useCommunityContext();

  const onSearch = async () => {
    await getCommunitiesDetails(inputText);
  };

  return (
    <div className={cc([className, 'w-full h-max bg-brandBlack'])} {...props}>
      <nav className="flex nav-bar px-12 justify-between cursor-pointer items-center">
        <div className="flex">
          {Object.entries(tabs)
            .sort(([_, a], [__, b]) => a.tabNumber - b.tabNumber)
            .map(([tabName, tabProps]) => {
              return (
                <div
                  key={tabName}
                  className={cc([
                    { 'tab-active': tabName == selectedTab },
                    { 'opacity-50 cursor-not-allowed': tabProps.disabled },
                    'tab p-2 px-4',
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
        <div className="py-4">
          {inputSearch && setInputText && (
            <SearchBar
              placeholder={'Paste the address...'}
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
