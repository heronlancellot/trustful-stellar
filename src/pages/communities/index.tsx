import { ContentTabs, GenericModal, StarIcon } from '@/components';
import { useAuthContext } from '@/components/auth/Context';
import { useCommunityContext } from '@/components/community/Context';
import { CardWrapper } from '@/components/templates/CardWrapper';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { useUsersContext } from '@/components/user/Context';
import communityClient from '@/lib/http-clients/CommunityClient';
import usersClient from '@/lib/http-clients/UsersClient';
import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { CommunityQuests } from '@/components/community/types';
import { ImportBadgesModalContent } from '@/components/molecules/ImportBadgesModalContent';
import { sendSignedTransaction } from '@/lib/stellar/signTransaction';
import { WalletIcon } from '@/components/atoms/icons/WalletIcon';
import tailwindConfig from 'tailwind.config';
import { kit } from '@/components/auth/ConnectStellarWallet';
import { ALBEDO_ID } from '@creit.tech/stellar-wallets-kit';
import assetClient from '@/lib/http-clients/AssetClient';
import toast from 'react-hot-toast';
import ActivityIndicatorModal from '@/components/molecules/ActivityIndicatorModal';
import { CommunitiesCard } from '@/components/atoms/CommunitiesCard';
import { useRouter } from 'next/router';
import useCommunitiesController from '../../components/community/hooks/controller';

export default function CommunitiesPage() {
  const { userAddress, setUserAddress } = useAuthContext();
  const {
    setCommunityQuests,
    communityQuests,
    communities,
    getCommunitiesStatus,
    refetchCommunitiesAll,
    setCommunities,
  } = useCommunityContext();
  const {
    userBadgesImported,
    setUserBadgesImported,
    userBadgesToImport,
    setUserBadgesToImport,
  } = useUsersContext();

  const { inputText, setInputText } = useCommunitiesController();

  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [selectedQuestName, setSelectedQuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { status } = router.query;

  const statusList = {
    all: 'all',
    joined: 'joined',
    created: 'created',
    hidden: 'hidden',
  };

  useEffect(() => {
    if (status !== statusList.all && userAddress) {
      async function getComumm() {
        await getCommunitiesStatus(`${status}`);
      }
      getComumm();
    }

    if (status === statusList.all) {
      refetchCommunitiesAll();
    }
  }, [status]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const getCommunities = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_INTERNAL}/communities?user_address=${userAddress}`
        );
        const data = await response.json();

        setCommunities(data);
      } catch (error) {
        console.error(error);
      }
    };

    getCommunities();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  // const fetchBadges = useCallback(async () => {
  //   try {
  //     setIsLoading(true);
  //     const _communityBadges = await communityClient.getCommunityBadges();
  //     const quests: CommunityQuests = _.groupBy(_communityBadges, 'questName');
  //     setCommunityQuests(quests);
  //     if (userAddress) {
  //       const _userBadges = await usersClient.getBadges(userAddress);
  //       const _userBadgesImported =
  //         await usersClient.getBadgesTrustful(userAddress);
  //       setUserBadgesImported(_userBadgesImported);
  //       setUserBadgesToImport(
  //         _userBadges,
  //         _userBadgesImported,
  //         _communityBadges
  //       );
  //       setIsLoading(false);
  //     } else {
  //       setUserBadgesImported([]);
  //       setUserBadgesToImport([], [], []);
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Error fetching user badges', {
  //       duration: 2000,
  //       position: 'top-right',
  //     });
  //     setIsLoading(false);
  //     setCommunityQuests({});
  //     setUserBadgesImported([]);
  //     setUserBadgesToImport([], [], []);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userAddress]);

  // useEffect(() => {
  //   fetchBadges();
  // }, [fetchBadges]);

  // const questIsFullyImported = (questName: string) => {
  //   const userHasNoBadgesOfThisQuest = getModalBadges(questName).every(
  //     ({ isImported }) => isImported === undefined
  //   );
  //   if (!userAddress || userHasNoBadgesOfThisQuest) {
  //     return undefined;
  //   }
  //   // TODO: Compare user trustful and normal badges with badge set badges.
  //   const needToImportBadges = getModalBadges(questName).some(
  //     ({ isImported }) => isImported === false
  //   );
  //   return !needToImportBadges;
  // };

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
      const transaction = await assetClient.postAsset(
        userAddress,
        assetCodesToImport
      );
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

  return (
    <PageTemplate
      className=""
      title={'Communities'}
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
        onButtonClick={tabName => {
          router.push({
            pathname: router.pathname,
            query: { status: tabName },
          });
        }}
        tabs={{
          All: {
            content: (
              <CardWrapper>
                {Array.isArray(communities) &&
                  communities?.map(community => {
                    return (
                      <CommunitiesCard
                        key={community.community_address}
                        community={community}
                        onClick={() =>
                          router.push({
                            pathname: `communities/${community.community_address}`,
                            query: { status: 'all' },
                          })
                        }
                      />
                    );
                  })}
              </CardWrapper>
            ),
            tabNumber: 1,
          },
          Joined: {
            content: (
              <CardWrapper>
                {Array.isArray(communities) &&
                  communities?.map(community => {
                    return (
                      <CommunitiesCard
                        key={community.community_address}
                        community={community}
                        onClick={() =>
                          router.push({
                            pathname: `communities/${community.community_address}`,
                            query: { status: 'joined' },
                          })
                        }
                      />
                    );
                  })}
              </CardWrapper>
            ),
            tabNumber: 2,
          },
          Created: {
            content: (
              <CardWrapper>
                {Array.isArray(communities) &&
                  communities?.map(community => {
                    return (
                      <CommunitiesCard
                        key={community.community_address}
                        community={community}
                        onClick={() =>
                          router.push({
                            pathname: `communities/${community.community_address}`,
                            query: { status: 'created' },
                          })
                        }
                      />
                    );
                  })}
              </CardWrapper>
            ),
            tabNumber: 3,
          },
          Hidden: {
            content: (
              <CardWrapper>
                {Array.isArray(communities) &&
                  communities?.map(community => {
                    return (
                      <CommunitiesCard
                        key={community.community_address}
                        community={community}
                        onClick={() =>
                          router.push({
                            pathname: `communities/${community.community_address}`,
                            query: { status: 'hidden' },
                          })
                        }
                      />
                    );
                  })}
              </CardWrapper>
            ),
            tabNumber: 3,
          },
        }}
      ></ContentTabs>
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
            // await fetchBadges();
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
      <ActivityIndicatorModal isOpen={isLoading} />
    </PageTemplate>
  );
}
