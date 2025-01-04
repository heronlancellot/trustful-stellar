import { GenericModal, StarIcon } from "@/components";
import { AttestationSymbol } from "@/components/atoms/AttestationSymbol";
import { WalletIcon } from "@/components/atoms/icons/WalletIcon";
import { ImportBadgesModalContent } from "@/components/molecules/ImportBadgesModalContent";
import type { Meta, StoryObj } from "@storybook/react";
import tailwindConfig from "tailwind.config";

const meta = {
  title: "TrustfulStellar/GenericModal",
  component: GenericModal,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: "text" },
    buttonLabel: { control: "text" },
    children: { control: "select" },
    isOpen: { control: "boolean" },
  },
  args: {
    isOpen: true,
    children: <></>,
    onClose: () => {},
    title: "My modal title",
    buttonLabel: "My custom label",
    onButtonClick: () => {},
  },
} satisfies Meta<typeof GenericModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenedModal: Story = {
  args: {
    children: <></>,
    isAsync: false,
  },
};

export const ModalWithContent: Story = {
  args: {
    children: (
      <div>
        <p className="p-8">Any content wanted</p>
      </div>
    ),
    isAsync: false,
  },
};

export const ModalWithoutTitle: Story = {
  args: {
    title: "",
    isAsync: false,
  },
};

export const ModalWithCustomTitle: Story = {
  args: {
    title: "My custom title",
    isAsync: false,
  },
};

export const ModalWithCustomActionOnClose: Story = {
  args: {
    onClose: () => alert("Close modal action executed"),
    isAsync: false,
  },
};

export const ModalWithCustomActionOnCtaClick: Story = {
  args: {
    onButtonClick: () => new Promise((res, rej) => alert("Did something")),
    isAsync: false,
  },
};

export const ModalWithCustomCtaLabel: Story = {
  args: {
    buttonLabel: "My custom label",
    isAsync: false,
  },
};

export const ClosedModal: Story = {
  args: {
    isOpen: false,
    isAsync: false,
  },
};

export const ConnectWalletModal: Story = {
  args: {
    isOpen: true,
    buttonLabel: "Connect",
    title: "Connect Wallet",
    children: (
      <div className="p-2 w-full h-full items-center justify-center flex flex-col">
        <div className="my-8 p-8 pt-6 w-[150px] h-[150px] rounded-full bg-whiteOpacity005 items-center justify-center">
          <WalletIcon
            color={tailwindConfig.theme.extend.colors.brandGreen}
          ></WalletIcon>
        </div>
        <div className="text-center">
          <span>
            Please connect your wallet to import badges from GitHub Soroban.
          </span>
        </div>
      </div>
    ),
    isAsync: false,
  },
};

export const ImportBadgesModal: Story = {
  args: {
    isOpen: true,
    buttonLabel: "Import",
    title: "Import attestations",
    children: (
      <ImportBadgesModalContent
        badges={[
          {
            title: "L1: Payment Operations",
            description: "",
            isImported: true,
            assetCode: "A",
            score: 10,
          },
          {
            title: "L2: Configuration Operations",
            description: "",
            isImported: true,
            assetCode: "A",
            score: 10,
          },
          {
            title: "L3: Advanced Operations",
            description: "",
            isImported: false,
            assetCode: "A",
            score: 10,
          },
          {
            title: "Side Quest 1",
            description: "",
            isImported: true,
            assetCode: "A",
            score: 10,
          },
          {
            title: "Side Quest 2",
            description: "",
            isImported: false,
            assetCode: "A",
            score: 10,
          },
          {
            title: "Side Quest 3",
            description: "",
            isImported: false,
            assetCode: "A",
            score: 10,
          },
        ]}
        title="Stellar Quest"
        icon={<StarIcon></StarIcon>}
      />
    ),
    isAsync: false,
  },
};
