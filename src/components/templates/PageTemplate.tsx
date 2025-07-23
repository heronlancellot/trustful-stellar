import cc from 'classcat';
import { ComponentPropsWithoutRef, ReactNode, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Tooltip } from 'react-tooltip';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { IconPosition } from '@/types/iconPosition';
import { PlusIcon } from '../atoms';
import { StepModal } from '../molecules/StepModal';
import { useAuthContext } from '../auth/Context';
import { DappHeader } from '../organisms';

interface PageTemplateProps extends ComponentPropsWithoutRef<'div'> {
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
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleConfirm = () => {
    handleCloseCommunityModal();
  };

  return (
    <div
      className={cc([className, 'flex flex-col w-full h-full  bg-brandBlack'])}
    >
      <DappHeader />
      <PerfectScrollbar className="h-full flex flex-col w-full">
        <div className="text-left text-[26px] pl-12 pt-8 pb-3 flex justify-between items-center">
          <h1 className="font-spaceGrotesk">{title}</h1>{' '}
          {isCommunity && (
            <div className="py-6 px-12">
              <PrimaryButton
                className={cc([
                  'rounded-lg w-max',
                  {
                    'opacity-30 cursor-not-allowed bg-darkGreenOpacity01':
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
