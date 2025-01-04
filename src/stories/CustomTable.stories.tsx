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
          "GD6IAJEYOCPKJYTYVRJU75TXJGYUW7Z2ONMMJKXF2BFVGCMS3SQDFYWS"
        ),
      },
      {
        badgeName: "Stellar Quests",
        issuer: (
          <div className="bg-red-500 h-full w-full">This is a custom cell</div>
        ),
      },
      {
        badgeName: "Stellar Quests",
        issuer: (
          <div className="bg-green-500 h-full w-full">
            This is a custom cell
          </div>
        ),
      },
      {
        badgeName: (
          <div className="flex flex-col">
            <div className="bg-blue-500 h-full w-full">
              <span>This is a custom cell</span>
            </div>
            <div className="bg-purple-500 h-full w-full">
              <span>This is a custom cell</span>
            </div>
          </div>
        ),
        issuer: (
          <div className="bg-yellow-500 h-full w-full items-center justify-center flex">
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
