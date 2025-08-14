import cc from "classcat";
import { ComponentPropsWithoutRef } from "react";
import { CheckIcon, XIcon } from "@/components/atoms/icons";

interface AttestationSymbolProps extends ComponentPropsWithoutRef<"div"> {
  checked: boolean;
}

export const AttestationSymbol = ({
  className,
  checked,
  ...props
}: AttestationSymbolProps) => {
  return (
    <div className={cc([className, "w-4"])} {...props}>
      <div className={cc([{ hidden: !checked }])}>
        <CheckIcon />
      </div>
      <div className={cc([{ hidden: checked }, "mt-1 w-3"])}>
        <XIcon />
      </div>
    </div>
  );
};
