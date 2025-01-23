import { SVGProps } from "react";
import tailwindConfig from "tailwind.config";

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6.96289 1.1875C6.96289 0.703516 6.57188 0.3125 6.08789 0.3125C5.60391 0.3125 5.21289 0.703516 5.21289 1.1875V5.125H1.27539C0.791406 5.125 0.400391 5.51602 0.400391 6C0.400391 6.48398 0.791406 6.875 1.27539 6.875H5.21289V10.8125C5.21289 11.2965 5.60391 11.6875 6.08789 11.6875C6.57188 11.6875 6.96289 11.2965 6.96289 10.8125V6.875H10.9004C11.3844 6.875 11.7754 6.48398 11.7754 6C11.7754 5.51602 11.3844 5.125 10.9004 5.125H6.96289V1.1875Z"
                fill={props.color ?? tailwindConfig.theme.extend.colors.brandGreen}
            />
        </svg>
    );
};