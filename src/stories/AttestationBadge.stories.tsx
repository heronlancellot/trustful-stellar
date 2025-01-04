import type { Meta, StoryObj } from "@storybook/react";
import "@/styles/card-link.css";
import { AttestationBadge } from "@/components/atoms/AttestationBadge";
import { StarIcon } from "@/components/atoms/icons/StarIcon";
import { CalculatorIcon } from "@/components/atoms/icons/CalculatorIcon";

const meta = {
  title: "TrustfulStellar/AttestationBadge",
  component: AttestationBadge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "select" },
  },
  args: { children: <></> },
} satisfies Meta<typeof AttestationBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyAttestationBadge: Story = {
  args: {
    title: "",
    imported: false,
    icon: () => <></>,
  },
};

export const AttestationBadgeStellarQuest: Story = {
  args: {
    icon: StarIcon,
    title: "Stellar Quest",
    imported: true,
  },
};

export const AttestationBadgeSorobanQuest: Story = {
  args: {
    children: <div className="w-20 h-20"></div>,
    icon: CalculatorIcon,
    title: "Soroban Quest",
    imported: false,
  },
};
