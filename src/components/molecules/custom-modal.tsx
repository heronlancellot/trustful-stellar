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
        "fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm transition-all duration-300",
        isOpen ? "z-50 opacity-100" : "z-[-50] opacity-0",
      ])}
      onClick={onClose}
    >
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        className="max-w-4xl overflow-hidden rounded-lg border border-white border-opacity-10 bg-brandBlack shadow-2xl"
      >
        <div
          className={cc([
            "flex w-full items-center justify-between border-b border-white border-opacity-10 p-5",
            headerBackgroundColor,
          ])}
        >
          <h3 className="font-dm text-[20px] text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="bg-secondary hover:bg-primary rounded-md px-2 text-xl text-white shadow-white transition-colors duration-300"
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

export default CustomModal;
