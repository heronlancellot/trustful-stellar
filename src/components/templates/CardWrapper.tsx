import { ComponentPropsWithoutRef, ReactNode } from "react";

interface CardWrapperProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

export const CardWrapper = ({ children }: CardWrapperProps) => {
  return (
    <div className="flex w-full justify-center">
      <div className="mx-10 flex w-max flex-row flex-wrap justify-start gap-8">
        {children}
      </div>
    </div>
  );
};
