"use client";

import Image from "next/image";
import Link from "next/link";
import { ConnectStellarWallet } from "@/components/auth/ConnectStellarWallet";
import { useUsersContext } from "@/components/user/Context";
import { useRouter, usePathname } from "next/navigation";
import cc from "classcat";
import { useAuthContext } from "@/components/auth/Context";

export const DappHeader = () => {
  const { userScore } = useUsersContext();
  const router = useRouter();
  const path = usePathname();
  const { userAddress } = useAuthContext();
  return (
    <div className="border-t-none border-r-none border-l-none z-10 mx-auto flex h-[72px] w-full max-w-[100vw] items-center justify-between border border-whiteOpacity008 bg-brandBlack px-6 pb-0">
      <div className="scrollbar-hide flex h-full items-center gap-6 overflow-x-auto">
        <Link href="/">
          <Image
            alt="Trustful Stellar Icon"
            src="/trustful-logo.svg"
            height={20}
            width={103}
          />
        </Link>
        {path !== "/" && (
          <div className="flex h-full">
            <div
              className={cc([
                { "tab-active": path.includes("communities") },
                "tab flex cursor-pointer items-center p-2 px-4",
              ])}
              onClick={() => router.push("/communities?status=all")}
            >
              <span className="cursor-pointer">Communities</span>
            </div>
            <div
              className={cc([
                { "tab-active": path.includes("verify-reputation") },
                "tab flex cursor-pointer items-center p-2 px-4",
              ])}
              onClick={() => {
                if (!userAddress) return;
                const searchParams = new URLSearchParams();
                searchParams.set("searchAddress", userAddress);
                router.push(`/verify-reputation?${searchParams.toString()}`);
              }}
            >
              <span className="cursor-pointer">Verify Reputation</span>
            </div>
            <div
              className={cc([
                { "tab-active": path.includes("faq") },
                "tab flex cursor-pointer items-center p-2 px-4",
              ])}
              onClick={() => router.push("/faq")}
            >
              <span className="cursor-pointer">FAQ</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row">
        {userScore !== undefined ? (
          <div className="p-3">
            <span className="text-whiteOpacity05">Points: {userScore}</span>
          </div>
        ) : (
          <></>
        )}
        <ConnectStellarWallet />
      </div>
    </div>
  );
};
