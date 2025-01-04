import { CardTemplate, IconicButton } from "../components/index"
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "TrustfulStellar/CardTemplate",
  component: CardTemplate,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "select" },
  },
  args: { children: <></> },
} satisfies Meta<typeof CardTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyCard: Story = {
  args: { children: <div className="w-20 h-20"></div> },
};

export const CardWithContent: Story = {
  args: {
    children: (
      <div className="p-3 flex flex-col">
        <p className="p-4">Any content wanted</p>
      </div>
    ),
  },
};

export const CardWithButton: Story = {
  args: {
    children: (
      <div className="p-3 flex flex-col">
        <p className="p-4">Any content wanted</p>
        <IconicButton label="My custom label" onClick={() => alert("Do anything")} />
      </div>
    ),
  },
};
