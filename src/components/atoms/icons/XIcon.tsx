import { SVGProps } from "react";
import tailwindConfig from "tailwind.config";

export const XIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 11 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5084 1.70627C10.899 1.31565 10.899 0.681274 10.5084 0.290649C10.1178 -0.0999756 9.4834 -0.0999756 9.09277 0.290649L5.80215 3.5844L2.5084 0.293774C2.11777 -0.0968506 1.4834 -0.0968506 1.09277 0.293774C0.702148 0.684399 0.702148 1.31877 1.09277 1.7094L4.38652 5.00002L1.0959 8.29377C0.705274 8.6844 0.705274 9.31878 1.0959 9.7094C1.48652 10.1 2.1209 10.1 2.51152 9.7094L5.80215 6.41565L9.0959 9.70627C9.48652 10.0969 10.1209 10.0969 10.5115 9.70627C10.9021 9.31565 10.9021 8.68127 10.5115 8.29065L7.21777 5.00002L10.5084 1.70627Z"
        fill={props.color ?? tailwindConfig.theme.extend.colors.othersRed}
      />
    </svg>
  );
};
