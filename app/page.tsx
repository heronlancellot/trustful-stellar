'use client';

import { CardLink } from '@/components/atoms/CardLink';
import { BlockfulCredits } from '@/components/atoms/homepage/BlockfulCredits';
import { ArrowRightIcon } from '@/components/atoms/icons/ArrowRightIcon';
import { CommunitiesIcon } from '@/components/atoms/icons/CommunitiesIcon';
import { VerifyReputationIcon } from '@/components/atoms/icons/VerifyReputationIcon';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback } from 'react';
import tailwindConfig from 'tailwind.config';
import backgroundHome from 'public/home/background-home.png';
import { DappHeader } from '@/components/organisms/DappHeader';

interface NavigationAction {
  path: string;
  title: string;
  icon: ReactNode;
}

export default function HomePage(): JSX.Element {
  const router = useRouter();

  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const navigationActions: NavigationAction[] = [
    {
      path: '/communities',
      title: 'Communities',
      icon: (
        <CommunitiesIcon
          color={tailwindConfig.theme.extend.colors.brandGreen}
        />
      ),
    },
    {
      path: '/verify-reputation',
      title: 'Verify Reputation',
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
    <div className="w-screen flex flex-col h-screen overflow-hidden bg-brandBlack z-10">
      <div className="w-full h-fit z-10">
        <DappHeader />
      </div>
      {/* Background Layer */}
      <Image
        alt="Hero Background"
        src={backgroundHome}
        fill={true}
        quality={100}
        style={{
          objectFit: 'cover',
          backgroundPosition: 'top left',
          backgroundSize: 'cover',
          zIndex: 0,
          left: '-20vw',
          opacity: 0.3,
        }}
      />
      <main className="w-screen h-screen flex z-10 px-[60px] py-[80px]">
        <section className="flex flex-1 flex-col justify-between ">
          <div className="max-w-md">
            <h1 className="font-space-grotesk text-7xl leading-tight text-brandWhite">
              Online reputation made easy
            </h1>
          </div>

          <footer className="w-full max-w-lg">
            <BlockfulCredits />
          </footer>
        </section>

        <aside className="flex flex-1 flex-col lg:justify-between xl:justify-center gap-8 ">
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
      </main>
    </div>
  );
}
