import { ContentTabs } from "../components/index";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "TrustfulStellar/ContentTabs",
  component: ContentTabs,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "select" },
  },
  args: { children: <></> },
} satisfies Meta<typeof ContentTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyContentTabs: Story = {
  args: { tabs: { "": { content: <></>, tabNumber: 0 } } },
};

export const ContentTabsWith2Tabs: Story = {
  args: {
    tabs: {
      "Import": {
        content: (
          <div className="flex w-full h-full min-h-[300px] justify-center items-center">
            Hey
          </div>
        ),
        tabNumber: 1,
      },
      "Create new": {
        content: (
          <div className="flex w-full h-full min-h-[300px] justify-center items-center">
            Hey 2
          </div>
        ),
        tabNumber: 2,
      },
    },
  },
};
