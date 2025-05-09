import {
  CheckIcon,
  ContentTabs,
  PlusIcon,
  PrimaryButton,
  StarIcon,
  TagIcon,
  UserIcon,
} from '@/components';
import { SearchIcon } from '@/components/atoms/icons/SearchIcon';
import { ArrowIcon } from '@/components/atoms/icons/ArrowIcon';
import { TableEmptyScreen } from '@/components/atoms/TableEmptyScreen';
import { CustomTable } from '@/components/organisms/CustomTable';
import { IconPosition } from '@/types/iconPosition';
import { useRouter } from 'next/router';
import tailwindConfig from 'tailwind.config';
import { TrashIcon } from '@/components/atoms/icons/TrashIcon';
import { useModal } from '@/hooks/useModal';
import { CustomModal } from './components/molecules/custom-modal';
import LeaderboardTable from '../../components/molecules/leaderboard-table';
import { useContext, useState, useEffect } from 'react';
import { CommunityTableCell } from '../../components/molecules/CommunityTableCell';
import { useCommunityContext } from '@/components/community/Context';
('./components/molecules/leaderboard-table');
import { useAuthContext } from '@/components/auth/Context';
import useCommunitiesController from '@/components/community/hooks/controller';
import toast from 'react-hot-toast';
import { addUser, mainTestnet } from '@/testCall';
import { kit } from '@/components/auth/ConnectStellarWallet';
import { ALBEDO_ID } from '@creit.tech/stellar-wallets-kit';
import { checkIfWalletIsInitialized } from '@/lib/stellar/isFundedStellarWallet';
import { ArrowLeft, Check, EyeOff, LockIcon } from 'lucide-react';
import cc from 'classcat';
import {
  useCommunityBadges,
  useCommunityDetails,
  useCommunityMembers,
} from '@/lib/hooks/api/useCommunityDetails';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateCommunityVisibility } from '@/lib/hooks/api/useCommunities';
import ActivityIndicatorModal from '@/components/molecules/ActivityIndicatorModal';

interface DetailsProps {
  params: {
    data: string[];
  };
}

export default function DetailsCommunity({ params }: DetailsProps) {
  const { openModal, closeModal, isOpen } = useModal();
  const { userAddress, setUserAddress } = useAuthContext();
  const { stellarContractJoinCommunities, stellarContractManagers } =
    useCommunitiesController();
  const router = useRouter();
  const { status, communityAddress } = router.query;
  const [newManager, setNewManager] = useState('');
  const [removeManager, setRemoveManager] = useState('');
  const queryClient = useQueryClient();
  const [isHiding, setIsHiding] = useState(false);
  const [hasOfferedRedirect, setHasOfferedRedirect] = useState(false);

  const { data: communitiesDetail, isLoading: isLoadingDetails } =
    useCommunityDetails(communityAddress as string, userAddress);
  const { data: communitiesBadgesList, isLoading: isLoadingBadges } =
    useCommunityBadges(communityAddress as string, userAddress);
  const { data: communitiesMembersList, isLoading: isLoadingMembers } =
    useCommunityMembers(communityAddress as string);

  const { mutate: updateHideCommunities } = useUpdateCommunityVisibility();
  const { updateShowCommunities } = useCommunityContext();

  const { setCommunitiesDetail } = useCommunityContext();

  const isJoined = communitiesDetail?.is_joined;
  const totalBadgesMemberList = communitiesDetail?.total_badges;
  const isCreator = userAddress && communitiesDetail?.creator_address &&
    userAddress.toLowerCase() === communitiesDetail.creator_address.toLowerCase();

  const statusList = {
    all: 'all',
    joined: 'joined',
    created: 'created',
    hidden: 'hidden',
  };

  const { all, joined, created, hidden } = statusList;

  useEffect(() => {
    if (isCreator && status !== created && !hasOfferedRedirect && typeof window !== 'undefined') {
      setHasOfferedRedirect(true);


      router.push(`/communities/${communityAddress}?status=created`);
    }
  }, [isCreator, status, created, communityAddress, router, hasOfferedRedirect]);

  if (!communityAddress || !status) {
    return <h1>Loading...</h1>;
  }

  if (isLoadingDetails || isLoadingBadges || isLoadingMembers) {
    return <h1>Loading...</h1>;
  }

  const handleJoinedCommunities = async (communityAddress: string) => {
    const result = await stellarContractJoinCommunities.addUser();

    if (result.success) {
      toast.success('Successful Joining Community');

      setCommunitiesDetail((prev: any) => ({
        ...prev,
        is_joined: true,
      }));

      queryClient.invalidateQueries({
        queryKey: ['community-details', communityAddress, userAddress],
      });

      console.log('Transaction successful:', result.txHash);
      closeModal('managers');
    } else {
      toast.error('Not Successful Joining Community');
      closeModal('managers');
      console.error('Transaction failed:', result.error);
    }
  };

  const handleExitCommunities = async (communityAddress: string) => {
    const result = await stellarContractJoinCommunities.removeUser();

    if (result.success) {
      toast.success('Successful Exiting Community');

      setCommunitiesDetail((prev: any) => ({
        ...prev,
        is_joined: false,
      }));

      queryClient.invalidateQueries({
        queryKey: ['community-details', communityAddress, userAddress],
      });

      console.log('Transaction successful:', result.txHash);
      closeModal('managers');
    } else {
      toast.error('Not Successful Exiting Community');
      closeModal('managers');
      console.error('Transaction failed:', result.error);
    }
  };

  const handleInviteManager = async (newManager: string) => {
    const sender = userAddress as string;
    const newManagerFormatted = newManager.toUpperCase();

    const result = await stellarContractManagers.addManager(sender, newManagerFormatted);

    if (result.success) {
      toast.success('Successful Inserting Manager');

      setCommunitiesDetail((prev: any) => {
        const prevData = prev || {};
        const currentManagers = prevData.managers || [];

        if (!currentManagers.includes(newManagerFormatted)) {
          return {
            ...prevData,
            managers: [...currentManagers, newManagerFormatted],
          };
        }

        return prevData;
      });

      queryClient.invalidateQueries({
        queryKey: ['community-details', communityAddress, userAddress],
      });

      console.log('Transaction successful:', result.txHash);
    } else {
      toast.error('Not Successful Inserting Manager');
      console.error('Inserting Manager failed:', result.error);
    }
  };

  const handleRemoveManager = async (removedManager: string) => {
    const sender = userAddress as string;

    const removedManagerFormatted =
      typeof removedManager === 'string' ? removedManager.toUpperCase() : '';

    const result = await stellarContractManagers.removeManager(
      sender,
      removedManagerFormatted
    );

    if (result.success) {
      toast.success('Successful Removing Manager');

      setCommunitiesDetail((prev: any) => {
        const prevData = prev || {};
        const currentManagers = prevData.managers || [];

        return {
          ...prevData,
          managers: currentManagers.filter(
            (manager: string) => manager !== removedManagerFormatted
          ),
        };
      });

      queryClient.invalidateQueries({
        queryKey: ['community-details', communityAddress, userAddress],
      });

      console.log('Transaction successful:', result.txHash);
      closeModal('deleteBadge');
    } else {
      toast.error('Not Successful Removing Manager');
      closeModal('deleteBadge');
      console.error('Removing Manager failed:', result.error);
    }
  };

  const newCommunitiesBadgesList = Array.isArray(
    communitiesBadgesList?.community_badges
  )
    ? communitiesBadgesList.community_badges
    : [];

  const handleHideCommunity = async (communityAddress: string) => {
    setIsHiding(true);
    try {
      await updateHideCommunities(communityAddress);
      toast.success('Community hidden successfully');

      setCommunitiesDetail((prev: any) => ({
        ...prev,
        is_hidden: true,
      }));

      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['communities', userAddress] });
      queryClient.invalidateQueries({
        queryKey: ['communities', 'joined', userAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ['communities', 'created', userAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ['communities', 'hidden', userAddress],
      });

      setTimeout(() => {
        router.push('/communities?status=hidden');
      }, 1000);
    } catch (error) {
      toast.error('Failed to hide community');
      console.error('Error hiding community:', error);
    } finally {
      setIsHiding(false);
      closeModal('hideCommunity');
    }
  };

  const handleShowCommunity = async (communityAddress: string) => {
    setIsHiding(true);
    try {
      await updateShowCommunities(communityAddress);
      toast.success('Community shown successfully');

      setCommunitiesDetail((prev: any) => ({
        ...prev,
        is_hidden: false,
      }));

      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['communities', userAddress] });
      queryClient.invalidateQueries({
        queryKey: ['communities', 'joined', userAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ['communities', 'created', userAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ['communities', 'hidden', userAddress],
      });

      setTimeout(() => {
        router.push('/communities?status=all');
      }, 1000);
    } catch (error) {
      toast.error('Failed to show community');
      console.error('Error showing community:', error);
    } finally {
      setIsHiding(false);
    }
  };

  const searchedUserBadges = newCommunitiesBadgesList.map((badge: any) => ({
    badgeName: (
      <div className="flex flex-row items-center h-7">
        <div className="flex flex-col">
          <span>{badge?.name}</span>
          <span>{badge?.score}</span>
          <span className="text-sm text-whiteOpacity05">
            Points: {badge.score}
          </span>
        </div>
      </div>
    ),
    Score: <CommunityTableCell issuerAddress={badge?.score.toString()} />,
    Name: <CommunityTableCell issuerAddress={badge?.name} />,
    Status: (
      <CommunityTableCell
        issuerAddress={badge?.user_has ? 'Completed' : 'Pending'}
      />
    ),
  }));

  return (
    <div className="flex flex-col w-full h-[calc(100vh-74px)] bg-brandBlack">
      <div className="flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/communities')}
                className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
              >
                <div className="w-4 h-4">
                  <ArrowLeft />
                </div>
              </button>
              <h1 className="text-2xl">{`${communitiesDetail?.name}`}</h1>
            </div>

            <div>
              {status === all && (
                <div className="flex justify-items-center">
                  {isCreator ? (
                    <div className="flex justify-items-center gap-2">
                      <PrimaryButton
                        className="rounded-lg w-max text-brandGreen bg-darkGreenOpacity01"
                        label="Hide"
                        icon={
                          <EyeOff
                            color={tailwindConfig.theme.extend.colors.brandGreen}
                            width={16}
                            height={16}
                          />
                        }
                        iconPosition={IconPosition.LEFT}
                        onClick={() => openModal('hideCommunity')}
                      />
                      <PrimaryButton
                        className="rounded-lg w-max"
                        label="Managers"
                        icon={<LockIcon color="black" width={16} height={16} />}
                        iconPosition={IconPosition.LEFT}
                        onClick={() => openModal('managers')}
                      />
                    </div>
                  ) : (
                    <div>
                      {typeof isJoined !== 'undefined' && isJoined ? (
                        <PrimaryButton
                          className="rounded-lg w-max text-brandGreen bg-darkGreenOpacity01"
                          label="Joined"
                          icon={
                            <Check
                              color={tailwindConfig.theme.extend.colors.brandGreen}
                              width={24}
                              height={24}
                            />
                          }
                          iconPosition={IconPosition.LEFT}
                          onClick={() =>
                            handleExitCommunities(communityAddress as string)
                          }
                        />
                      ) : (
                        <PrimaryButton
                          className={cc([
                            'rounded-lg w-max',
                            {
                              'opacity-30 cursor-not-allowed bg-darkGreenOpacity01':
                                !userAddress,
                            },
                          ])}
                          label="Join"
                          icon={<PlusIcon color="black" width={16} height={16} />}
                          iconPosition={IconPosition.LEFT}
                          onClick={() =>
                            handleJoinedCommunities(communityAddress as string)
                          }
                          disabled={!userAddress}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
              {status === created && (
                <div className="flex justify-items-center gap-2">
                  <PrimaryButton
                    className="rounded-lg w-max text-brandGreen bg-darkGreenOpacity01"
                    label="Hide"
                    icon={
                      <EyeOff
                        color={tailwindConfig.theme.extend.colors.brandGreen}
                        width={16}
                        height={16}
                      />
                    }
                    iconPosition={IconPosition.LEFT}
                    onClick={() => openModal('hideCommunity')}
                  />
                  <PrimaryButton
                    className="rounded-lg w-max"
                    label="Managers"
                    icon={<LockIcon color="black" width={16} height={16} />}
                    iconPosition={IconPosition.LEFT}
                    onClick={() => openModal('managers')}
                  />
                </div>
              )}
              {status === joined && (
                <div className="flex justify-items-center">
                  {isCreator ? (
                    <div className="flex justify-items-center gap-2">
                      <PrimaryButton
                        className="rounded-lg w-max text-brandGreen bg-darkGreenOpacity01"
                        label="Hide"
                        icon={
                          <EyeOff
                            color={tailwindConfig.theme.extend.colors.brandGreen}
                            width={16}
                            height={16}
                          />
                        }
                        iconPosition={IconPosition.LEFT}
                        onClick={() => openModal('hideCommunity')}
                      />
                      <PrimaryButton
                        className="rounded-lg w-max"
                        label="Managers"
                        icon={<LockIcon color="black" width={16} height={16} />}
                        iconPosition={IconPosition.LEFT}
                        onClick={() => openModal('managers')}
                      />
                    </div>
                  ) : (
                    <div>
                      {typeof isJoined === 'undefined' || !isJoined ? (
                        <PrimaryButton
                          className={cc([
                            'rounded-lg w-max',
                            {
                              'opacity-30 cursor-not-allowed bg-darkGreenOpacity01':
                                !userAddress,
                            },
                          ])}
                          label="Join"
                          icon={<PlusIcon color="black" width={16} height={16} />}
                          iconPosition={IconPosition.LEFT}
                          onClick={() =>
                            handleJoinedCommunities(communityAddress as string)
                          }
                          disabled={!userAddress}
                        />
                      ) : (
                        <PrimaryButton
                          className="rounded-lg w-max text-brandGreen bg-darkGreenOpacity01"
                          label="Joined"
                          icon={
                            <Check
                              color={tailwindConfig.theme.extend.colors.brandGreen}
                              width={24}
                              height={24}
                            />
                          }
                          iconPosition={IconPosition.LEFT}
                          onClick={() =>
                            handleExitCommunities(communityAddress as string)
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
              {status === hidden && (
                <div className="flex justify-items-center">
                  <PrimaryButton
                    className="rounded-lg w-max text-brandGreen bg-darkGreenOpacity01"
                    label="Show"
                    icon={
                      <EyeOff
                        color={tailwindConfig.theme.extend.colors.brandGreen}
                        width={16}
                        height={16}
                      />
                    }
                    iconPosition={IconPosition.LEFT}
                    onClick={async () => {
                      setIsHiding(true);
                      try {
                        await useCommunityContext().updateShowCommunities(communityAddress as string);
                        toast.success('Community shown successfully');

                        setCommunitiesDetail((prev: any) => ({
                          ...prev,
                          is_hidden: false,
                        }));

                        queryClient.invalidateQueries({ queryKey: ['communities'] });
                        queryClient.invalidateQueries({ queryKey: ['communities', userAddress] });
                        queryClient.invalidateQueries({
                          queryKey: ['communities', 'joined', userAddress],
                        });
                        queryClient.invalidateQueries({
                          queryKey: ['communities', 'created', userAddress],
                        });
                        queryClient.invalidateQueries({
                          queryKey: ['communities', 'hidden', userAddress],
                        });

                        setTimeout(() => {
                          router.push('/communities?status=all');
                        }, 1000);
                      } catch (error) {
                        toast.error('Failed to show community');
                        console.error('Error showing community:', error);
                      } finally {
                        setIsHiding(false);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <h3 className="text-gray-500 text-base pl-12">{`${communitiesDetail?.description}`}</h3>
        </div>

        <div className="flex items-center gap-2 pl-12">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4" />
            <span className="text-gray-500">
              Created by {communitiesDetail?.creator_address?.substring(0, 10)}
              ...
            </span>
          </div>
          <span className="text-gray-500">/</span>
          <div className="flex items-center gap-2">
            <UserIcon className="w-4" />
            <span className="text-gray-500">
              {communitiesDetail?.total_members}
            </span>
            <span className="text-gray-500">participants</span>
          </div>
          <span className="text-gray-500">/</span>
          <div className="flex items-center gap-2">
            <TagIcon className="w-4" />
            <span className="text-gray-500">
              {communitiesDetail?.total_badges}
            </span>
            <span className="text-gray-500">Badges</span>
          </div>
        </div>
      </div>

      <div className="py-8">
        {status === all && (
          <ContentTabs
            tabs={{
              Badges: {
                content: (
                  <div className="px-12">
                    <CustomTable
                      childrenForEmptyTable={
                        <TableEmptyScreen
                          icon={
                            <SearchIcon
                              color={
                                tailwindConfig.theme.extend.colors
                                  .whiteOpacity05
                              }
                            />
                          }
                          title="Search to start"
                          description="Check a user's reputation by searching for their address"
                        />
                      }
                      className="mt-6"
                      headers={['Name', 'Score']}
                      data={searchedUserBadges}
                    ></CustomTable>
                  </div>
                ),
                tabNumber: 1,
              },
              Leaderboard: {
                content: (
                  <LeaderboardTable
                    communitiesMembersList={communitiesMembersList}
                    totalBadgesMemberList={totalBadgesMemberList}
                  />
                ),
                tabNumber: 2,
              },
            }}
          ></ContentTabs>
        )}
        {status === created && (
          <ContentTabs
            tabs={{
              Badges: {
                content: (
                  <div className="px-12">
                    <CustomTable
                      childrenForEmptyTable={
                        <TableEmptyScreen
                          icon={
                            <SearchIcon
                              color={
                                tailwindConfig.theme.extend.colors
                                  .whiteOpacity05
                              }
                            />
                          }
                          title="Search to start"
                          description="Check a user's reputation by searching for their address"
                        />
                      }
                      className="mt-6"
                      headers={['Name', 'Score', 'Status']}
                      data={searchedUserBadges}
                      isLogged
                      isCreated
                    ></CustomTable>
                  </div>
                ),
                tabNumber: 1,
              },
              Leaderboard: {
                content: (
                  <LeaderboardTable
                    communitiesMembersList={communitiesMembersList}
                    totalBadgesMemberList={totalBadgesMemberList}
                  />
                ),
                tabNumber: 2,
              },
            }}
          ></ContentTabs>
        )}
        {status === joined && (
          <ContentTabs
            tabs={{
              Badges: {
                content: (
                  <div className="px-12">
                    <CustomTable
                      childrenForEmptyTable={
                        <TableEmptyScreen
                          icon={
                            <SearchIcon
                              color={
                                tailwindConfig.theme.extend.colors
                                  .whiteOpacity05
                              }
                            />
                          }
                          title="Search to start"
                          description="Check a user's reputation by searching for their address"
                        />
                      }
                      className="mt-6"
                      headers={['Name', 'Score', 'Status']}
                      data={searchedUserBadges}
                    ></CustomTable>
                  </div>
                ),
                tabNumber: 1,
              },
              Leaderboard: {
                content: (
                  <LeaderboardTable
                    communitiesMembersList={communitiesMembersList}
                    totalBadgesMemberList={totalBadgesMemberList}
                  />
                ),
                tabNumber: 2,
              },
            }}
          ></ContentTabs>
        )}
        {status === hidden && (
          <ContentTabs
            tabs={{
              Badges: {
                content: (
                  <div className="px-12">
                    <CustomTable
                      childrenForEmptyTable={
                        <TableEmptyScreen
                          icon={
                            <SearchIcon
                              color={
                                tailwindConfig.theme.extend.colors
                                  .whiteOpacity05
                              }
                            />
                          }
                          title="Search to start"
                          description="Check a user's reputation by searching for their address"
                        />
                      }
                      className="mt-6"
                      headers={['Name', 'Score', 'Status']}
                      data={searchedUserBadges}
                    ></CustomTable>
                  </div>
                ),
                tabNumber: 1,
              },
              Leaderboard: {
                content: (
                  <LeaderboardTable
                    communitiesMembersList={communitiesMembersList}
                    totalBadgesMemberList={totalBadgesMemberList}
                  />
                ),
                tabNumber: 2,
              },
            }}
          ></ContentTabs>
        )}
      </div>

      <CustomModal
        title="Hide community?"
        isOpen={isOpen('hideCommunity')}
        onClose={() => closeModal('hideCommunity')}
        isAsync={false}
        headerBackgroundColor="bg-whiteOpacity008"
      >
        <>
          <div className="w-full bg-whiteOpacity008">
            <div className="p-6 border-whiteOpacity005 border-b">
              <span className="text-base font-normal">
                {`If you hide this community it won't be visible anymore.`}
              </span>
            </div>
          </div>
          <div className="bg-whiteOpacity008 pt-4 pr-6 pb-4 pl-6 w-[480px] h-[68px] flex justify-end gap-2">
            <button className="text-sm text-center w-[153px] h-[36px] rounded-md bg-darkGreenOpacity01 text-brandGreen pr-2 pl-2">
              No, keep visible
            </button>
            <button
              className="text-sm text-center w-[102px] h-[36px] rounded-md bg-othersRed text-brandBlack pr-2 pl-2"
              onClick={() => handleHideCommunity(communityAddress as string)}
            >
              Yes, hide
            </button>
          </div>
        </>
      </CustomModal>

      <CustomModal
        title="People that can manage"
        isOpen={isOpen('managers')}
        onClose={() => closeModal('managers')}
        isAsync={false}
        headerBackgroundColor="bg-whiteOpacity008"
      >
        <>
          <div className="bg-whiteOpacity008 flex items-center flex-col w-[580px] h-[428px]">
            <div className="flex flex-col items-center w-[552px] h-[172px]">
              <div className="w-[552px]">
                <div className="flex gap-3 py-3">
                  <input
                    placeholder="Add managers by inserting the Stellar address"
                    className="w-[440px] h-[36px] p-2 rounded-lg bg-whiteOpacity005"
                    type="text"
                    onChange={e => setNewManager(e.target.value)}
                  />
                  <button
                    className="flex items-center justify-center w-[100px] h-[36px] rounded-lg bg-brandGreen text-base text-brandBlack text-center"
                    onClick={() => handleInviteManager(newManager)}
                  >
                    Invite
                  </button>
                </div>
                <div className="w-full flex flex-col">
                  {communitiesDetail?.managers?.map(item => (
                    <div
                      key={item}
                      className="w-full flex items-center border-b border-whiteOpacity005 border-opacity-10 py-3"
                    >
                      <div className="w-full flex justify-between items-center gap-2">
                        <div className="flex gap-4 items-center">
                          <div className="w-[35px] h-[35px] rounded-full p-2 bg-blue-500">
                            <StarIcon />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-normal">
                              {`${item.slice(0, 32)}...`}
                            </span>
                            <span className="text-xs text-whiteOpacity05">
                              Manager
                            </span>
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            openModal('deleteBadge');
                            setRemoveManager(item);
                          }}
                          className="w-[15px] h-[15px] cursor-pointer"
                        >
                          <TrashIcon />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      </CustomModal>

      <CustomModal
        title="Delete badge?"
        isOpen={isOpen('deleteBadge')}
        onClose={() => closeModal('deleteBadge')}
        isAsync={false}
        headerBackgroundColor="bg-whiteOpacity008"
      >
        <>
          <div className="bg-whiteOpacity008 w-[500px] h-[100px] p-6">
            <span className="text-base font-normal">
              If you delete this badge, it will no longer be valid as a score
              for your community and may impact the reputation scores of your
              community members.
            </span>
          </div>
          <div className="bg-whiteOpacity008 pt-4 pr-6 pb-4 pl-6 flex justify-end gap-2">
            <button
              onClick={() => closeModal('deleteBadge')}
              className="text-sm text-center w-[153px] h-[36px] rounded-md bg-darkGreenOpacity01 text-brandGreen  "
            >
              No, keep it
            </button>
            <button
              onClick={() => handleRemoveManager(removeManager)}
              className="text-sm text-center w-[102px] h-[36px] rounded-md bg-othersRed text-brandBlack "
            >
              Yes, delete
            </button>
          </div>
        </>
      </CustomModal>

      {/* Loading indicator for hide community operation */}
      <ActivityIndicatorModal isOpen={isHiding} />
    </div>
  );
}
