"use client";

import { isValidStellarAddress } from "@/lib/stellar/isValidStellarAddress";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import useCommunitiesController from "../community/hooks/controller";

import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../auth/Context";
import { useCommunityContext } from "../community/Context";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { PlusIcon } from "lucide-react";

export const NewBadgeTable = ({
  communityAddress,
}: {
  communityAddress: string | undefined;
}) => {
  const { stellarContractAddBadges } = useCommunitiesController({
    communityAddress,
  });
  const { getCommunitiesBadgesList } = useCommunityContext();
  const queryClient = useQueryClient();
  const { userAddress } = useAuthContext();
  const [isNewBadge, setIsNewBadge] = useState(false);
  const [newBadgeData, setNewBadgeData] = useState<{
    name: string;
    issuer: string;
    score?: number | string;
  }>({
    name: "",
    issuer: "",
    score: "",
  });

  const isDisabled =
    !!newBadgeData.name && !!newBadgeData.issuer && !!newBadgeData.score;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (
        newBadgeData.score === undefined ||
        typeof newBadgeData.score === "string" ||
        !newBadgeData.name ||
        !newBadgeData.issuer
      ) {
        toast.error("Please fill all badge fields correctly");
        return;
      }

      if (!isValidStellarAddress(newBadgeData.issuer)) {
        toast.error("Invalid issuer address");
        return;
      }

      setNewBadgeData({ name: "", issuer: "", score: "" });
      const result = await stellarContractAddBadges.addBadge(
        newBadgeData.name,
        newBadgeData.issuer,
        newBadgeData.score,
      );

      if (result.success) {
        console.log("Transaction successful - TX Hash:", result.txHash);
        toast.success(`Badge ${newBadgeData.name} added successfully`);
        setIsNewBadge(false);

        if (communityAddress) {
          const communityAddressStr = communityAddress.toString();

          queryClient.invalidateQueries({
            queryKey: ["community-badges", communityAddressStr, userAddress],
          });

          queryClient.invalidateQueries({
            queryKey: ["community-details", communityAddressStr, userAddress],
          });

          queryClient.invalidateQueries({ queryKey: ["communities"] });
          queryClient.invalidateQueries({
            queryKey: ["communities", userAddress],
          });

          if (getCommunitiesBadgesList) {
            await getCommunitiesBadgesList(communityAddressStr);
          }

          setTimeout(async () => {
            if (getCommunitiesBadgesList) {
              await getCommunitiesBadgesList(communityAddressStr);
            }
          }, 5000);
        }
      } else {
        console.error("Transaction failed:", result.error);
        toast.error(`Failed to add badge: ${result.error}`);
      }
    } catch (error) {
      console.error("Error adding badge:", error);
      toast.error(
        `An unexpected error occurred: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <>
      {isNewBadge ? (
        <form onSubmit={handleSubmit}>
          <div className="ml-3 flex w-full items-center gap-2 p-2">
            <input
              type="text"
              placeholder="Badge name"
              value={newBadgeData.name}
              onChange={(e) =>
                setNewBadgeData({
                  ...newBadgeData,
                  name: e.target.value,
                })
              }
              className="w-full rounded-lg bg-gray-700 bg-whiteOpacity008 p-2"
            />
            <input
              type="text"
              placeholder="Issuer"
              value={newBadgeData.issuer}
              onChange={(e) =>
                setNewBadgeData({
                  ...newBadgeData,
                  issuer: e.target.value,
                })
              }
              className="w-full rounded-lg bg-gray-700 bg-whiteOpacity008 p-2"
            />
            <input
              type="number"
              placeholder="Score"
              value={newBadgeData.score}
              onChange={(e) =>
                setNewBadgeData({
                  ...newBadgeData,
                  score: Number(e.target.value),
                })
              }
              className="w-full rounded-lg bg-gray-700 bg-whiteOpacity008 p-2"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-lg p-2"
              disabled={!isDisabled}
            >
              <Check className="size-4 text-white hover:text-white/70" />
            </button>
            <button
              type="button"
              className="rounded-lg p-2"
              onClick={() => setIsNewBadge(false)}
            >
              <X className="size-4 text-white hover:text-white/70" />
            </button>
          </div>
        </form>
      ) : (
        <div className="ml-10 flex items-center gap-2 py-2">
          <PlusIcon color="gray" />
          <button
            className="text-whiteOpacity05"
            onClick={() => setIsNewBadge(true)}
          >
            New Badge
          </button>
        </div>
      )}
    </>
  );
};
