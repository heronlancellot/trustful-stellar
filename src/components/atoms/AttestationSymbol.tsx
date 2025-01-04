import cc from "classcat";
import { CheckIcon } from "./icons/CheckIcon";
import React from "react";
import { XIcon } from "./icons/XIcon";

interface AttestationSymbolProps extends React.ComponentPropsWithoutRef<"div"> {
  checked: boolean;
}

export const AttestationSymbol: React.FC<AttestationSymbolProps> = ({
  className,
  checked,
  ...props
}) => {
  return (
    <div className={cc([className, "w-4"])} {...props}>
      <div className={cc([{ hidden: !checked }])}>
        <CheckIcon />
      </div>
      <div className={cc([{ hidden: checked }, "w-3 mt-1"])}>
        <XIcon />
      </div>
    </div>
  );
};
