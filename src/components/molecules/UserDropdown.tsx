"use client";

import { useState, useRef, useEffect } from "react";
import { DisconnectIcon, UserIcon } from "@/components/atoms";
import { useAuthContext } from "@/components/auth/Context";
import tailwindConfig from "tailwind.config";
import cc from "classcat";
import { getEllipsedAddress } from "@/lib/utils/getEllipsedAddress";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setUserAddress, userAddress } = useAuthContext();
  const queryClient = useQueryClient();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleProfileClick = () => {
    if (!userAddress) return;
    const searchParams = new URLSearchParams();
    searchParams.set("searchAddress", userAddress);
    router.push(`/verify-reputation?${searchParams.toString()}`);
    setIsOpen(false);
  };

  const disconnect = () => {
    setUserAddress("");
    setIsOpen(false);
    queryClient.clear();
    router.push("/");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="user-menu"
      >
        <div
          className={cc([
            {
              "border bg-whiteOpacity008 text-brandWhite": !isOpen,
              "bg-brandGreen text-brandBlack": isOpen,
            },
            "rounded-lg border-whiteOpacity008 p-2",
          ])}
        >
          <div className="flex items-center justify-center gap-2">
            <UserIcon
              className="w-7"
              color={
                isOpen
                  ? tailwindConfig.theme.extend.colors.brandBlack
                  : tailwindConfig.theme.extend.colors.brandGreen
              }
            />
            <h2 className="hidden sm:flex">
              {getEllipsedAddress(userAddress || "")}
            </h2>
          </div>
        </div>
      </button>

      {isOpen && (
        <div
          id="user-menu"
          className="absolute right-0 z-auto mt-2 w-fit origin-top-right rounded-md border border-whiteOpacity008 bg-brandBlack shadow-lg"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          <div>
            <button
              onClick={handleProfileClick}
              className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md p-3 text-left text-base transition-colors duration-300 hover:bg-whiteOpacity05"
              role="menuitem"
            >
              <div className="flex items-center justify-center gap-2">
                <UserIcon
                  className="w-7"
                  color={tailwindConfig.theme.extend.colors.brandGreen}
                />
                <h2>Profile</h2>
              </div>
            </button>
            <button
              onClick={disconnect}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md p-3 text-base transition-colors duration-300 hover:bg-whiteOpacity05"
              role="menuitem"
            >
              <DisconnectIcon
                color={tailwindConfig.theme.extend.colors.brandGreen}
                className="w-6"
              />
              <h2>Disconnect</h2>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
