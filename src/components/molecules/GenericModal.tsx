import cc from "classcat";
import { IconicButton } from "../atoms";
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
  const [isExecuting, setIsExecuting] = useState(false);
  const onButtonClickAsync = async () => {
    setIsExecuting(true);
    try{
      await onButtonClick();
      setIsExecuting(false);
    } catch(error){
      setIsExecuting(false);
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
        className="bg-brandBlack shadow-2xl border-white border-opacity-10 border rounded-lg w-[480px] overflow-hidden"
      >
        <div className="flex justify-between border-white border-opacity-10 items-center p-5 border-b">
          <h3 className="text-lg text-[20px] font-dm font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-white bg-secondary shadow-white px-2 rounded-md hover:bg-primary text-xl transition-colors duration-300"
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
