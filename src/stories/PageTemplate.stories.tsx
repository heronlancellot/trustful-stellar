import { IconicButton, ArrowIcon } from "@/components/atoms";
import type { Meta, StoryObj } from "@storybook/react";
import { IconPosition } from "@/types/iconPosition";
import { PageTemplate } from "@/components/templates/PageTemplate";
import { ContentTabs } from "@/components";

const meta = {
  title: "TrustfulStellar/PageTemplate",
  component: PageTemplate,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof PageTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageTemplateWithNoContentTabs: Story = {
  args: {
    title: "Page Template With No ContentTabs",
    className: "",
    children: <div className="text-left p-2 pl-12 bg-whiteOpacity05 h-full w-screen text-brandBlack">Hey! This is a Children of Page Template</div>
  },
};

export const PageTemplateWithContentTabs: Story = {
    args: {
      title: "Page Template ContentTabs",
      className: "",
      children: <ContentTabs tabs={{
        "Import": {
          content: (
            <div className="flex w-full h-full min-h-[300px] justify-center items-center bg-green-500 text-brandBlack">
              Hey
            </div>
          ),
          tabNumber: 1,
        },
        "Create new": {
          content: (
            <div className="flex w-full h-full min-h-[300px] justify-center items-center bg-gray-800">
              Hey 2
            </div>
          ),
          tabNumber: 2,
        },
      }}> </ContentTabs>
    },
  };
  