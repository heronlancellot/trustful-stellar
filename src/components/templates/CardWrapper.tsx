import { ReactNode } from "react";

interface CardWrapperProps extends React.ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

export const CardWrapper = ({ children }: CardWrapperProps) => {
  return (
    <div className="w-screen flex justify-center">
      <div className="w-max flex flex-row flex-wrap gap-8 mx-10 justify-start">
        {children}
      </div>
    </div>
  );
};
