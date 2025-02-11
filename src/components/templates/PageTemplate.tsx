import cc from "classcat";
import { ReactNode, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import React from "react";
import { Tooltip } from "react-tooltip";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { IconPosition } from "@/types/iconPosition";
import { PlusIcon } from "../atoms";
import { StepModal } from "../molecules/StepModal";

interface PageTemplateProps extends React.ComponentPropsWithoutRef<"div"> {
  className: string;
  title: string;
  children: ReactNode;
  tooltip?: { tooltipId: string; tooltipText: string };
  isCommunity?: Boolean;
}

export const PageTemplate = ({
  className,
  title,
  children,
  tooltip,
  isCommunity
}: PageTemplateProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirm = () => {
    handleCloseModal();
  };

  return (

    <div
      className={cc([
        className,
        "flex flex-col w-full h-[calc(100vh-74px)] bg-brandBlack",
      ])}
    >

      <PerfectScrollbar className="h-full flex flex-col">
        <div className="text-left text-[26px] pl-12 pt-8 pb-3 flex justify-between items-center">

          <h1 className="font-space-grotesk">{title}</h1>{" "}

          {isCommunity && (
            <div className="p-6">
              <PrimaryButton
                className="rounded-lg w-max"
                label="Create"
                icon={<PlusIcon color="black" width={16} height={16} />}
                iconPosition={IconPosition.LEFT}
                onClick={handleCreateClick}
              />
            </div>
          )}

        </div>
        <div className="flex">{children}</div>
      </PerfectScrollbar>
      {!!tooltip ? <Tooltip id={tooltip?.tooltipId} /> : <></>}

      {isModalOpen && (
        <StepModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          currentStep={currentStep}
          onNext={handleNext}
          onBack={handleBack}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};