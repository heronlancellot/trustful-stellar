import { DappHeader } from "@/components";
import { AuthProvider } from "@/components/auth/Context";
import { UserContextProvider } from "@/components/user/Context";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "TrustfulStellar/DappHeader",
  component: DappHeader,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DappHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function (args) {
    return (
      <AuthProvider>
        <UserContextProvider>
          <DappHeader />
        </UserContextProvider>
      </AuthProvider>
    );
  },
};
