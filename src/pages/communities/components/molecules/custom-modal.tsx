import { IconicButton } from "@/components/atoms";
import cc from "classcat";
import { useState } from "react";

interface CustomModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    buttonLabel?: string;
    children: JSX.Element;
    onButtonClick?: () => void;
    isAsync: boolean;
    disabledButton?: boolean;
    headerBackgroundColor?: string;
}

export const CustomModal = ({
    title,
    isOpen,
    onClose,
    children,
    buttonLabel,
    onButtonClick,
    isAsync,
    disabledButton,
    headerBackgroundColor = "bg-brandBlack",
}: CustomModalProps) => {
    const [isExecuting, setIsExecuting] = useState(false);

    const onButtonClickAsync = async () => {
        if (onButtonClick) {
            setIsExecuting(true);
            try {
                await onButtonClick();
                setIsExecuting(false);
            } catch (error) {
                setIsExecuting(false);
            }
        }
    };

    return (
        <div
            className={cc([
                "fixed inset-0 bg-opacity-50 flex backdrop-blur-sm justify-center items-center transition-all duration-300",
                isOpen ? "z-50 opacity-100" : "opacity-0 z-[-50]",
            ])}
            onClick={onClose}
        >
            <div
                onClick={(event) => {
                    event.stopPropagation();
                }}
                className="bg-brandBlack shadow-2xl border-white border-opacity-10 border rounded-lg max-w-4xl overflow-hidden"
            >
                <div
                    className={cc([
                        "w-full flex justify-between border-white border-opacity-10 items-center p-5 border-b",
                        headerBackgroundColor,
                    ])}
                >
                    <h3 className="text-lg text-[20px] font-dm font-medium">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-white bg-secondary shadow-white px-2 rounded-md hover:bg-primary text-xl transition-colors duration-300"
                    >
                        &times;
                    </button>
                </div>

                <div className="w-full p-0">{children}</div>

                {buttonLabel && onButtonClick && (
                    <div className="w-full p-5">
                        <IconicButton
                            label={buttonLabel}
                            onClick={isAsync ? onButtonClickAsync : onButtonClick}
                            isLoading={isExecuting}
                            disabled={!!disabledButton}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomModal