import React, { useState } from "react";
import { IconicButton } from "../atoms";
import cc from "classcat";
import { SearchIcon } from "../atoms/icons/SearchIcon";
import { IconPosition } from "@/types/iconPosition";

interface SearchBarProps extends React.ComponentPropsWithoutRef<"div"> {
  placeholder: string;
  onButtonClick: (value: string) => void;
  inputText: string;
  onChangeInputText: (newValue: string) => void;
}

export const SearchBar = (props: SearchBarProps) => {
  return (
    <div className="flex flex-row">
      <input
        className={cc([
          "h-10 flex-1 border border-whiteOpacity008 bg-whiteOpacity008 p-2 pl-5",
          "rounded-l-lg focus-visible:outline-none active:border active:border-brandWhite",
        ])}
        value={props.inputText}
        onChange={(e) => props.onChangeInputText(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            props.onButtonClick(props.inputText);
          }
        }}
        placeholder={props.placeholder}
      />
      <IconicButton
        className="w-max rounded-l-none rounded-r-lg"
        label="Search"
        icon={<SearchIcon />}
        iconPosition={IconPosition.LEFT}
        onClick={() => props.onButtonClick(props.inputText)}
      />
    </div>
  );
};
