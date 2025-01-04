import { SVGProps } from "react";
import tailwindConfig from "tailwind.config";

export const VerifyReputationIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M59.8078 51.5304L72.2252 63.9478C74.5904 66.313 74.5904 70.1565 72.2252 72.2261C69.86 74.5913 66.0165 74.5913 63.947 72.2261L47.0948 55.3739"
        stroke={props.color ?? tailwindConfig.theme.extend.colors.brandGreen}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.6078 59.2174C47.3034 59.2174 59.2165 47.3043 59.2165 32.6087C59.2165 17.9131 47.3034 6 32.6078 6C17.9123 6 5.99915 17.9131 5.99915 32.6087C5.99915 47.3043 17.9123 59.2174 32.6078 59.2174Z"
        stroke={props.color ?? tailwindConfig.theme.extend.colors.brandGreen}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.6078 17.8261V44.4348"
        stroke={props.color ?? tailwindConfig.theme.extend.colors.brandGreen}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.7817 29.6522V44.4348"
        stroke={props.color ?? tailwindConfig.theme.extend.colors.brandGreen}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44.434 23.7391V44.4348"
        stroke={props.color ?? tailwindConfig.theme.extend.colors.brandGreen}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
