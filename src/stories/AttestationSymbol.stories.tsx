import type { Meta, StoryObj } from "@storybook/react";
import "@/styles/card-link.css";
import { AttestationSymbol } from "@/components/atoms/AttestationSymbol";

const meta = {
  title: "TrustfulStellar/AttestationSymbol",
  component: AttestationSymbol,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "select" },
  },
  args: { children: <></> },
} satisfies Meta<typeof AttestationSymbol>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckedSymbol: Story = {
  args: {
    checked: true,
  },
};

export const NonCheckedSymbol: Story = {
  args: {
    checked: false,
  },
};
