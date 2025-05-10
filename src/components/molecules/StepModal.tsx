import { useAuthContext } from '@/components/auth/Context';
import { getEllipsedAddress } from '@/lib/utils/getEllipsedAddress';
import { useBadgeStore } from '@/store/badgeStore';
import albedo from '@albedo-link/intent';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Address,
  BASE_FEE,
  Networks,
  Operation,
  rpc,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { PlusIcon, StarIcon, TagIcon } from '../atoms/icons';
import { AlertIcon } from '../atoms/icons/AlertIcon';
import { AwardIcon } from '../atoms/icons/AwardIcon';
import { BankIcon } from '../atoms/icons/BankIcon';
import { CakeIcon } from '../atoms/icons/CakeIcon';
import { CloseIcon } from '../atoms/icons/CloseIcon';
import { EthereumIcon } from '../atoms/icons/EthereumIcon';
import { GithubIcon } from '../atoms/icons/GithubIcon';
import { HeartIcon } from '../atoms/icons/HeartIcon';
import { KeyIcon } from '../atoms/icons/KeyIcon';
import { TrashIcon } from '../atoms/icons/TrashIcon';
import { TrophyIcon } from '../atoms/icons/TrophyIcon';
import useBadgeInfoController, { Badge } from '../badge-info/hooks/Controller';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onConfirm: () => void;
}

interface BadgeOption {
  id: string;
  label: string;
}

const BADGE_OPTIONS: BadgeOption[] = [
  { id: 'stellar', label: 'Stellar' },
  { id: 'soroban', label: 'Soroban' },
  { id: 'blockful', label: 'Blockful' },
  { id: 'custom', label: 'Custom' },
];

const CustomBadge = () => {
  return (
    <div className="flex flex-row gap-2 p-4 bg-darkRedOpacity text-white rounded-lg shadow-lg max-w-md">
      <AlertIcon />
      <div>
        <p className="text-sm font-light">
          When creating custom badges, you will need to provide the issuer and
          other specific details such as the name of the asset.
        </p>
      </div>
    </div>
  );
};

const CustomHR = () => {
  return (
    <div className="w-full bg-whiteOpacity008 mb-4">
      <hr className="w-full h-[1px] border-whiteOpacity008" />
    </div>
  );
};

const createCommunitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z
    .string()
    .max(120, 'Description must be less than 120 characters'),
  avatar: z.string().min(1, 'Avatar is required'),
  badgeType: z.string().min(1, 'Badge is required'),
  badges: z.array(
    z.object({
      name: z.string().min(1, 'Required'),
      issuer: z.string().min(1, 'Required'),
      score: z.number().min(1, 'Required'),
    })
  ),
});

type CreateCommunityForm = z.infer<typeof createCommunitySchema>;

export const StepModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  onNext,
  onBack,
  onConfirm,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
    unregister,
  } = useForm<CreateCommunityForm>({
    mode: 'onBlur',
    resolver: zodResolver(createCommunitySchema),
  });
  const { userAddress } = useAuthContext();
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [selectedBadge, setSelectedBadge] = useState<string[]>([]);
  const [badgeCount, setBadgeCount] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getBadgesByTypes } = useBadgeInfoController();
  const [badgeTypeDetails, setBadgeTypeDetails] = useState<Badge[]>([]);
  const [loadingBadgeListType, setLoadingBadgeListType] = useState(false);
  const { badges, setBadges, removeBadge } = useBadgeStore();

  const ICONS_MAPPER = [
    {
      icon: (
        <div className="w-5 items-center justify-center">
          <StarIcon />
        </div>
      ),
      id: 'https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/star.svg',
    },
    {
      icon: (
        <div className="w-5 items-center justify-center">
          <TrophyIcon />
        </div>
      ),
      id: 'https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/trophy.svg',
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <KeyIcon />
        </div>
      ),
      id: 'https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/key.svg',
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <HeartIcon />
        </div>
      ),
      id: 'https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/heart.svg',
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <EthereumIcon />
        </div>
      ),
      id: 'https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/etherum.svg',
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <CakeIcon />
        </div>
      ),
      id: 'https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/birthday.svg',
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <BankIcon />
        </div>
      ),
      id: 'https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/lib.svg',
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <AwardIcon />
        </div>
      ),
      id: 'https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/badge.svg',
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <GithubIcon />
        </div>
      ),
      id: 'https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/github.svg',
    },
  ];

  useEffect(() => {
    setValue('avatar', selectedAvatar);
    setValue('badgeType', selectedBadge.join(','));
  }, [selectedAvatar, selectedBadge, setValue]);

  useEffect(() => {
    const currentFields = watch('badges') || [];
    currentFields.forEach((_, index) => {
      unregister(`badges.${index}`);
    });

    badges.forEach((badge, index) => {
      setValue(`badges.${index}`, {
        name: badge.name,
        issuer: badge.issuer,
        score: badge.score,
      });
    });

    for (let i = badges?.length; i < badgeCount; i++) {
      if (!watch(`badges.${i}`)) {
        setValue(`badges.${i}`, { name: '', issuer: '', score: 0 });
      }
    }
  }, [badges, badgeCount, setValue, watch, unregister]);

  useEffect(() => {
    if (badges?.length > 0) {
      setBadgeTypeDetails(badges);
      setBadgeCount(badges?.length);
    }
  }, [badges]);

  useEffect(() => {
    if (currentStep === 2) {
      const fetchAndSetBadges = async () => {
        setLoadingBadgeListType(true);
        try {
          const badgeTypesToFetch = selectedBadge.filter(type => type !== 'custom');
          const details = await getBadgesByTypes(badgeTypesToFetch);
          if (details) {
            setBadges(details);
          }
          if (selectedBadge.includes('custom') && selectedBadge.length === 1 && (!details || details.length === 0)) {
            addEmptyBadge();
          }
        } catch (error) {
          console.error('Error fetching badge details:', error);
          if (selectedBadge.includes('custom') && selectedBadge.length === 1 && badges.length === 0) {
            addEmptyBadge();
          }
        } finally {
          setLoadingBadgeListType(false);
        }
      };

      if (badges?.length === 0) {
        fetchAndSetBadges();
        setLoadingBadgeListType(false);
      }
    }
  }, [badges?.length, currentStep, getBadgesByTypes, selectedBadge, setBadges, badges]);

  // Helper function to add an empty badge
  const addEmptyBadge = () => {
    const newBadge = {
      name: '',
      issuer: '',
      score: 0,
    } as Badge;

    useBadgeStore.getState().addBadge(newBadge);
    setBadgeCount(prev => Math.max(prev, 1));
    return newBadge;
  };

  const addNewBadge = () => {
    addEmptyBadge();
  };

  const handleAvatarSelect = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedAvatar(id);
  };

  const updateBadgesFromSelection = async (selectedTypes: string[]) => {
    if (selectedTypes.length > 0) {
      const badgeTypesToFetch = selectedTypes.filter(type => type !== 'custom');
      if (badgeTypesToFetch.length > 0) {
        const newBadges = await getBadgesByTypes(badgeTypesToFetch);
        setBadges(newBadges);
      } else {
        if (selectedTypes.includes('custom') && badges.length === 0) {
          useBadgeStore.getState().clearBadges();
          addEmptyBadge();
        } else {
          setBadges([]);
        }
      }
    } else {
      setBadges([]);
    }
  };

  const handleBadgeSelect = (
    e: React.MouseEvent | React.ChangeEvent,
    id: string
  ) => {
    const newSelectedBadges = selectedBadge.includes(id)
      ? selectedBadge.filter(badge => badge !== id)
      : [...selectedBadge, id];

    setSelectedBadge(newSelectedBadges);
    updateBadgesFromSelection(newSelectedBadges);
  };

  const clearAllBadges = () => {
    setBadges([]);
    setBadgeCount(0);
    setSelectedBadge([]);

    const currentFields = watch('badges') || [];
    currentFields.forEach((_, index) => {
      unregister(`badges.${index}`);
    });

    useBadgeStore.getState().clearBadges();
  };

  const onSubmit = async (data: CreateCommunityForm) => {
    if (currentStep !== 3) {
      return;
    }

    setIsSubmitting(true);

    try {
      const filteredBadges = data.badges.filter(
        badge => badge && badge.name && badge.name.trim() !== ''
      );

      if (filteredBadges.length === 0) {
        toast.error('At least one badge is required.');
        setIsSubmitting(false);
        return;
      }

      const sortedBadges = filteredBadges.sort((a, b) => a.name.localeCompare(b.name));

      const { pubkey } = await albedo.publicKey({
        require_existing: true,
      }); //Todo-user logged

      const FACTORY_CONTRACT_ID =
        process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ID ||
        'CDWMRLNMJELIYNXWKGYCHP6NLT75W42OSK23CN4ZM4S2Z6EC2YPJGIDZ';
      const RPC_URL =
        process.env.NEXT_PUBLIC_RPCURL || 'https://soroban-testnet.stellar.org';

      const server = new rpc.Server(RPC_URL, { allowHttp: true });

      const account = await server.getAccount(pubkey);

      const saltBuffer = Buffer.alloc(32);
      for (let i = 0; i < 32; i++) {
        saltBuffer[i] = Math.floor(Math.random() * 256);
      }
      const saltScVal = xdr.ScVal.scvBytes(saltBuffer);
      const adminAddressScVal = new Address(pubkey).toScVal();

      const badgeMapEntries: xdr.ScMapEntry[] = sortedBadges.map(
        badgeType => {
          const badgeIdVector = xdr.ScVal.scvVec([
            xdr.ScVal.scvString(badgeType.name),
            new Address(badgeType.issuer.toUpperCase()).toScVal(),
          ]);
          return new xdr.ScMapEntry({
            key: badgeIdVector,
            val: xdr.ScVal.scvU32(badgeType.score),
          });
        }
      );

      const badgeMapScVal = xdr.ScVal.scvMap(badgeMapEntries);

      const initArgsScVal = xdr.ScVal.scvVec([
        adminAddressScVal,
        badgeMapScVal,
        xdr.ScVal.scvString(data.name),
        xdr.ScVal.scvString(data.description),
        xdr.ScVal.scvString(data.avatar),
      ]);

      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.invokeContractFunction({
            function: 'create_scorer',
            contract: FACTORY_CONTRACT_ID,
            args: [
              new Address(pubkey).toScVal(),
              saltScVal,
              xdr.ScVal.scvSymbol('initialize'),
              initArgsScVal,
            ],
          })
        )
        .setTimeout(30)
        .build();

      const preparedTransaction = await server.prepareTransaction(transaction);
      const transactionXDR = preparedTransaction.toXDR();

      const result = await albedo.tx({
        xdr: transactionXDR,
        network: 'testnet',
        submit: true,
      });

      if (!result.tx_hash) {
        console.error('No tx_hash returned from Albedo.');
        setIsSubmitting(false);
        return;
      }

      let attempts = 0;
      const maxAttempts = 10;
      let txResponse;

      do {
        await new Promise(resolve => setTimeout(resolve, 2000));
        txResponse = await server.getTransaction(result.tx_hash);
        attempts++;
      } while (txResponse.status === 'NOT_FOUND' && attempts < maxAttempts);

      if (txResponse.status === 'SUCCESS') {
        console.log('Scorer contract created!');
        console.log('Contract Address:', txResponse.returnValue?.toString());
        console.log('Transaction Hash:', result.tx_hash);

        setIsSubmitting(false);
        onClose();
        clearAllBadges();
        toast.success('Successful transaction');

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error('❌ Transaction failed:', txResponse.status);
        setIsSubmitting(false);
        toast.error('Transaction failed');
      }
    } catch (error: any) {
      setIsSubmitting(false);
      toast.error('Invalid badge name. Please use a valid one.');
    }
  };

  const handleRemoveBadge = (index: number) => {
    removeBadge(index);
    setBadgeCount(prev => prev - 1);
    unregister(`badges.${index}`);

    const remainingFields =
      watch('badges')?.filter((_, i) => i !== index) || [];
    remainingFields.forEach((field, i) => {
      setValue(`badges.${i}`, field);
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="space-y-4 pb-4">
              <div>
                <label className="block text-sm mb-2 font-light">Name</label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full bg-gray-700 rounded-lg p-2 bg-whiteOpacity008"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name?.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm mb-2 font-light">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  className="w-full bg-gray-700 rounded-lg p-2 bg-whiteOpacity008 max-h-[200px] min-h-[100px]"
                  rows={4}
                  onChange={e => {
                    e.stopPropagation();
                    register('description').onChange(e);
                  }}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    {errors.description?.message}
                  </span>
                )}
                <div className="text-right text-sm text-gray-400">
                  {watch('description')?.length || 0}
                  /120
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Avatar</label>
                <div className="flex gap-1.5 w-8 h-10 rounded">
                  {ICONS_MAPPER.map(({ icon, id }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={e => handleAvatarSelect(e, id)}
                      className={`p-3 rounded-full bg-whiteOpacity005 hover:bg-gray-600 transition-colors ${selectedAvatar === id ? 'ring-2 ring-brandGreen' : ''
                        }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                {errors.avatar && (
                  <span className="text-red-500 text-sm">
                    {errors.avatar?.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2">Badges</label>
                <div className="flex gap-4">
                  {BADGE_OPTIONS.map(({ id, label }) => (
                    <div className="flex" key={id}>
                      <label className="flex items-center cursor-pointer gap-x-0.5 flex-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedBadge.includes(id)}
                          onChange={e => handleBadgeSelect(e, id)}
                          className="hidden"
                        />
                        <span
                          className={`w-4 h-4 flex items-center justify-center border-2 rounded ${selectedBadge.includes(id)
                            ? 'border-brandGreen bg-darkGreenOpacity01'
                            : 'border-whiteOpacity008'
                            }`}
                        >
                          {selectedBadge.includes(id) && (
                            <span className="w-2.5 h-2.5 bg-brandGreen"></span>
                          )}
                        </span>
                        <span className="ml-2 font-light text-sm">{label}</span>
                      </label>
                    </div>
                  ))}
                </div>
                {errors.badgeType && (
                  <span className="text-red-500 text-sm">
                    {errors.badgeType?.message}
                  </span>
                )}
              </div>
            </div>

            {/* <CustomBadge /> */}

            <CustomHR />
          </>
        );
      case 2: {
        return (
          <>
            <div className="space-y-4 p-1 h-full w-full overflow-y-auto min-h-80 max-h-80 overflow-x-hidden">
              {loadingBadgeListType ? (
                <>Loading...</>
              ) : (
                <>
                  <div className="grid grid-cols-[140px_100px_80px] gap-3 overflow-x-hidden w-full">
                    <span className="font-light text-xs text-whiteOpacity05">
                      Badge
                    </span>
                    <span className="font-light text-xs text-whiteOpacity05">
                      Issuer
                    </span>
                    <span className="font-light text-xs text-whiteOpacity05">
                      Score
                    </span>
                  </div>
                  <CustomHR />

                  {Array.from({ length: badgeCount }, (_, index) => (
                    <React.Fragment key={`badge-${index}`}>
                      <div className="grid grid-cols-[140px_100px_80px] gap-3">
                        <div className="flex- flex-col">
                          <input
                            {...register(`badges.${index}.name`, {
                              required: 'Required',
                            })}
                            type="text"
                            placeholder={`Badge Name #${index + 1}`}
                            defaultValue={badgeTypeDetails[index]?.name || ''}
                            className="bg-whiteOpacity005 px-2 max-h-10 h-10 rounded-lg  max-w-full"
                          />
                          {errors?.badges && errors.badges[index]?.name && (
                            <span className="text-red-500 text-[10px] mt-1">
                              {errors.badges[index]?.name?.message}
                            </span>
                          )}
                        </div>
                        <div className="h-full flex flex-col">
                          {badgeTypeDetails[index]?.issuer !== '' ? (
                            <div className="py-2 overflow-hidden">
                              {getEllipsedAddress(
                                badgeTypeDetails[index]?.issuer || ''
                              )}
                            </div>
                          ) : (
                            <input
                              {...register(`badges.${index}.issuer`, {
                                required: 'Required',
                                onChange: e => {
                                  const value = e.target.value;
                                  if (value !== '') {
                                    e.target.value = '';
                                    setValue(`badges.${index}.issuer`, value);
                                  }
                                },
                              })}
                              type="text"
                              defaultValue={
                                badgeTypeDetails[index]?.issuer || ''
                              }
                              placeholder={`Issuer #${index + 1}`}
                              className="bg-whiteOpacity005 max-h-10 rounded-lg p-2 flex-1 border-whiteOpacity008 w-full"
                            />
                          )}
                          {errors?.badges && errors.badges[index]?.issuer && (
                            <span className="text-red-500 text-[10px]  mt-1">
                              {errors.badges[index]?.issuer?.message}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <input
                              {...register(`badges.${index}.score`, {
                                valueAsNumber: true,
                                required: 'Required',
                                onChange: e => {
                                  const value = e.target.value;
                                  if (value === '') {
                                    e.target.value = '';
                                    setValue(`badges.${index}.score`, 0);
                                  } else {
                                    setValue(
                                      `badges.${index}.score`,
                                      parseInt(value) || 0
                                    );
                                  }
                                },
                              })}
                              type="number"
                              defaultValue={
                                badgeTypeDetails[index]?.score || ''
                              }
                              placeholder="Score"
                              className="bg-whiteOpacity005 max-h-10 rounded-lg p-2 flex-1 max-w-20 border-whiteOpacity008"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveBadge(index)}
                              className="text-gray-400 ml-2 shrink-0"
                            >
                              <div className="w-6">
                                <TrashIcon />
                              </div>
                            </button>
                          </div>
                          {errors?.badges && errors.badges[index]?.score && (
                            <span className="text-red-500 text-[10px] mt-1">
                              {errors.badges[index]?.score?.message}
                            </span>
                          )}
                        </div>
                      </div>
                      {index < badges?.length - 1 && <CustomHR />}
                    </React.Fragment>
                  ))}
                </>
              )}
            </div>
            {selectedBadge.includes('custom') && (
              <button
                type="button"
                onClick={addNewBadge}
                className="mt-4 text-brandGreen"
              >
                + Add Badge
              </button>
            )}
          </>
        );
      }
      case 3: {
        const avatar = watch('avatar');
        const badges = watch('badges');
        const description = watch('description');
        const name = watch('name');
        const icon =
          avatar && ICONS_MAPPER.find(icon => icon.id === avatar)?.icon;

        return (
          <div className="space-y-4 h-96">
            <div className="w-16 h-16 bg-whiteOpacity008 rounded-full flex items-center justify-center">
              {icon}
            </div>
            <h2 className="text-xl font-bold font-space-grotesk break-words">
              {name}
            </h2>
            <p className="text-whiteOpacity05 text-sm font-light break-words whitespace-normal">
              {description}
            </p>
            <div className="flex flex-row items-center gap-2">
              <div className="w-5 h-5 overflow-hidden rounded-full">
                <Image
                  src="https://fontawesome.com/icons/user?f=classic&s=solid"
                  width={20}
                  height={20}
                  alt="User Avatar"
                  className="rounded-full"
                />
              </div>
              <div>
                <p className="font-light text-sm text-whiteOpacity05">
                  Created by {getEllipsedAddress(userAddress || '')}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3 text-whiteOpacity05">
              <TagIcon />
              <p className="text-sm font-light text-whiteOpacity05">
                {badges?.length} badges
              </p>
            </div>
            <CustomBadge />
          </div>
        );
      }

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-light text-xs text-whiteOpacity05">
                Badge Name
              </p>
              <p className="font-light text-xs text-whiteOpacity05 mr-36">
                Issuer
              </p>
            </div>
            <CustomHR />
            {[1].map((num, index) => (
              <React.Fragment key={num}>
                {' '}
                <div className="flex justify-between items-center gap-4">
                  <input
                    type="number"
                    className="bg-whiteOpacity005 rounded-lg p-2 border-whiteOpacity008"
                  />
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      className="bg-whiteOpacity005 rounded-lg p-2 w-full border-whiteOpacity008"
                    />
                    <button className="text-gray-400 ml-2">
                      <div className="w-6">
                        <TrashIcon />
                      </div>
                    </button>
                  </div>
                </div>
                <button>
                  <div className="flex flex-row items-center gap-2 text-sm text-whiteOpacity05">
                    <PlusIcon className="text-whiteOpacity05" /> New badge
                  </div>
                </button>
                {index < 5 && <CustomHR />}
              </React.Fragment>
            ))}
          </div>
        );
    }
  };

  if (!isOpen) return null;

  const handleNextClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Ensure at least one empty badge exists when only 'custom' is selected
    if (currentStep === 1 && selectedBadge.includes('custom') && selectedBadge.length === 1) {
      if (badges.length === 0) {
        const newBadge = addEmptyBadge();
        setBadges([newBadge]);
      }
      onNext();
      return;
    }

    const isValid = await trigger();
    if (!isValid) {
      badges.map(item => {
        if (item.message) return toast.error(item.message);
      });

      return;
    }

    onNext();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-grey02 rounded-lg p-6 w-full max-w-md z-50 relative"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-space-grotesk">Create community</h2>
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              onClose();
            }}
          >
            <div className="w-4 ">
              <CloseIcon />
            </div>
          </button>
        </div>
        <CustomHR />

        {renderStep()}

        <div className="flex justify-end gap-4 mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-darkGreenOpacity01 rounded-lg w-24"
            >
              <p className="text-brandGreen">Back</p>
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextClick}
              className="px-4 py-2 bg-brandGreen w-24 rounded-lg text-black"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-brandGreen rounded-lg text-black"
            >
              {isSubmitting ? 'Processing...' : 'Confirm'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};