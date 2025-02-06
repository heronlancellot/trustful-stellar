import { IssuerTableCell } from "@/components/atoms/verify-reputation/IssuerTableCell";
import { TableEmptyScreen } from "@/components/atoms/TableEmptyScreen";
import { SearchBar } from "@/components/search/SearchBar";
import { CustomTable } from "@/components/organisms/CustomTable";
import { ProfileBox } from "@/components/organisms/ProfileBox";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { useEffect, useState } from "react";
import {
  SearchContextProvider,
  useSearchContext,
} from "@/components/search/Context";
import { isValidStellarAddress } from "@/lib/stellar/isValidStellarAddress";
import communityClient from "@/lib/http-clients/CommunityClient";
import usersClient from "@/lib/http-clients/UsersClient";
import { SearchIcon } from "@/components/atoms/icons/SearchIcon";
import tailwindConfig from "tailwind.config";
import ActivityIndicatorModal from "@/components/molecules/ActivityIndicatorModal";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
// import { reputationDetailsData } from "@/lib/utils/mock/reputationDetails";


function VerifyReputationPage() {
  const router = useRouter();
  const { searchAddress } = router.query;
  const [inputText, setInputText] = useState("");
  const {
    searchedUserAddress,
    setSearchedUserAddress,
    setSearchedUserBadges,
    setSearchedUserScore,
    searchedUserBadges,
    searchedUserScore,
  } = useSearchContext();
  const [isLoading, setIsLoading] = useState(false);
  const onSearch = async (address: string) => {
    try {
      if (!isValidStellarAddress(address)) {
        setInputText("");
        alert("Invalid User Address");
        return false;
      }
      setIsLoading(true);
      setSearchedUserAddress(address);
      const communityBadges = await communityClient.getCommunityBadges();
      const userTrustfulBadges = await usersClient.getBadgesTrustful(address);
      const userTrustfulBadgesAssetCodes = userTrustfulBadges.map(
        ({ assetCode }) => assetCode
      );
      const userCommunityBadges = communityBadges.filter(({ assetCode }) =>
        userTrustfulBadgesAssetCodes.includes(assetCode)
      );
      const searchedUserBadges = userCommunityBadges.map((badge) => ({
        badgeName: (
          <div className="flex flex-row items-center h-7">
            <div className="flex flex-col">
              <span>{badge.description}</span>
              <span className="text-sm text-whiteOpacity05">
                Points: {badge.score}
              </span>
            </div>
          </div>
        ),
        issuer: <IssuerTableCell issuerAddress={badge.issuer[0]} />,
      }));
      setSearchedUserBadges(searchedUserBadges);
      const userScore = await usersClient.getScore(address);
      setSearchedUserScore(userScore);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching user badges", {
        duration: 2000,
        position: "top-right",
      });
      setSearchedUserAddress("");
      setSearchedUserScore(0);
      setSearchedUserBadges([]);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (searchAddress && typeof searchAddress === "string") {
      onSearch(searchAddress);
      setInputText(searchAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchAddress]);

  // const [reputation] = useState(reputationDetailsData)

  return (
    <PageTemplate className="h-full" title="Verify Reputation" tooltip={{
      tooltipId: "verify-reputation-tip",
      tooltipText: "Enter a Stellar public address to check the reputation and score associated with it."
    }}>
      <div className="p-12 pt-2">
        <ProfileBox
          userAddress={searchedUserAddress}
          userBadgesQuantity={searchedUserBadges?.length}
          userScore={searchedUserScore}
          onClear={() => {
            setInputText("");
            setSearchedUserAddress("");
            setSearchedUserBadges([]);
            setSearchedUserScore(0);
          }}
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
      </div>

      {/* <CustomModal
                title="Stellar Quest"
                isOpen={isOpen("details")}
                onClose={() => closeModal("details")}
                isAsync={false}
            >
                <>
                    <div className="flex p-6 gap-2 items-center">
                        <div><TagIcon className="w-4" /></div>
                        <div className="text-gray-500 text-xs">2,000 points /</div>
                        <div><TagIcon className="w-4" /></div>
                        <div className="text-gray-500 text-xs">2/20 badges</div>
                    </div>
                    <div className="w-[552px] mb-4 ml-4 mr-4 bg-whiteOpacity005 rounded-xl">
                        <div className="flex flex-col border border-whiteOpacity005 rounded-xl max-h-[440px]">

                            <div className="flex justify-between items-center border-b border-whiteOpacity005 px-6 py-4">
                                <span className="text-sm  text-left">Name</span>
                                <span className="text-sm w-24 text-right">Score</span>
                                <span className="text-sm w-24 text-center">Status</span>
                            </div>

                            {reputation.map((item, index) => (
                                <div key={index} className="flex justify-between items-center px-6 py-4">
                                    <span className="text-sm text-whiteOpacity05 text-left">{item.name}</span>
                                    <span className="text-sm text-brandWhite w-24 text-left">{item.score}</span>
                                    <span className={`text-xs w-24 text-center p-1 rounded-3xl bg-darkGreenOpacity01 ${item.statusColor}`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </>
            </CustomModal> */}
      <ActivityIndicatorModal isOpen={isLoading} />
    </PageTemplate>
  );
}

export default function VerifyReputationPageWithContext(
  props: React.ComponentPropsWithRef<"div">
) {
  return (
    <SearchContextProvider>
      <VerifyReputationPage {...props}></VerifyReputationPage>
    </SearchContextProvider>
  );
}
