import cc from "classcat";
import { IconicButton } from "@/components/atoms";
import { useState } from "react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  buttonLabel: string;
  children: JSX.Element;
  onButtonClick: () => void;
  isAsync: boolean;
  disabledButton?: boolean;
}

export const GenericModal = ({
  title,
  isOpen,
  onClose,
  children,
  buttonLabel,
  onButtonClick,
  isAsync,
  disabledButton,
}: ModalProps) => {
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const onButtonClickAsync = async () => {
    setIsExecuting(true);
    try {
      await onButtonClick();
      setIsExecuting(false);
    } catch (error) {
      setIsExecuting(false);
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
        className="w-[480px] overflow-hidden rounded-lg border border-white border-opacity-10 bg-brandBlack shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white border-opacity-10 p-5">
          <h3 className="font-dm text-[20px] text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="bg-secondary hover:bg-primary rounded-md px-2 text-xl text-white shadow-white transition-colors duration-300"
          >
            &times;
          </button>
        </div>

        <div className="p-5">{children}</div>

        <div className="p-5">
          <IconicButton
            label={buttonLabel}
            onClick={isAsync ? onButtonClickAsync : onButtonClick}
            isLoading={isExecuting}
            disabled={!!disabledButton}
          />
        </div>
      </div>
    </div>
  );
};
