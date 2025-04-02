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

export default function LeaderboardTable({ communitiesMembersList }: any) {
  const searchedLeadboardData: LeaderboardPlayer[] = [
    {
      rank: 1,
      address: "GD6IAJEYOCPKJYTYVRJU75TXJGYUW7Z2ONMMJKXF2BFVGCMS3SQDFYWS",
      points: 500,
      badges: 20,
      avatarUrl:
        "https://gravatar.com/avatar/a67431cf87eabee9b1f61c145e2fa6d3?s=200&d=monsterid&r=x",
    },
    {
      rank: 2,
      address: "BL7IAJEYOCPKJYTYVRJU75TXJGYUW7Z2ONMMJKXF2BFVGCMS3SQDOWFT",
      points: 300,
      badges: 16,
      avatarUrl:
        "https://gravatar.com/avatar/a67431cf87eabee9b1f61c145e2fa6d3?s=200&d=monsterid&r=x",
    },
    {
      rank: 3,
      address: "AB3IAJEYOCPKJYTYVRJU75TXJGYUW7Z2ONMMJKXF2BFVGCMS3SQDFMNK",
      points: 150,
      badges: 12,
      avatarUrl:
        "https://gravatar.com/avatar/a67431cf87eabee9b1f61c145e2fa6d3?s=200&d=monsterid&r=x",
    },
    {
      rank: 4,
      address: "LM2IAJEYOCPKJYTYVRJU75TXJGYUW7Z2ONMMJKXF2BFVGCMS3SQDFMNK",
      points: 130,
      badges: 10,
      avatarUrl:
        "https://gravatar.com/avatar/a67431cf87eabee9b1f61c145e2fa6d3?s=200&d=monsterid&r=x",
    },
    {
      rank: 5,
      address: "NJ0IAJEYOCPKJYTYVRJU75TXJGYUW7Z2ONMMJKXF2BFVGCMS3SQDFMNK",
      points: 90,
      badges: 8,
      avatarUrl:
        "https://gravatar.com/avatar/a67431cf87eabee9b1f61c145e2fa6d3?s=200&d=monsterid&r=x",
    },
  ];

  const rankedSorted = Array.isArray(communitiesMembersList)
    ? communitiesMembersList.map((member: MembersList, index: number) => ({
      ...member,
      rank: index + 1,
    }))
    : [];


  const leaderboardRenderData = rankedSorted?.map((player: MembersList) => {
    const formattedUserAddress = `${player.user_address.slice(0, 10)}...`
    return ({
      rank: (
        <div className="flex justify-center items-center relative w-min">
          <RankIcon
            width={28}
            height={28}
            color={getRankIconColor(player.rank)}
          />
          <span
            className="text-xs absolute"
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
          <span className="text-whiteOpacity05">/ 20</span>
        </div>
      ),
    })
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
