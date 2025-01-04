import Image from "next/image";
import Link from "next/link";
import { ConnectStellarWallet } from "../auth/ConnectStellarWallet";
import { useUsersContext } from "../user/Context";
import { useRouter } from "next/router";
import cc from "classcat";
import React from "react";

export const DappHeader = () => {
  const { userScore } = useUsersContext();
  const router = useRouter();
  const path = router.pathname;
  return (
    <div className="w-screen flex items-center mx-auto px-6 pb-0 max-w-[100vw] h-[72px] justify-between border-t-none border border-r-none border-l-none border-whiteOpacity008 bg-brandBlack">
      <div className="flex h-full items-center gap-6">
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
                { "tab-active": path.includes("issue-badge") },
                "tab p-2 px-4 items-center flex",
              ])}
              onClick={() => router.push("/issue-badge")}
            >
              <span>Issue Badge</span>
            </div>
            <div
              className={cc([
                { "tab-active": path.includes("verify-reputation") },
                "tab p-2 px-4 items-center flex",
              ])}
              onClick={() => router.push("/verify-reputation")}
            >
              <span>Verify Reputation</span>
            </div>
            <div
              className={cc([
                { "tab-active": path.includes("faq") },
                "tab p-2 px-4 items-center flex",
              ])}
              onClick={() => router.push("/faq")}
            >
              <span>FAQ</span>
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
