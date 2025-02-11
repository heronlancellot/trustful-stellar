import { SVGProps } from "react";
import tailwindConfig from "tailwind.config";

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.0726 5.29473C14.512 4.85527 14.512 4.1416 14.0726 3.70215C13.6331 3.2627 12.9194 3.2627 12.48 3.70215L8.77803 7.40762L5.07256 3.70566C4.63311 3.26621 3.91943 3.26621 3.47998 3.70566C3.04053 4.14512 3.04053 4.85879 3.47998 5.29824L7.18545 9.0002L3.4835 12.7057C3.04404 13.1451 3.04404 13.8588 3.4835 14.2982C3.92295 14.7377 4.63662 14.7377 5.07607 14.2982L8.77803 10.5928L12.4835 14.2947C12.9229 14.7342 13.6366 14.7342 14.0761 14.2947C14.5155 13.8553 14.5155 13.1416 14.0761 12.7021L10.3706 9.0002L14.0726 5.29473Z"
        fill={props.color ?? tailwindConfig.theme.extend.colors.whiteOpacity05}
      />
    </svg>
  );
};
