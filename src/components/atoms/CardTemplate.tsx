import cc from "classcat";
import { ComponentPropsWithoutRef } from "react";

interface CardTemplateProps extends ComponentPropsWithoutRef<"div"> {}

export const CardTemplate = ({
  children,
  className,
  ...props
}: CardTemplateProps) => {
  return (
    <div
      className={cc(["border-primary rounded-lg border", className])}
      {...props}
    >
      {children}
    </div>
  );
};
