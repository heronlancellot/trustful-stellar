import { camelCaseToUpperCaseWords } from "@/lib/utils/camelCaseToWords";
import cc from "classcat";
import { Trash2 } from "lucide-react";
import React, {
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
} from "react";
import useCommunitiesController from "../community/hooks/controller";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../auth/Context";
import { toast } from "react-hot-toast";
import { useCommunityContext } from "../community/Context";
import { Badge } from "@/components/badge-info/hooks/Controller";
import { NewBadgeTable } from "../atoms/NewBadgeTable";

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

  const mapRowData = (row: T, header: string) => {
    const headerLower = header.toLowerCase();

    if (React.isValidElement(row[header])) {
      return row[header];
    }

    switch (headerLower) {
      case "name":
        return row.name || row.Name || row.badgeName;
      case "score":
        return row.score || row.Score;
      case "status":
        return row.user_has ? "Completed" : "Pending";
      default:
        return row[header] || row[headerLower] || row[header.toLowerCase()];
    }
  };
  const { stellarContractAddBadges, stellarContractRemoveBadges } =
    useCommunitiesController({ communityAddress });
  const { getCommunitiesBadgesList } = useCommunityContext();
  const queryClient = useQueryClient();
  const { userAddress } = useAuthContext();

  const handleRemoveBadge = async (badge: Badge) => {
    try {
      // let badgeName = "";
      // if (badge.Name) {
      //   if (typeof badge.Name === "object" && badge.Name.props) {
      //     badgeName =
      //       badge.Name.props.issuerAddress || badge.Name.props.children;
      //   } else {
      //     badgeName = badge.Name;
      //   }
      // } else if (badge.name) {
      //   badgeName = badge.name;
      // } else if (badge.badgeName) {
      //   if (typeof badge.badgeName === "object" && badge.badgeName.props) {
      //     const children = badge.badgeName.props.children;
      //     if (Array.isArray(children)) {
      //       for (const child of children) {
      //         if (
      //           typeof child === "object" &&
      //           child.props &&
      //           child.props.children
      //         ) {
      //           badgeName = child.props.children;
      //           break;
      //         }
      //       }
      //     } else {
      //       badgeName = children;
      //     }
      //   } else {
      //     badgeName = badge.badgeName;
      //   }
      // }

      // const issuerAddress =
      //   "GD7IDV44QE7CN35M2QLSAISAYPSOSSZTV7LWMKBU5PKDS7NQKTFRZUTS"; // TODO: Check this hardcoded issuer address

      // console.log("Extracted data:", { badgeName, issuerAddress });
      // console.log("Full badge object:", badge);

      if (!badge.name) {
        console.error("Badge name missing");
        toast.error("Cannot remove badge: Missing badge name");
        return;
      }

      if (!stellarContractRemoveBadges.removeBadge) {
        console.error("Badge removal service not available");
        toast.error("Badge removal service not available");
        return;
      }

      const result = await stellarContractRemoveBadges.removeBadge(
        badge.name.toUpperCase(),
        badge.issuer.toUpperCase(),
      );

      if (result.success) {
        console.log(
          `Badge ${badge.name} successfully removed - TX Hash:`,
          result.txHash,
        );
        toast.success(`Badge ${badge.name} successfully removed`);

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
        toast.error(`Failed to remove badge: ${result.error}`);
      }
    } catch (error) {
      console.error("Error in removal operation:", error);
      toast.error("An error occurred while processing the badge removal.");
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
          {isCreated && ( // This is the mock column for the remove badge button.
            <th className="border-none px-7 py-4 text-right">
              <span></span>
            </th>
          )}
        </tr>
      </thead>

      <tbody className="w-full">
        {!hasRowsToDisplay ? (
          <tr className={cc([{ hidden: hasRowsToDisplay }])}>
            <td colSpan={isCreated ? headers.length + 1 : headers.length}>
              {childrenForEmptyTable}
            </td>
          </tr>
        ) : (
          data.map((row, index) => {
            console.log("row", row);
            return (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={`${index}-${header}`} className="px-7 py-4">
                    {mapRowData(row, header) as ReactNode}
                  </td>
                ))}
                {isCreated && (
                  <td className="px-7 py-4 text-right">
                    <button
                      onClick={() => handleRemoveBadge(row as unknown as Badge)}
                      className="transition-opacity hover:opacity-70"
                    >
                      <Trash2 className="size-4 text-whiteOpacity05" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })
        )}

        {isLogged && (
          <tr>
            <td
              colSpan={isCreated ? headers.length + 1 : headers.length}
              className="py-2"
            >
              <NewBadgeTable communityAddress={communityAddress} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
