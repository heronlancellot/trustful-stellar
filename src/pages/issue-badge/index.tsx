import {
  AttestationBadge,
  ContentTabs,
  GenericModal,
  StarIcon,
} from "@/components";
import { useAuthContext } from "@/components/auth/Context";
import { useCommunityContext } from "@/components/community/Context";
import { CardWrapper } from "@/components/templates/CardWrapper";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { useUsersContext } from "@/components/user/Context";
import communityClient from "@/lib/http-clients/CommunityClient";
import usersClient from "@/lib/http-clients/UsersClient";
import { getQuestIcon as getQuestIcon } from "@/lib/getQuestIcon";
import { convertQuestNameToPresentation } from "@/lib/utils/convertBadgeSetNameToPresentation";
import { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import { CommunityQuests } from "@/components/community/types";
import { ImportBadgesModalContent } from "@/components/molecules/ImportBadgesModalContent";
import { sendSignedTransaction } from "@/lib/stellar/signTransaction";
import { WalletIcon } from "@/components/atoms/icons/WalletIcon";
import tailwindConfig from "tailwind.config";
import { kit } from "@/components/auth/ConnectStellarWallet";
import { ALBEDO_ID } from "@creit.tech/stellar-wallets-kit";
import assetClient from "@/lib/http-clients/AssetClient";
import toast from "react-hot-toast";
import ActivityIndicatorModal from "@/components/molecules/ActivityIndicatorModal";
import { LEGACY_STELLAR_QUEST_NAME } from "@/lib/constants";

export default function IssueBadgePage() {
  const { userAddress, setUserAddress } = useAuthContext();
  const { setCommunityQuests, communityQuests } = useCommunityContext();
  const {
    userBadgesImported,
    setUserBadgesImported,
    userBadgesToImport,
    setUserBadgesToImport,
  } = useUsersContext();

  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [selectedQuestName, setSelectedQuestName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchBadges = useCallback(async () => {
    try {
      setIsLoading(true);
      const _communityBadges = await communityClient.getCommunityBadges();
      const quests: CommunityQuests = _.groupBy(_communityBadges, "questName");
      setCommunityQuests(quests);
      if (userAddress) {
        const _userBadges = await usersClient.getBadges(userAddress);
        const _userBadgesImported =
          await usersClient.getBadgesTrustful(userAddress);
        setUserBadgesImported(_userBadgesImported);
        setUserBadgesToImport(
          _userBadges,
          _userBadgesImported,
          _communityBadges
        );
        setIsLoading(false);
      } else {
        setUserBadgesImported([]);
        setUserBadgesToImport([], [], []);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching user badges", {
        duration: 2000,
        position: "top-right",
      });
      setIsLoading(false);
      setCommunityQuests({});
      setUserBadgesImported([]);
      setUserBadgesToImport([], [], []);
    }
  }, [userAddress]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const questIsFullyImported = (questName: string) => {
    const userHasNoBadgesOfThisQuest = getModalBadges(questName).every(
      ({ isImported }) => isImported === undefined
    );
    if (!userAddress || userHasNoBadgesOfThisQuest) {
      return undefined;
    }
    // TODO: Compare user trustful and normal badges with badge set badges.
    const needToImportBadges = getModalBadges(questName).some(
      ({ isImported }) => isImported === false
    );
    return !needToImportBadges;
  };

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
      toast.success("The badges were imported with success");
    } catch (error: unknown) {
      if (
        (error as Error)?.message.includes(
          "Action request was rejected by the user."
        )
      ) {
        toast.error("Transaction Rejected by the user");
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
    const questBadgesWithIsImported = questBadges.map((questBadge) => {
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
      title={"Generate Attestation"}
      tooltip={{
        tooltipId: "generate-attestation-tip",
        tooltipText:
          "Import the available reputation badges. They are linked to a score that may be used in Stellar ecosystem dApps and communities in the future.",
      }}
    >
      <ContentTabs
        tabs={{
          Import: {
            content: (
              <CardWrapper>
                {Object.keys(communityQuests).map((questName) => {
                  // Hiding the Legacy Stellar Quests if the User doesn't have any badge to import(a.k.a. questIsFullyImport(questName)===undefined)
                  if (questName === LEGACY_STELLAR_QUEST_NAME) {
                    if (questIsFullyImported(questName) === undefined) {
                      return;
                    }
                  }
                  return (
                    <AttestationBadge
                      key={questName}
                      title={convertQuestNameToPresentation(questName)}
                      icon={getQuestIcon(questName)}
                      imported={questIsFullyImported(questName)}
                      onClick={() => {
                        setImportModalOpen(true);
                        setSelectedQuestName(questName);
                      }}
                    />
                  );
                })}
              </CardWrapper>
            ),
            tabNumber: 1,
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
            await fetchBadges();
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
