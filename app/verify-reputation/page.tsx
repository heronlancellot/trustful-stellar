/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, Suspense } from "react";
import { TableEmptyScreen } from "@/components/atoms/TableEmptyScreen";
import { SearchBar } from "@/components/search/SearchBar";
import { CustomTable } from "@/components/organisms/CustomTable";
import { ProfileBox } from "@/components/organisms/ProfileBox";
import { PageTemplate } from "@/components/templates/PageTemplate";
import {
  SearchContextProvider,
  useSearchContext,
} from "@/components/search/Context";
import { SearchIcon } from "@/components/atoms/icons/SearchIcon";
import tailwindConfig from "tailwind.config";
import { ActivityIndicatorModal } from "@/components/molecules/ActivityIndicatorModal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCommunityContext } from "@/components/community/Context";
import { CardWrapper } from "@/components/templates/CardWrapper";
import { CommunitiesCard } from "@/components/atoms/CommunitiesCard";
import { CustomModal } from "@/components/molecules";
import { TagIcon } from "@/components";
import useVerifyReputationController, {
  Badge,
} from "@/components/verify-reputation/hooks/Controller";

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

// Loading component for Suspense fallback
function VerifyReputationPageLoading() {
  return (
    <PageTemplate
      className="h-full"
      title="Verify Reputation"
      tooltip={{
        tooltipId: "verify-reputation-tip",
        tooltipText:
          "Enter a Stellar public address to check the reputation and score associated with it.",
      }}
    >
      <div className="animate-pulse">
        <div className="mb-6 h-32 rounded-lg bg-whiteOpacity005"></div>
        <div className="h-64 rounded-lg bg-whiteOpacity005"></div>
      </div>
    </PageTemplate>
  );
}

// Main content component that uses useSearchParams
function VerifyReputationContent() {
  const searchParams = useSearchParams();

  const [inputText, setInputText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reputationDetail, setReputationDetail] = useState<
    VerifyReputationProps | undefined
  >();
  const { badgeDetails, getBagdeDetails, setBadgeDetails } =
    useVerifyReputationController();
  const router = useRouter();
  console.log("badgeDetails", badgeDetails);

  const {
    searchedUserAddress,
    setSearchedUserAddress,
    setSearchedUserBadges,
    setSearchedUserScore,
    searchedUserBadges,
    searchedUserScore,
  } = useSearchContext();
  const {
    getVerifyReputationList,
    verifyReputationcommunities,
    setVerifyReputationcommunities,
  } = useCommunityContext();
  const [isLoading, setIsLoading] = useState(false);

  const onSearch = async () => {
    if (!inputText) {
      setVerifyReputationcommunities([]);
      setReputationDetail(undefined);
      setBadgeDetails(null);
    } else {
      await getVerifyReputationList(inputText);
    }
  };

  /** This is used to set the input text and get the reputation list when the page is loaded with a query param */
  useEffect(() => {
    const userAddressFromQuery = searchParams.get("searchAddress");

    if (userAddressFromQuery) {
      setSearchedUserAddress(userAddressFromQuery);
      setInputText(userAddressFromQuery);
      getVerifyReputationList(userAddressFromQuery);
    }
  }, [searchParams]);

  const handleDetailCommunity = (communityAddress: string) => {
    const filteredCommunity = verifyReputationcommunities.find(
      (item) => item.community_address === communityAddress,
    );
    setReputationDetail(filteredCommunity);
    getBagdeDetails(communityAddress);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBadgeDetails(null);
  };

  const handleClear = () => {
    setInputText("");
    setSearchedUserAddress("");
    setSearchedUserBadges([]);
    setSearchedUserScore(0);
    setVerifyReputationcommunities([]);
    setReputationDetail(undefined);
    setBadgeDetails(null);
    const searchParams = new URLSearchParams();
    searchParams.delete("searchAddress");
    router.push(`/verify-reputation/`);
  };

  return (
    <PageTemplate
      className="h-full w-full"
      title="Verify Reputation"
      tooltip={{
        tooltipId: "verify-reputation-tip",
        tooltipText:
          "Enter a Stellar public address to check the reputation and score associated with it.",
      }}
    >
      <div className="h-full w-full">
        <ProfileBox
          userAddress={searchedUserAddress}
          userBadgesQuantity={searchedUserBadges?.length}
          userScore={searchedUserScore}
          onClear={handleClear}
          isClearButtonVisible={!!searchedUserAddress}
          searchBar={
            <SearchBar
              placeholder={"Paste the address..."}
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
            headers={["badgeName", "issuer"]}
            data={searchedUserBadges}
          ></CustomTable>
        ) : (
          <div className="mt-8">
            <CardWrapper>
              {Array.isArray(verifyReputationcommunities) &&
                verifyReputationcommunities?.map((community) => {
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
          <div className="flex items-center gap-2 p-6">
            <div>
              <TagIcon className="w-4" />
            </div>
            <div className="text-xs text-gray-500">
              {reputationDetail?.users_points} points /
            </div>
            <div>
              <TagIcon className="w-4" />
            </div>
            <div className="text-xs text-gray-500">
              {`${reputationDetail?.users_badges_count}/${reputationDetail?.total_badges}`}{" "}
              badges
            </div>
          </div>
          <div className="mb-4 ml-4 mr-4 w-[552px] rounded-xl bg-whiteOpacity005">
            <div className="flex max-h-[440px] flex-col overflow-y-auto rounded-xl border border-whiteOpacity005">
              <div className="flex items-center justify-between border-b border-whiteOpacity005 px-6 py-4">
                <span className="text-left text-sm">Name</span>
                <span className="w-24 text-left text-sm">Score</span>
                <span className="w-24 text-center text-sm">Status</span>
              </div>

              {badgeDetails &&
                Array.isArray(badgeDetails.community_badges) &&
                badgeDetails.community_badges.map((item: Badge) => {
                  return (
                    <>
                      <div
                        key={`${item.community_address}-${item.name}`}
                        className="flex items-center justify-between px-6 py-4"
                      >
                        <span className="text-left text-sm text-whiteOpacity05">
                          {item?.name}
                        </span>
                        <span className="w-24 text-left text-sm text-brandWhite">
                          {item?.score}
                        </span>
                        <span
                          className={`w-24 rounded-3xl p-1 text-center text-xs ${
                            item.user_has
                              ? "bg-darkGreenOpacity01 text-brandGreen"
                              : "bg-[rgba(245,255,255,0.08)] text-whiteOpacity05"
                          }`}
                        >
                          {`${item.user_has ? "Completed" : "Pending"}`}
                        </span>
                      </div>
                    </>
                  );
                })}

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

interface PageProps {
  params?: any;
  searchParams?: any;
}

export default function VerifyReputationPageWithContext(props: PageProps) {
  return (
    <SearchContextProvider>
      <Suspense fallback={<VerifyReputationPageLoading />}>
        <VerifyReputationContent />
      </Suspense>
    </SearchContextProvider>
  );
}
