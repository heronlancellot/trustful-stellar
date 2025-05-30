'use client';

import { ContentTabs, GenericModal, StarIcon } from '@/components';
import { useAuthContext } from '@/components/auth/Context';
import { useCommunityContext } from '@/components/community/Context';
import { CardWrapper } from '@/components/templates/CardWrapper';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { useUsersContext } from '@/components/user/Context';
import { useCallback, useEffect, useState, Suspense } from 'react';
import _ from 'lodash';
import { CommunityQuests } from '@/components/community/types';
import { ImportBadgesModalContent } from '@/components/molecules/ImportBadgesModalContent';
import { sendSignedTransaction } from '@/lib/stellar/signTransaction';
import { WalletIcon } from '@/components/atoms/icons/WalletIcon';
import tailwindConfig from 'tailwind.config';
import { kit } from '@/components/auth/ConnectStellarWallet';
import { ALBEDO_ID } from '@creit.tech/stellar-wallets-kit';
import toast from 'react-hot-toast';
import ActivityIndicatorModal from '@/components/molecules/ActivityIndicatorModal';
import { CommunitiesCard } from '@/components/atoms/CommunitiesCard';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useCommunitiesController from '@/components/community/hooks/controller';
import {
  useCommunities,
  useCommunitiesByStatus,
} from '@/lib/hooks/api/useCommunities';
import { useUserMutations } from '@/lib/hooks/api/useUsers';

// Loading component for Suspense fallback
function CommunitiesPageLoading() {
  return (
    <PageTemplate className="pb-4" title="Communities" isCommunity>
      <div className="animate-pulse">
        <div className="h-12 bg-whiteOpacity005 rounded-lg mb-6"></div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(index => (
            <div
              key={index}
              className="bg-whiteOpacity005 rounded-lg h-48"
            ></div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
}

// Main content component that uses useSearchParams
function CommunitiesContent() {
  const { userAddress, setUserAddress } = useAuthContext();
  const { setCommunityQuests, communityQuests, setCommunities } =
    useCommunityContext();
  const {
    userBadgesImported,
    setUserBadgesImported,
    userBadgesToImport,
    setUserBadgesToImport,
  } = useUsersContext();

  const { inputText, setInputText } = useCommunitiesController();
  const { postAsset } = useUserMutations();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const status = searchParams.get('status');

  const [isLoading, setIsLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [selectedQuestName, setSelectedQuestName] = useState('');

  const statusList = {
    all: 'all',
    joined: 'joined',
    created: 'created',
    hidden: 'hidden',
  } as const;

  const currentStatus = (status as string) || statusList.all;

  const { data: allCommunities, isLoading: isLoadingAllCommunities } =
    useCommunities(userAddress);
  const { data: statusCommunities, isLoading: isLoadingStatusCommunities } =
    useCommunitiesByStatus(
      currentStatus !== statusList.all ? currentStatus : '',
      userAddress
    );

  const communities =
    currentStatus !== statusList.all && userAddress
      ? statusCommunities
      : allCommunities;

  const handleTabChange = useCallback(
    (tabName: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('status', tabName);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const handleCommunityClick = useCallback(
    (communityAddress: string, targetStatus: string) => {
      const params = new URLSearchParams();
      params.set('status', targetStatus);
      router.push(`/communities/${communityAddress}?${params.toString()}`);
    },
    [router]
  );

  useEffect(() => {
    if (communities) {
      setCommunities(communities);
      setDataFetched(true);
      setIsLoading(false);
    }
  }, [communities, setCommunities]);

  useEffect(() => {
    if (isLoadingAllCommunities || isLoadingStatusCommunities) {
      setIsLoading(true);
      setDataFetched(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setDataFetched(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoadingAllCommunities, isLoadingStatusCommunities]);

  const isImportButtonDisabled = (questName: string) => {
    if (!userAddress) {
      return true;
    }
    const areBadgesToImport = getModalBadges(questName).some(
      ({ isImported }) => isImported === false
    );
    return !areBadgesToImport;
  };

  const importBadges = async () => {
    if (!userAddress) {
      return;
    }
    try {
      const assetCodesToImport = userBadgesToImport.reduce(
        (assetCodesAcc, currentBadge) => {
          if (currentBadge.assetCode) {
            assetCodesAcc.push(currentBadge.assetCode);
          }
          return assetCodesAcc;
        },
        [] as string[]
      );

      // Use the modern mutation hook
      const { transaction } = await postAsset.mutateAsync({
        receivingPublicKey: userAddress,
        assetName: assetCodesToImport,
        community: 'stellar',
      });

      await sendSignedTransaction(transaction, userAddress);
      toast.success('The badges were imported with success');
    } catch (error: unknown) {
      if (
        (error as Error)?.message.includes(
          'Action request was rejected by the user.'
        )
      ) {
        toast.error('Transaction Rejected by the user');
        return;
      } else if (!!(error as Error)?.message) {
        toast.error((error as Error)?.message);
        return;
      }
      throw error;
    }
  };

  const getModalBadges = (questName: string) => {
    if (!communityQuests[questName]) {
      return [];
    }
    const questBadges = communityQuests[questName]?.map(
      ({ title, description, assetCode, score }) => ({
        title,
        description,
        assetCode,
        score,
      })
    );
    const questBadgesWithIsImported = questBadges.map(questBadge => {
      const isImported = userBadgesImported
        .map(({ assetCode }) => assetCode?.toLocaleLowerCase())
        .includes(questBadge.assetCode?.toLocaleLowerCase());
      if (isImported) {
        return { ...questBadge, isImported };
      }

      const isToImport = userBadgesToImport
        .map(({ assetCode }) => assetCode?.toLocaleLowerCase())
        .includes(questBadge.assetCode?.toLocaleLowerCase());
      if (isToImport) {
        return { ...questBadge, isImported: false };
      }
      return { ...questBadge, isImported: undefined };
    });
    return questBadgesWithIsImported;
  };

  const renderCommunityCards = (targetStatus: string) => {
    if (!dataFetched || isLoading) {
      return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(index => (
            <div
              key={index}
              className="bg-whiteOpacity005 rounded-lg h-48"
            ></div>
          ))}
        </div>
      );
    }

    if (!Array.isArray(communities) || communities.length === 0) {
      return (
        <div className="w-full text-center py-12 text-gray-400">
          No communities found
        </div>
      );
    }

    return communities.map(community => (
      <CommunitiesCard
        key={community.community_address}
        community={community}
        onClick={() =>
          handleCommunityClick(community.community_address, targetStatus)
        }
        currentTab={targetStatus as 'all' | 'joined' | 'created' | 'hidden'}
      />
    ));
  };

  return (
    <PageTemplate
      className="pb-4"
      title="Communities"
      tooltip={{
        tooltipId: 'generate-attestation-tip',
        tooltipText:
          'Import the available reputation badges. They are linked to a score that may be used in Stellar ecosystem dApps and communities in the future.',
      }}
      isCommunity
    >
      <ContentTabs
        inputText={inputText}
        setInputText={setInputText}
        inputSearch
        onButtonClick={handleTabChange}
        tabs={{
          All: {
            content: <CardWrapper>{renderCommunityCards('all')}</CardWrapper>,
            tabNumber: 1,
            disabled: false,
          },
          Joined: {
            content: (
              <CardWrapper>{renderCommunityCards('joined')}</CardWrapper>
            ),
            tabNumber: 2,
            disabled: !userAddress,
          },
          Created: {
            content: (
              <CardWrapper>{renderCommunityCards('created')}</CardWrapper>
            ),
            tabNumber: 3,
            disabled: !userAddress,
          },
          Hidden: {
            content: (
              <CardWrapper>{renderCommunityCards('hidden')}</CardWrapper>
            ),
            tabNumber: 3,
            disabled: !userAddress,
          },
        }}
      />
      {userAddress ? (
        <GenericModal
          isOpen={isImportModalOpen}
          buttonLabel="Import"
          title="Import attestations"
          onClose={() => {
            setImportModalOpen(false);
          }}
          onButtonClick={async () => {
            await importBadges();
          }}
          disabledButton={isImportButtonDisabled(selectedQuestName)}
          isAsync={true}
        >
          <ImportBadgesModalContent
            badges={getModalBadges(selectedQuestName)}
            title="Stellar Quest"
            icon={<StarIcon></StarIcon>}
          />
        </GenericModal>
      ) : (
        <GenericModal
          isOpen={isImportModalOpen}
          buttonLabel="Connect"
          title="Connect Wallet"
          onClose={() => {
            setImportModalOpen(false);
          }}
          onButtonClick={async () => {
            kit.setWallet(ALBEDO_ID);
            const { address } = await kit.getAddress();
            setUserAddress(address);
          }}
          isAsync={true}
        >
          <div className="p-2 w-full h-full items-center justify-center flex flex-col">
            <div className="my-8 p-8 pt-6 w-[150px] h-[150px] rounded-full bg-whiteOpacity005 items-center justify-center">
              <WalletIcon
                color={tailwindConfig.theme.extend.colors.brandGreen}
              ></WalletIcon>
            </div>
            <div className="text-center">
              <span>
                Please connect your wallet to import badges from GitHub Soroban.
              </span>
            </div>
          </div>
        </GenericModal>
      )}
      <ActivityIndicatorModal isOpen={isLoading && !dataFetched} />
    </PageTemplate>
  );
}

export default function CommunitiesPage() {
  return (
    <Suspense fallback={<CommunitiesPageLoading />}>
      <CommunitiesContent />
    </Suspense>
  );
}
