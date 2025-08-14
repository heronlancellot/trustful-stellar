/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CardLink } from "@/components/atoms/CardLink";
import { BlockfulCredits } from "@/components/atoms/homepage/BlockfulCredits";
import { ArrowRightIcon } from "@/components/atoms/icons/ArrowRightIcon";
import { CommunitiesIcon } from "@/components/atoms/icons/CommunitiesIcon";
import { VerifyReputationIcon } from "@/components/atoms/icons/VerifyReputationIcon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback } from "react";
import tailwindConfig from "tailwind.config";
import backgroundHome from "public/home/background-home.png";
import { DappHeader } from "@/components/organisms/DappHeader";
import { useAuthContext } from "@/components/auth/Context";

interface NavigationAction {
  path: string;
  title: string;
  icon: ReactNode;
}

export default function HomePage(): JSX.Element {
  const router = useRouter();
  const { userAddress } = useAuthContext();
  const searchParams = new URLSearchParams();

  const handleNavigation = useCallback(
    (path: string) => {
      if (path === "/verify-reputation" && userAddress) {
        searchParams.set("searchAddress", userAddress || "");
        router.push(`${path}?${searchParams.toString()}`);
      } else {
        router.push(path);
      }
    },
    [router, userAddress],
  );

  const navigationActions: NavigationAction[] = [
    {
      path: "/communities",
      title: "Communities",
      icon: (
        <CommunitiesIcon
          color={tailwindConfig.theme.extend.colors.brandGreen}
        />
      ),
    },
    {
      path: "/verify-reputation",
      title: "Verify Reputation",
      icon: (
        <VerifyReputationIcon
          color={tailwindConfig.theme.extend.colors.brandGreen}
        />
      ),
    },
  ];

  const actionIcon = (
    <ArrowRightIcon color={tailwindConfig.theme.extend.colors.brandBlack} />
  );

  return (
    <div className="z-10 flex h-screen w-screen flex-col overflow-hidden bg-brandBlack">
      <div className="z-20 h-fit w-full">
        <DappHeader />
      </div>
      {/* Background Layer */}
      <Image
        alt="Hero Background"
        src={backgroundHome}
        fill={true}
        quality={100}
        style={{
          objectFit: "cover",
          backgroundPosition: "top left",
          backgroundSize: "cover",
          zIndex: 0,
          left: "-20vw",
          opacity: 0.3,
        }}
      />
      <main className="z-10 flex h-screen w-screen flex-col px-4 py-4 sm:flex-row sm:px-[60px] sm:py-[80px]">
        <section className="flex flex-1 flex-col justify-between">
          <div className="max-w-md">
            <h1 className="font-space-grotesk text-6xl leading-tight text-brandWhite sm:text-7xl">
              Online reputation made easy
            </h1>
          </div>

          <footer className="hidden w-full max-w-lg sm:flex">
            <BlockfulCredits />
          </footer>
        </section>

        <aside className="flex flex-1 flex-col gap-8 lg:justify-between xl:justify-center">
          {navigationActions.map(({ path, title, icon }) => (
            <CardLink
              key={path}
              title={title}
              mainIcon={icon}
              actionIcon={actionIcon}
              onClick={() => handleNavigation(path)}
              className="transition-transform duration-200 hover:scale-[1.02]"
            />
          ))}
        </aside>
        <footer className="mt-4 flex w-full max-w-lg justify-center sm:hidden">
          <BlockfulCredits />
        </footer>
      </main>
    </div>
  );
}
