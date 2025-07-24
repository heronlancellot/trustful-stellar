import { CustomTable } from "@/components/organisms/CustomTable";
import { TableEmptyScreen } from "@/components/atoms/TableEmptyScreen";
import { SearchIcon } from "@/components/atoms/icons/SearchIcon";
import tailwindConfig from "tailwind.config";
import { IssuerTableCell } from "@/components/atoms/verify-reputation/IssuerTableCell";
import { RankIcon } from "@/components/atoms/icons/RankIcon";
import { MembersList } from "@/types/communities";
import { CommunityTableCell } from "@/components/molecules/CommunityTableCell";

type LeaderboardPlayer = {
  rank: number;
  address: string;
  points: number;
  badges: number;
  avatarUrl?: string;
};

function getRankIconColor(rank: number) {
  const colorsMap = {
    1: tailwindConfig.theme.extend.colors.brandGreen,
    2: tailwindConfig.theme.extend.colors.brandWhite,
    3: tailwindConfig.theme.extend.colors.orange,
    default: tailwindConfig.theme.extend.colors.whiteOpacity008,
  } as const;

  return colorsMap[rank as keyof typeof colorsMap] || colorsMap.default;
}

function getRankTextColor(rank: number) {
  if (rank <= 3) {
    return tailwindConfig.theme.extend.colors.brandBlack;
  }
  return tailwindConfig.theme.extend.colors.brandWhite;
}

function getPointsTextColor(rank: number) {
  const colorsMap = {
    1: tailwindConfig.theme.extend.colors.brandGreen,
    2: tailwindConfig.theme.extend.colors.brandWhite,
    3: tailwindConfig.theme.extend.colors.orange,
    default: tailwindConfig.theme.extend.colors.brandWhite,
  } as const;

  return colorsMap[rank as keyof typeof colorsMap] || colorsMap.default;
}

export default function LeaderboardTable({
  communitiesMembersList,
  totalBadgesMemberList,
}: any) {
  const rankedSorted = Array.isArray(communitiesMembersList)
    ? communitiesMembersList.map((member: MembersList, index: number) => ({
        ...member,
        rank: index + 1,
      }))
    : [];

  const leaderboardRenderData = rankedSorted?.map((player: MembersList) => {
    const formattedUserAddress = `${player.user_address.slice(0, 10)}...`;
    return {
      rank: (
        <div className="relative flex w-min items-center justify-center">
          <RankIcon
            width={28}
            height={28}
            color={getRankIconColor(player.rank)}
          />
          <span
            className="absolute text-xs"
            style={{ color: getRankTextColor(player.rank) }}
          >
            {player.rank}
          </span>
        </div>
      ),

      address: <CommunityTableCell issuerAddress={formattedUserAddress} />,
      points: (
        <span style={{ color: getPointsTextColor(player.rank) }}>
          {player.points}
        </span>
      ),
      badges: (
        <div className="flex flex-row items-center gap-1">
          <span style={{ color: getPointsTextColor(player.rank) }}>
            {player.badges}
          </span>
          <span className="text-whiteOpacity05">
            {player.points} / {player.badges_count}
          </span>
        </div>
      ),
    };
  });

  return (
    <div className="px-12">
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
        headers={["rank", "address", "points", "badges"]}
        headersClassnames={["w-[8%]"]}
        data={leaderboardRenderData}
      ></CustomTable>
    </div>
  );
}
