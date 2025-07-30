import { camelCaseToUpperCaseWords } from "@/lib/utils/camelCaseToWords";
import cc from "classcat";
import { Check, Trash2, X } from "lucide-react";
import {
  ComponentPropsWithoutRef,
  FormEvent,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { PlusIcon } from "../atoms";
import useCommunitiesController from "../community/hooks/controller";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../auth/Context";
import { toast } from "react-hot-toast";
import { useCommunityContext } from "../community/Context";
import { isValidStellarAddress } from "@/lib/stellar/isValidStellarAddress";

export interface CustomTableProps<T extends Record<string, any>>
  extends ComponentPropsWithoutRef<"div"> {
  childrenForEmptyTable: ReactNode;
  data?: T[];
  headers: string[];
  headersClassnames?: string[];
  status?: any;
  isLogged?: boolean;
  isCreated?: boolean;
  communityAddress?: string;
}

export const CustomTable = <T extends Record<string, any>>({
  className,
  childrenForEmptyTable,
  data,
  headers,
  headersClassnames,
  isLogged,
  isCreated,
  communityAddress,
}: CustomTableProps<T>): ReactElement => {
  const hasRowsToDisplay = !!data && data.length > 0;
  const [isNewBadge, setIsNewBadge] = useState(false);
  const { stellarContractBadges, stellarContractRemoveBadges } =
    useCommunitiesController({ communityAddress });
  const { getCommunitiesBadgesList } = useCommunityContext();
  const queryClient = useQueryClient();
  const { userAddress } = useAuthContext();
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
      const result = await stellarContractBadges.addBadge(
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

  useEffect(() => {
    console.log(newBadgeData.score);
    console.log(isDisabled);
  }, [newBadgeData, isDisabled]);

  const handleRemoveBadge = async (badge: any) => {
    console.log("badge2121", badge); //TODO: Find the issuer here to remove the hardcoded issuer address
    try {
      console.log("Badge to remove:", badge);

      let badgeName = "";
      if (badge.Name) {
        if (typeof badge.Name === "object" && badge.Name.props) {
          badgeName =
            badge.Name.props.issuerAddress || badge.Name.props.children;
        } else {
          badgeName = badge.Name;
        }
      } else if (badge.name) {
        badgeName = badge.name;
      } else if (badge.badgeName) {
        if (typeof badge.badgeName === "object" && badge.badgeName.props) {
          const children = badge.badgeName.props.children;
          if (Array.isArray(children)) {
            for (const child of children) {
              if (
                typeof child === "object" &&
                child.props &&
                child.props.children
              ) {
                badgeName = child.props.children;
                break;
              }
            }
          } else {
            badgeName = children;
          }
        } else {
          badgeName = badge.badgeName;
        }
      }

      const issuerAddress =
        "GD7IDV44QE7CN35M2QLSAISAYPSOSSZTV7LWMKBU5PKDS7NQKTFRZUTS"; // TODO: Check this hardcoded issuer address

      console.log("Extracted data:", { badgeName, issuerAddress });
      console.log("Full badge object:", badge);

      if (!badgeName) {
        console.error("Badge name missing");
        alert("Cannot remove badge: Missing badge name");
        return;
      }

      if (!stellarContractRemoveBadges) {
        console.error("Badge removal service not available");
        alert("Badge removal service not available");
        return;
      }

      const result = await stellarContractRemoveBadges.removeBadge(
        badgeName,
        issuerAddress,
      );

      if (result.success) {
        console.log(
          `Badge ${badgeName} successfully removed - TX Hash:`,
          result.txHash,
        );
        toast.success(`Badge ${badgeName} successfully removed`);

        if (communityAddress) {
          const communityAddressStr = communityAddress.toString();

          // Immediately invalidate all relevant queries
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
          }, 1000);
        }
      } else {
        console.error("Transaction failed:", result.error);
        alert(`Failed to remove badge: ${result.error}`);
      }
    } catch (error) {
      console.error("Error in removal operation:", error);
      alert("An error occurred while processing the badge removal.");
    }
  };

  return (
    <table className={cc(["custom-table bg-whiteOpacity008", className])}>
      <thead className="rounded-md">
        <tr>
          {headers.map((header, index) => {
            return (
              <th
                key={header}
                className={cc([
                  "border-none px-7 py-4 text-left",
                  headersClassnames?.[index],
                ])}
              >
                <span className="text-sm font-light text-whiteOpacity05">
                  {camelCaseToUpperCaseWords(header)}
                </span>
              </th>
            );
          })}
          {isCreated && (
            <th className="border-none px-7 py-4 text-right">
              <span className="text-sm font-light text-whiteOpacity05"></span>
            </th>
          )}
        </tr>
      </thead>

      <tbody className="w-full">
        {hasRowsToDisplay ? (
          data.map((row, index) => {
            return (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={`${index}-${header}`} className="px-7 py-4">
                    {row[header] as ReactNode}
                  </td>
                ))}

                {isCreated && (
                  <td className="px-7 py-4 text-right">
                    <button
                      onClick={() => handleRemoveBadge(row)}
                      className="transition-opacity hover:opacity-70"
                    >
                      <Trash2 className="size-4 text-whiteOpacity05" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })
        ) : (
          <tr className={cc([{ hidden: hasRowsToDisplay }])}>
            <td colSpan={isCreated ? headers.length + 1 : headers.length}>
              {childrenForEmptyTable}
            </td>
          </tr>
        )}
        {isLogged && (
          <tr>
            <td
              colSpan={isCreated ? headers.length + 1 : headers.length}
              className="py-2"
            >
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
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
