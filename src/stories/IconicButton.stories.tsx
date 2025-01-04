import { IconicButton, ArrowIcon } from "@/components/atoms";
import type { Meta, StoryObj } from "@storybook/react";
import { IconPosition } from "@/types/iconPosition";
import tailwindConfig from "tailwind.config";

const meta = {
  title: "TrustfulStellar/IconicButton",
  component: IconicButton,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    label: { control: "select" },
  },
  args: {
    icon: <ArrowIcon color={tailwindConfig.theme.extend.colors.brandBlack} />,
    label: "Label",
    onClick: () => {},
    isLoading: false,
  },
} satisfies Meta<typeof IconicButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonWithIconInTheLeft: Story = {
  args: {
    icon: <ArrowIcon color={tailwindConfig.theme.extend.colors.brandBlack} />,
    label: "My custom label",
    onClick: () => {},
  },
};

export const ButtonWithIconInTheRight: Story = {
  args: {
    icon: <ArrowIcon color={tailwindConfig.theme.extend.colors.brandBlack} />,
    label: "My custom label",
    onClick: () => {},
    iconPosition: IconPosition.RIGHT,
  },
};

export const ImportButtonExample: Story = {
  args: {
    icon: <ArrowIcon color={tailwindConfig.theme.extend.colors.brandBlack} />,
    label: "Import",
    onClick: () => alert("Execute import action"),
  },
};

export const ReimportButtonExample: Story = {
  args: {
    icon: (
      <div className="transform rotate-180">
        <ArrowIcon color={tailwindConfig.theme.extend.colors.brandBlack} />
      </div>
    ),
    label: "Re-import",
    onClick: () => alert("Execute re-import action"),
  },
};

export const ButtonIsLoading: Story = {
  args: {
    icon: <ArrowIcon color={tailwindConfig.theme.extend.colors.brandBlack} />,
    label: "My custom label",
    onClick: () => {},
    isLoading: true,
  },
};
