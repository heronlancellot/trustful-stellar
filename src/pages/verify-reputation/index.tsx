import { IssuerTableCell } from '@/components/atoms/verify-reputation/IssuerTableCell';
import { TableEmptyScreen } from '@/components/atoms/TableEmptyScreen';
import { SearchBar } from '@/components/search/SearchBar';
import { CustomTable } from '@/components/organisms/CustomTable';
import { ProfileBox } from '@/components/organisms/ProfileBox';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { useState, useEffect } from 'react';
import {
  SearchContextProvider,
  useSearchContext,
} from '@/components/search/Context';
import { SearchIcon } from '@/components/atoms/icons/SearchIcon';
import tailwindConfig from 'tailwind.config';
import ActivityIndicatorModal from '@/components/molecules/ActivityIndicatorModal';
import { useRouter } from 'next/router';
import { useCommunityContext } from '@/components/community/Context';
import { CardWrapper } from '@/components/templates/CardWrapper';
import { CommunitiesCard } from '@/components/atoms/CommunitiesCard';
import CustomModal from '../communities/components/molecules/custom-modal';
import { TagIcon } from '@/components';
import useVerifyReputationController, {
  Badge,
} from '@/components/verify-reputation/hooks/Controller';
import { useAuthContext } from '@/components/auth/Context';

interface VerifyReputationProps {
  community_address?: string;
  factory_address?: any;
  name?: string;
  description?: string;
  icon?: string;
  creator_address?: string;
  is_hidden?: boolean;
  blocktimestamp?: string;
  total_badges?: number;
  last_indexed_at?: string;
  id?: string;
  users_badges_count?: number;
  users_points?: number;
}

function VerifyReputationPage() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reputationDetail, setReputationDetail] = useState<
    VerifyReputationProps | undefined
  >();
  const { badgeDetails, getBagdeDetails, setBadgeDetails } = useVerifyReputationController();
  const { userAddress } = useAuthContext();

  const {
    searchedUserAddress,
    setSearchedUserAddress,
    setSearchedUserBadges,
    setSearchedUserScore,
    searchedUserBadges,
    searchedUserScore,
  } = useSearchContext();
  const { getVerifyReputationList, verifyReputationcommunities } =
    useCommunityContext();
  const [isLoading, setIsLoading] = useState(false);

  const onSearch = async () => {
    await getVerifyReputationList(inputText);
  };

  useEffect(() => {
    const userAddressFromQuery = router.query.searchAddress as string;
    const addressToUse = userAddressFromQuery || userAddress || searchedUserAddress;

    if (addressToUse) {
      setInputText(addressToUse);
      getVerifyReputationList(addressToUse);
    }
  }, [router.query, userAddress, searchedUserAddress]);

  const reputation = [
    {
      name: 'one',
      score: 5,
      status: 'completed',
      statusColor: 'bg-darkGreenOpacity01',
    },
  ];

  const statusColor = 'bg-darkGreenOpacity01';

  const handleDetailCommunity = (communityAddress: string) => {
    const filteredCommunity = verifyReputationcommunities.find(
      item => item.community_address === communityAddress
    );
    setReputationDetail(filteredCommunity);
    getBagdeDetails(communityAddress);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBadgeDetails(null);
  };

  return (
    <PageTemplate
      className="h-full"
      title="Verify Reputation"
      tooltip={{
        tooltipId: 'verify-reputation-tip',
        tooltipText:
          'Enter a Stellar public address to check the reputation and score associated with it.',
      }}
    >
      <div className="">
        <ProfileBox
          userAddress={searchedUserAddress}
          userBadgesQuantity={searchedUserBadges?.length}
          userScore={searchedUserScore}
          onClear={() => {
            setInputText('');
            setSearchedUserAddress('');
            setSearchedUserBadges([]);
            setSearchedUserScore(0);
          }}
          isClearButtonVisible={!!searchedUserAddress}
          searchBar={
            <SearchBar
              placeholder={'Paste the address...'}
              onButtonClick={onSearch}
              inputText={inputText}
              onChangeInputText={setInputText}
            />
          }
        />

        {verifyReputationcommunities.length === 0 ? (
          <CustomTable
            childrenForEmptyTable={
              <TableEmptyScreen
                icon={
                  <SearchIcon
                    color={tailwindConfig.theme.extend.colors.whiteOpacity05}
                  />
                }
                title="Search to start"
                description="Check a user's reputation by searching for their address"
              />
            }
            className="mt-6"
            headers={['badgeName', 'issuer']}
            data={searchedUserBadges}
          ></CustomTable>
        ) : (
          <div className="mt-8">
            <CardWrapper>
              {Array.isArray(verifyReputationcommunities) &&
                verifyReputationcommunities?.map(community => {
                  return (
                    <CommunitiesCard
                      key={community.community_address}
                      community={community}
                      onClick={() =>
                        handleDetailCommunity(community.community_address)
                      }
                    />
                  );
                })}
            </CardWrapper>
          </div>
        )}
      </div>

      <CustomModal
        title={`${reputationDetail?.name}`}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isAsync={false}
      >
        <>
          <div className="flex p-6 gap-2 items-center">
            <div>
              <TagIcon className="w-4" />
            </div>
            <div className="text-gray-500 text-xs">
              {reputationDetail?.users_points} points /
            </div>
            <div>
              <TagIcon className="w-4" />
            </div>
            <div className="text-gray-500 text-xs">
              {`${reputationDetail?.users_badges_count}/${reputationDetail?.total_badges}`}{' '}
              badges
            </div>
          </div>
          <div className="w-[552px] mb-4 ml-4 mr-4 bg-whiteOpacity005 rounded-xl">
            <div className="flex flex-col border border-whiteOpacity005 rounded-xl max-h-[440px]">
              <div className="flex justify-between items-center border-b border-whiteOpacity005 px-6 py-4">
                <span className="text-sm  text-left">Name</span>
                <span className="text-sm w-24 text-right">Score</span>
                <span className="text-sm w-24 text-center">Status</span>
              </div>

              {badgeDetails && Array.isArray(badgeDetails.community_badges) &&
                badgeDetails.community_badges.map((item: Badge) => (
                  <div
                    key={`${item.community_address}-${item.name}`}
                    className="flex justify-between items-center px-6 py-4"
                  >
                    <span className="text-sm text-whiteOpacity05 text-left">
                      {item?.name}
                    </span>
                    <span className="text-sm text-brandWhite w-24 text-left">
                      {item?.score}
                    </span>
                    <span
                      className={`text-xs w-24 text-center p-1 rounded-3xl bg-darkGreenOpacity01 ${reputation[0]?.statusColor}`}
                    >
                      {`${item.user_has ? 'Completed' : 'Pending'}`}
                    </span>
                  </div>
                ))}

              {/* {reputationDetail.map(({ item, index }: any) => (
                <div key={index} className="flex justify-between items-center px-6 py-4">
                  <span className="text-sm text-whiteOpacity05 text-left">{item.name}</span>
                  <span className="text-sm text-brandWhite w-24 text-left">{item.score}</span>
                  <span className={`text-xs w-24 text-center p-1 rounded-3xl bg-darkGreenOpacity01 ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
              ))} */}
            </div>
          </div>
        </>
      </CustomModal>
      <ActivityIndicatorModal isOpen={isLoading} />
    </PageTemplate>
  );
}

export default function VerifyReputationPageWithContext(
  props: React.ComponentPropsWithRef<'div'>
) {
  return (
    <SearchContextProvider>
      <VerifyReputationPage {...props}></VerifyReputationPage>
    </SearchContextProvider>
  );
}
