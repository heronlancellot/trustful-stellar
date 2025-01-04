import type { Meta, StoryObj } from "@storybook/react";
import "@/styles/card-link.css";
import { AttestationBadge } from "@/components/atoms/AttestationBadge";
import { StarIcon } from "@/components/atoms/icons/StarIcon";
import { CalculatorIcon } from "@/components/atoms/icons/CalculatorIcon";
import { CardWrapper } from "@/components/templates/CardWrapper";

const meta = {
  title: "TrustfulStellar/CardWrapper",
  component: CardWrapper,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "select" },
  },
  args: { children: <></> },
} satisfies Meta<typeof CardWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyWrapper: Story = {
  args: {
    children: <></>,
  },
};

export const WrapperWith2Cards: Story = {
  args: {
    children: [
      <AttestationBadge
        key={1}
        icon={StarIcon}
        title="Stellar Quest"
        imported={false}
      />,
      <AttestationBadge
        key={2}
        icon={CalculatorIcon}
        title="Soroban Quest"
        imported={true}
      />,
    ],
  },
};

export const WrapperWith4Cards: Story = {
  args: {
    children: [
      <AttestationBadge
        key={1}
        icon={StarIcon}
        title="Stellar Quest"
        imported={false}
      />,
      <AttestationBadge
        key={2}
        icon={CalculatorIcon}
        title="Soroban Quest"
        imported={true}
      />,
      <AttestationBadge
        key={3}
        icon={StarIcon}
        title="Stellar Quest"
        imported={false}
      />,
      <AttestationBadge
        key={4}
        icon={CalculatorIcon}
        title="Soroban Quest"
        imported={true}
      />,
    ],
  },
};

export const WrapperWith6Cards: Story = {
  args: {
    children: [
      <AttestationBadge
        key={1}
        icon={StarIcon}
        title="Stellar Quest"
        imported={false}
      />,
      <AttestationBadge
        key={2}
        icon={CalculatorIcon}
        title="Soroban Quest"
        imported={true}
      />,
      <AttestationBadge
        key={3}
        icon={StarIcon}
        title="Stellar Quest"
        imported={false}
      />,
      <AttestationBadge
        key={4}
        icon={CalculatorIcon}
        title="Soroban Quest"
        imported={true}
      />,
      <AttestationBadge
        key={5}
        icon={StarIcon}
        title="Stellar Quest"
        imported={false}
      />,
      <AttestationBadge
        key={6}
        icon={CalculatorIcon}
        title="Soroban Quest"
        imported={true}
      />,
    ],
  },
};
