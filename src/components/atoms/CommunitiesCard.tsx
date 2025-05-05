import cc from 'classcat';
import React, { useEffect } from 'react';
import { Communities } from '@/types/communities';
import {
  InformationIcon,
  PlusIcon,
  StarIcon,
  TagIcon,
  UserIcon,
} from './icons';
import { useStellarContract } from '@/lib/stellar/transactions/hooks/useStellarContract';
import { kit } from '../auth/ConnectStellarWallet';
import { ALBEDO_ID } from '@creit.tech/stellar-wallets-kit';
import { checkIfWalletIsInitialized } from '@/lib/stellar/isFundedStellarWallet';
import toast from 'react-hot-toast';
import { useAuthContext } from '../auth/Context';
import { Minus } from 'lucide-react';
import { CakeIcon } from './icons/CakeIcon';
import { useQueryClient } from '@tanstack/react-query';
import { useCommunityContext } from '../community/Context';

interface CommunitiesCardProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onClick'> {
  community: Communities;
  onClick?: () => void;
  currentTab?: 'all' | 'joined' | 'created' | 'hidden';
}

export const CommunitiesCard: React.FC<CommunitiesCardProps> = ({
  community,
  className,
  onClick,
  currentTab = 'all',
  ...props
}) => {
  const { userAddress, setUserAddress } = useAuthContext();
  const queryClient = useQueryClient();
  const { getCommunities } = useCommunityContext();

  const formattedContractAddress = community.community_address.toUpperCase();

  const hideExitButton =
    (currentTab === 'joined' || currentTab === 'all') &&
    userAddress &&
    community.creator_address.toLocaleLowerCase() ===
    userAddress.toLocaleLowerCase();

  const stellarContractJoinCommunities = useStellarContract({
    contractId: formattedContractAddress,
    rpcUrl:
      process.env.NEXT_PUBLIC_RPCURL || 'https://soroban-testnet.stellar.org',
    networkType: (process.env.NEXT_PUBLIC_NETWORK_TYPE || 'TESTNET') as any,
  });

  const handleJoin = async () => {
    if (!userAddress) {
      toast.error('Please connect your wallet first');
      return;
    }
    try {
      const result = await stellarContractJoinCommunities.addUser();
      if (result.success) {
        toast.success('Successfully joined community');
        console.log('Transaction successful:', result.txHash);

        queryClient.invalidateQueries({ queryKey: ['communities'] });
        queryClient.invalidateQueries({
          queryKey: ['communities', 'joined', userAddress],
        });
        queryClient.invalidateQueries({
          queryKey: [
            'community-details',
            community.community_address,
            userAddress,
          ],
        });

        await getCommunities();

        setTimeout(() => {
          queryClient.resetQueries();
        }, 500);

        const currentData = queryClient.getQueryData([
          'communities',
          userAddress,
        ]) as Communities[] | undefined;
        if (currentData) {
          const updatedData = currentData.map(c =>
            c.community_address === community.community_address
              ? { ...c, is_joined: true }
              : c
          );
          queryClient.setQueryData(['communities', userAddress], updatedData);
        }
      } else {
        toast.error('Failed to join community');
        console.error('Transaction failed:', result.error);
      }
    } catch (error) {
      toast.error(
        "Can't find your wallet registry, make sure you're trying to connect an initialized(funded) wallet"
      );
      setUserAddress('');
    }
  };

  const handleExit = async () => {
    if (!userAddress) {
      toast.error('Please connect your wallet first');
      return;
    }
    try {
      const result = await stellarContractJoinCommunities.removeUser();

      if (result.success) {
        toast.success('Successfully left community');
        console.log('Transaction successful:', result.txHash);

        queryClient.invalidateQueries({ queryKey: ['communities'] });
        queryClient.invalidateQueries({
          queryKey: ['communities', 'joined', userAddress],
        });
        queryClient.invalidateQueries({
          queryKey: [
            'community-details',
            community.community_address,
            userAddress,
          ],
        });

        await getCommunities();

        setTimeout(() => {
          queryClient.resetQueries();
        }, 500);

        const currentData = queryClient.getQueryData([
          'communities',
          userAddress,
        ]) as Communities[] | undefined;
        if (currentData) {
          const updatedData = currentData.map(c =>
            c.community_address === community.community_address
              ? { ...c, is_joined: false }
              : c
          );
          queryClient.setQueryData(['communities', userAddress], updatedData);
        }
      } else {
        toast.error('Failed to leave community');
        console.error('Transaction failed:', result.error);
      }
    } catch (error) {
      toast.error(
        "Can't find your wallet registry, make sure you're trying to connect an initialized(funded) wallet"
      );
      setUserAddress('');
    }
  };

  return (
    <div
      className={cc([
        'group rounded-lg flex flex-col border border-whiteOpacity008 max-w-sm w-[376px] h-[212px] bg-whiteOpacity005 hover:bg-whiteOpacity008 transition-colors duration-300 ease-linear',
        className,
      ])}
      {...props}
      style={{ boxSizing: 'border-box' }}
    >
      <div className="flex  justify-between items-center p-3">
        <div className="w-[38px] h-[38px] p-2 rounded-full bg-whiteOpacity008 flex items-center justify-center overflow-hidden">
          <div className="w-4 h-4 ">
            {community?.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={community?.icon}
                alt="icon image"
                width={24}
                height={24}
              />
            ) : (
              <CakeIcon />
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div>
            <button
              className="overflow-hidden w-8 h-8 group-hover:w-16 bg-whiteOpacity005 bg-opacity-25 text-lime-400 flex items-center justify-center gap-2 group-hover:justify-start px-3 rounded-md hover:bg-whiteOpacity008 transition-all duration-300 ease-in-out"
              onClick={onClick}
            >
              {' '}
              <div className="flex justify-center items-center">
                <InformationIcon className="transition-all duration-500 ease-in-out" />
                <span className="hidden font-inter text-sm group-hover:inline-block ml-2  group-hover:opacity-100 transition-all duration-500 ease-in-out">
                  Info
                </span>
              </div>
            </button>
          </div>

          {currentTab !== 'created' && currentTab !== 'hidden' && !hideExitButton && (
            <div>
              <button
                className={cc([
                  'overflow-hidden w-8 h-8 group-hover:w-16 bg-whiteOpacity005 bg-opacity-25 text-lime-400 flex items-center justify-center group-hover:justify-start px-2 rounded-md hover:bg-whiteOpacity008 transition-all duration-300 ease-in-out',
                  { 'opacity-50 cursor-not-allowed': !userAddress },
                ])}
                disabled={!userAddress}
              >
                {!('is_joined' in community) ? (
                  <div className="flex justify-center items-center">
                    <Minus className="transition-all duration-500 ease-in-out" />
                    <span
                      className="hidden font-inter text-sm group-hover:inline-block ml-2 group-hover:opacity-100 transition-all duration-500 ease-in-out"
                      onClick={handleExit}
                    >
                      Exit
                    </span>
                  </div>
                ) : community.is_joined ? (
                  <div className="flex justify-center items-center">
                    <Minus className="transition-all duration-500 ease-in-out" />
                    <span
                      className="hidden font-inter text-sm group-hover:inline-block group-hover:opacity-100 transition-all duration-500 ease-in-out "
                      onClick={handleExit}
                    >
                      Exit
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    <PlusIcon className="transition-all duration-500 ease-in-out" />
                    <span
                      className="hidden font-inter text-sm group-hover:inline-block ml-2 group-hover:opacity-100 transition-all duration-500 ease-in-out"
                      onClick={handleJoin}
                    >
                      Join
                    </span>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col p-3 gap-1 justify-center">
        <div className="title">
          <span className="text-lg font-inter font-medium border-s-violet-600">
            {community?.name}
          </span>
        </div>
        <div className="description">
          <span className="font-inter font-normal text-sm block overflow-hidden text-ellipsis text-whiteOpacity05">
            {community?.description}
          </span>
        </div>

        <div className="flex flex-start mt-10 gap-3">
          <div className="flex items-center text-xs justify-center gap-1">
            <div className="w-3 h-3">
              <UserIcon />
            </div>
            <div className="flex justify-center">
              <span>{community?.total_badges}</span>
            </div>
          </div>

          <div className="flex items-center text-xs justify-center gap-2">
            <div className=" w-3 h-3">
              <TagIcon />
            </div>
            <div className="flex justify-center">
              <span>{community?.total_badges}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
