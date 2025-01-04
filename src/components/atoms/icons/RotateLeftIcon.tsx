import { SVGProps } from "react";
import tailwindConfig from "tailwind.config";

export const RotateLeftIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <div className={props.className}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_514_245)">
          <path
            d="M1.32617 6.125H1.09375C0.730078 6.125 0.4375 5.83242 0.4375 5.46875V1.96875C0.4375 1.70352 0.596094 1.46289 0.842187 1.36172C1.08828 1.26055 1.36992 1.31523 1.55859 1.50391L2.69609 2.64141C5.09141 0.276171 8.94961 0.284374 11.3313 2.66875C13.7238 5.06133 13.7238 8.93867 11.3313 11.3312C8.93867 13.7238 5.06133 13.7238 2.66875 11.3312C2.32695 10.9895 2.32695 10.4344 2.66875 10.0926C3.01055 9.75078 3.56562 9.75078 3.90742 10.0926C5.61641 11.8016 8.38633 11.8016 10.0953 10.0926C11.8043 8.38359 11.8043 5.61367 10.0953 3.90469C8.39453 2.20391 5.64648 2.1957 3.93477 3.87734L5.05859 5.00391C5.24727 5.19258 5.30195 5.47422 5.20078 5.72031C5.09961 5.96641 4.85898 6.125 4.59375 6.125H1.32617Z"
            fill={props.color ?? tailwindConfig.theme.extend.colors.brandGreen}
          />
        </g>
        <defs>
          <clipPath id="clip0_514_245">
            <rect width="14" height="14" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};
