import { SVGProps } from "react";
import tailwindConfig from "tailwind.config";

export const EthereumIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M31.7422 20.375L19.875 27.625L8 20.375L19.875 0L31.7422 20.375ZM19.875 29.9531L8 22.7031L19.875 40L31.75 22.7031L19.875 29.9531Z"
        fill={props.color ?? tailwindConfig.theme.extend.colors.brandWhite}
      />
    </svg>
  );
};
