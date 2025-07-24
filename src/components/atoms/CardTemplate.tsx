import React from "react";
import cc from "classcat";

interface CardTemplateProps extends React.ComponentPropsWithoutRef<"div"> {}

export const CardTemplate: React.FC<CardTemplateProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cc(["border-primary rounded-lg border", className])}
      {...props}
    >
      {children}
    </div>
  );
};
