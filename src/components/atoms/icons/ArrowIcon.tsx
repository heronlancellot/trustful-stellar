import { SVGProps } from "react";
import tailwindConfig from "tailwind.config";

export const ArrowIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="arrow-down-solid 1">
        <path
          id="Vector"
          d="M7.84148 14.3875C8.20592 14.7519 8.79777 14.7519 9.16222 14.3875L13.8271 9.72264C14.1915 9.35819 14.1915 8.76634 13.8271 8.4019C13.4626 8.03746 12.8708 8.03746 12.5063 8.4019L9.43336 11.4778V2.53294C9.43336 2.0169 9.01644 1.59998 8.50039 1.59998C7.98434 1.59998 7.56742 2.0169 7.56742 2.53294V11.4749L4.49446 8.40482C4.13001 8.04038 3.53816 8.04038 3.17372 8.40482C2.80928 8.76926 2.80928 9.36111 3.17372 9.72555L7.83857 14.3904L7.84148 14.3875Z"
          fill={props.color ?? tailwindConfig.theme.extend.colors.whiteOpacity05}
        />
      </g>
    </svg>
  );
};
