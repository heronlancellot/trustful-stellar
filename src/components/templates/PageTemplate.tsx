import cc from "classcat";
import { ComponentPropsWithoutRef, ReactNode, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Tooltip } from "react-tooltip";
import { PrimaryButton } from "@/components/atoms/PrimaryButton";
import { IconPosition } from "@/types/iconPosition";
import { PlusIcon } from "@/components/atoms";
import { StepModal } from "@/components/molecules/StepModal";
import { useAuthContext } from "@/components/auth/Context";
import { DappHeader } from "@/components/organisms";

interface PageTemplateProps extends ComponentPropsWithoutRef<"div"> {
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
  isCommunity,
}: PageTemplateProps) => {
  const [isCommunityModalOpen, setIsCommunityModalOpen] =
    useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { userAddress } = useAuthContext();

  const handleCreateCommunity = () => {
    setIsCommunityModalOpen(true);
  };

  const handleCloseCommunityModal = () => {
    setIsCommunityModalOpen(false);
    setCurrentStep(1);
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirm = () => {
    handleCloseCommunityModal();
  };

  return (
    <div
      className={cc([className, "flex h-full w-full flex-col bg-brandBlack"])}
    >
      <DappHeader />
      <PerfectScrollbar className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between px-6 py-4 text-left text-[26px] sm:px-12 sm:pb-3 sm:pt-8">
          <h1 className="font-spaceGrotesk">{title}</h1>{" "}
          {isCommunity && (
            <div>
              <PrimaryButton
                className={cc([
                  "w-max rounded-lg",
                  {
                    "cursor-not-allowed bg-darkGreenOpacity01 opacity-30":
                      !userAddress,
                  },
                ])}
                label="Create"
                icon={<PlusIcon color="black" width={16} height={16} />}
                iconPosition={IconPosition.LEFT}
                onClick={handleCreateCommunity}
                disabled={!userAddress}
              />
            </div>
          )}
        </div>
        <div className="flex">{children}</div>
      </PerfectScrollbar>
      {!!tooltip && <Tooltip id={tooltip?.tooltipId} />}

      {isCommunityModalOpen && (
        <StepModal
          isOpen={isCommunityModalOpen}
          onClose={handleCloseCommunityModal}
          currentStep={currentStep}
          onNext={handleNext}
          onBack={handleBack}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};
