import { SVGProps } from "react";
import tailwindConfig from "tailwind.config";

export const CopyIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 35 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.25 0H25.9453C26.9375 0 27.8906 0.398438 28.5938 1.10156L33.8984 6.40625C34.6016 7.10938 35 8.0625 35 9.05469V26.25C35 28.3203 33.3203 30 31.25 30H16.25C14.1797 30 12.5 28.3203 12.5 26.25V3.75C12.5 1.67969 14.1797 0 16.25 0ZM3.75 10H10V15H5V35H20V32.5H25V36.25C25 38.3203 23.3203 40 21.25 40H3.75C1.67969 40 0 38.3203 0 36.25V13.75C0 11.6797 1.67969 10 3.75 10Z"
        fill={props.color ?? tailwindConfig.theme.extend.colors.brandWhite}
      />
    </svg>
  );
};
