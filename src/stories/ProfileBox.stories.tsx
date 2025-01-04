import { SearchBar } from "@/components/search/SearchBar";
import { ProfileBox } from "@/components/organisms/ProfileBox";
import { Meta, StoryObj } from "@storybook/react/*";
import { useState } from "react";

const meta = {
  title: "TrustfulStellar/ProfileBox",
  component: ProfileBox,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-auto">
        <Story />
      </div>
    ),
  ],
  args: {
    userAddress: "",
    userBadgesQuantity: 0,
    onClear: () => {},
    isClearButtonVisible: false,
  },
} satisfies Meta<typeof ProfileBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProfileBoxWithNoUser: Story = {
  args: {
    placeholder: "Paste the address...",
    searchBar: <></>,
    isClearButtonVisible: undefined,
  },
  render: function (args) {
    const [value, setValue] = useState("");
    const onClear = (): void => {
      setValue("");
    };
    return (
      <div className="w-[1000px]">
        <ProfileBox
          {...args}
          onClear={onClear}
          isClearButtonVisible={!!value}
          searchBar={
            <SearchBar
              placeholder={"Paste the address..."}
              onButtonClick={(currentValue) => {
                alert("onButtonClick: " + currentValue);
              }}
              inputText={value}
              onChangeInputText={setValue}
            />
          }
        />
      </div>
    );
  },
};

export const ProfileBoxWithUser: Story = {
  args: {
    placeholder: "Paste the address...",
    searchBar: <></>,
    isClearButtonVisible: undefined,
    userAddress: "GD6IAJEYOCPKJYTYVRJU75TXJGYUW7Z2ONMMJKXF2BFVGCMS3SQDFYWS",
    userBadgesQuantity: 9,
  },
  render: function (args) {
    const [value, setValue] = useState("");
    const onClear = (): void => {
      setValue("");
    };
    return (
      <div className="w-[1000px]">
        <ProfileBox
          {...args}
          onClear={onClear}
          isClearButtonVisible={!!value}
          searchBar={
            <SearchBar
              placeholder={"Paste the address..."}
              onButtonClick={(currentValue) => {
                alert("onButtonClick: " + currentValue);
              }}
              inputText={value}
              onChangeInputText={setValue}
            />
          }
        />
      </div>
    );
  },
};
