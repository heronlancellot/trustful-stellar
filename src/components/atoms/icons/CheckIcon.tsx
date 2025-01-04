import { SVGProps } from "react";
import tailwindConfig from "tailwind.config";

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8811 2.97031C11.174 3.26328 11.174 3.73906 10.8811 4.03203L4.88105 10.032C4.58809 10.325 4.1123 10.325 3.81934 10.032L0.819336 7.03203C0.526367 6.73906 0.526367 6.26328 0.819336 5.97031C1.1123 5.67735 1.58809 5.67735 1.88105 5.97031L4.35137 8.43828L9.82168 2.97031C10.1146 2.67735 10.5904 2.67735 10.8834 2.97031H10.8811Z"
        fill={props.color ?? tailwindConfig.theme.extend.colors.brandGreen}
      />
    </svg>
  );
};
