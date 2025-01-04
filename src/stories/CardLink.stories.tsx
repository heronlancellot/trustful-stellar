import { CardLink } from "@/components/atoms/CardLink";
import type { Meta, StoryObj } from "@storybook/react";
import { BadgeIcon } from "@/components/atoms/icons/BadgeIcon";
import { ArrowRightIcon } from "@/components/atoms/icons/ArrowRightIcon";
import { DisconnectIcon, UserIcon } from "@/components";
import tailwindConfig from "tailwind.config";

const meta = {
  title: "TrustfulStellar/CardLink",
  component: CardLink,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "select" },
  },
  args: { children: <></> },
} satisfies Meta<typeof CardLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyCardLink: Story = {
  args: {
    children: <div className="w-20 h-20"></div>,
    mainIcon: <></>,
    title: "",
    actionIcon: <></>,
  },
};

export const CardLinkWithContent: Story = {
  args: {
    children: <div className="w-20 h-20"></div>,
    mainIcon: (
      <BadgeIcon color={tailwindConfig.theme.extend.colors.brandGreen} />
    ),
    title: "Verify reputation",
    actionIcon: (
      <ArrowRightIcon color={tailwindConfig.theme.extend.colors.brandBlack} />
    ),
  },
};

export const CardLinkWithDifferentContent: Story = {
  args: {
    children: <div className="w-20 h-20"></div>,
    mainIcon: (
      <UserIcon color={tailwindConfig.theme.extend.colors.brandGreen} />
    ),
    title: "Log Out",
    actionIcon: (
      <DisconnectIcon color={tailwindConfig.theme.extend.colors.brandBlack} />
    ),
  },
};
