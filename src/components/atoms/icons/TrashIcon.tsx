import { SVGProps } from "react";
import tailwindConfig from "tailwind.config";

export const TrashIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M6.5027 2.29762L6.3002 2.6998H3.6002C3.10238 2.6998 2.7002 3.10199 2.7002 3.5998C2.7002 4.09762 3.10238 4.4998 3.6002 4.4998H14.4002C14.898 4.4998 15.3002 4.09762 15.3002 3.5998C15.3002 3.10199 14.898 2.6998 14.4002 2.6998H11.7002L11.4977 2.29762C11.3458 1.99105 11.0336 1.7998 10.6933 1.7998H7.30707C6.96676 1.7998 6.65457 1.99105 6.5027 2.29762ZM14.4002 5.3998H3.6002L4.19645 14.9342C4.24145 15.6457 4.83207 16.1998 5.54363 16.1998H12.4568C13.1683 16.1998 13.7589 15.6457 13.8039 14.9342L14.4002 5.3998Z"
                fill={props.color ?? tailwindConfig.theme.extend.colors.whiteOpacity05}
            />
        </svg>
    );
};