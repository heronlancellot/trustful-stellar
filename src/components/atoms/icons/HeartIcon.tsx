import { SVGProps } from "react";
import tailwindConfig from "tailwind.config";

export const HeartIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 38 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.47882 18.874L16.6852 31.2034C17.2333 31.715 17.9569 32 18.7096 32C19.4624 32 20.1859 31.715 20.7341 31.2034L33.9405 18.874C36.1622 16.8057 37.4193 13.9043 37.4193 10.8713V10.4474C37.4193 5.33876 33.7285 0.982922 28.693 0.142449C25.3603 -0.412993 21.9692 0.675967 19.5867 3.05852L18.7096 3.93554L17.8326 3.05852C15.4501 0.675967 12.0589 -0.412993 8.72629 0.142449C3.69077 0.982922 0 5.33876 0 10.4474V10.8713C0 13.9043 1.25705 16.8057 3.47882 18.874Z"
        fill={props.color ?? tailwindConfig.theme.extend.colors.brandWhite}
      />
    </svg>
  );
};
