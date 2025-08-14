import { SearchIcon } from "@/components/atoms/icons/SearchIcon";
import { TableEmptyScreen } from "@/components/atoms/TableEmptyScreen";
import { SearchBar } from "@/components/search/SearchBar";
import { CustomTable } from "@/components/organisms/CustomTable";
import { getEllipsedAddress } from "@/lib/utils/getEllipsedAddress";
import { Meta, StoryObj } from "@storybook/react/*";
import { useState } from "react";
import tailwindConfig from "tailwind.config";

type TableObject = {
  badgeName: string;
  issuer: string;
};

const meta = {
  title: "TrustfulStellar/CustomTable",
  component: CustomTable,
  parameters: {
    layout: "centered",
  },
  args: {
    childrenForEmptyTable: <></>,
    data: [],
  },
} satisfies Meta<typeof CustomTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomTableWithCustomCells: Story = {
  args: {
    headers: ["badgeName", "issuer"],
    data: [
      {
        badgeName: "Stellar Quests",
        issuer: getEllipsedAddress(
          "GD6IAJEYOCPKJYTYVRJU75TXJGYUW7Z2ONMMJKXF2BFVGCMS3SQDFYWS",
        ),
      },
      {
        badgeName: "Stellar Quests",
        issuer: (
          <div className="h-full w-full bg-red-500">This is a custom cell</div>
        ),
      },
      {
        badgeName: "Stellar Quests",
        issuer: (
          <div className="h-full w-full bg-green-500">
            This is a custom cell
          </div>
        ),
      },
      {
        badgeName: (
          <div className="flex flex-col">
            <div className="h-full w-full bg-blue-500">
              <span>This is a custom cell</span>
            </div>
            <div className="h-full w-full bg-purple-500">
              <span>This is a custom cell</span>
            </div>
          </div>
        ),
        issuer: (
          <div className="flex h-full w-full items-center justify-center bg-yellow-500">
            This is a custom cell
          </div>
        ),
      },
    ] as TableObject[],
  },
  render: (args) => {
    return (
      <div className="w-[800px]">
        <CustomTable {...args}></CustomTable>
      </div>
    );
  },
};

export const CustomTableWithEmptyData: Story = {
  args: {
    childrenForEmptyTable: (
      <TableEmptyScreen
        icon={
          <SearchIcon
            color={tailwindConfig.theme.extend.colors.whiteOpacity05}
          />
        }
        title="Search to start"
        description="Check a user's reputation by searching for their address"
      />
    ),
    headers: ["badgeName", "issuer"],
    data: [],
  },
  render: (args) => {
    return (
      <div className="w-[800px]">
        <CustomTable {...args}></CustomTable>
      </div>
    );
  },
};
