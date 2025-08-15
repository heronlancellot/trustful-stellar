import { useAuthContext } from "@/components/auth/Context";
import { getEllipsedAddress } from "@/lib/utils/getEllipsedAddress";
import { useBadgeStore } from "@/store/badgeStore";
import { zodResolver } from "@hookform/resolvers/zod";
import albedo from "@albedo-link/intent";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Address,
  BASE_FEE,
  Operation,
  rpc,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import * as z from "zod";
import useBadgeInfoController, { Badge } from "../badge-info/hooks/Controller";
import {
  AlertIcon,
  PlusIcon,
  StarIcon,
  TagIcon,
  UserIcon,
  TrophyIcon,
  KeyIcon,
  HeartIcon,
  EthereumIcon,
  CakeIcon,
  BankIcon,
  AwardIcon,
  GithubIcon,
  TrashIcon,
  CloseIcon,
} from "@/components/atoms/icons";
import { ALBEDO, STELLAR } from "@/lib/environmentVars";
import { isValidStellarAddress } from "@/lib/stellar/isValidStellarAddress";

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
  { id: "stellar", label: "Stellar" },
  { id: "soroban", label: "Soroban" },
  // { id: "blockful", label: "Blockful" },
  { id: "custom", label: "Custom" },
];

const BadgeInfoMessage = () => {
  return (
    <div className="flex max-w-md flex-row items-start gap-2 rounded-lg bg-darkRedOpacity p-4 text-white shadow-lg">
      <AlertIcon width={24} height={24} />
      <div>
        <p className="text-sm font-light">
          Please make sure all your information is correct before proceeding, as
          it cannot be changed later.
        </p>
      </div>
    </div>
  );
};

const CustomBadge = () => {
  return (
    <div className="flex max-w-md flex-row gap-2 rounded-lg bg-darkRedOpacity p-4 text-white shadow-lg">
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
    <div className="mb-4 w-full bg-whiteOpacity008">
      <hr className="h-[1px] w-full border-whiteOpacity008" />
    </div>
  );
};

const createCommunitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z
    .string()
    .max(120, "Description must be less than 120 characters"),
  avatar: z.string().min(1, "Avatar is required"),
  badgeType: z.string().min(1, "Badge is required"),
});

type CreateCommunityForm = z.infer<typeof createCommunitySchema>;

export const StepModal = ({
  isOpen,
  onClose,
  currentStep,
  onNext,
  onBack,
  onConfirm,
}: ModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
    unregister,
  } = useForm<CreateCommunityForm>({
    mode: "onBlur",
    resolver: zodResolver(createCommunitySchema),
  });
  const { userAddress } = useAuthContext();
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [selectedBadge, setSelectedBadge] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showValidationErrors, setShowValidationErrors] =
    useState<boolean>(false);
  const { getBadgesByTypes } = useBadgeInfoController();
  const [loadingBadgeListType, setLoadingBadgeListType] = useState(false);
  const { badges, setBadges, addBadge, updateBadge, removeBadge } =
    useBadgeStore();

  const ICONS_MAPPER = [
    {
      icon: (
        <div className="w-5 items-center justify-center">
          <StarIcon />
        </div>
      ),
      id: "https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/star.svg",
    },
    {
      icon: (
        <div className="w-5 items-center justify-center">
          <TrophyIcon />
        </div>
      ),
      id: "https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/trophy.svg",
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <KeyIcon />
        </div>
      ),
      id: "https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/key.svg",
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <HeartIcon />
        </div>
      ),
      id: "https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/heart.svg",
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <EthereumIcon />
        </div>
      ),
      id: "https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/etherum.svg",
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <CakeIcon />
        </div>
      ),
      id: "https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/birthday.svg",
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <BankIcon />
        </div>
      ),
      id: "https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/lib.svg",
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <AwardIcon />
        </div>
      ),
      id: "https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/badge.svg",
    },
    {
      icon: (
        <div className="w-4 items-center justify-center">
          <GithubIcon />
        </div>
      ),
      id: "https://cdn.jsdelivr.net/gh/blockful-io/trustful-stellar-icons-cdn@main/github.svg",
    },
  ];

  useEffect(() => {
    setValue("avatar", selectedAvatar);
    setValue("badgeType", selectedBadge.join(","));
  }, [selectedAvatar, selectedBadge, setValue]);

  useEffect(() => {
    if (currentStep === 2) {
      const fetchAndSetBadges = async () => {
        setLoadingBadgeListType(true);
        try {
          const badgeTypesToFetch = selectedBadge.filter(
            (type) => type !== "custom",
          );
          const details = await getBadgesByTypes(badgeTypesToFetch);
          if (details) {
            setBadges(details);
          }
          if (
            selectedBadge.includes("custom") &&
            selectedBadge.length === 1 &&
            (!details || details.length === 0)
          ) {
            alert("yo");
            addEmptyBadge();
          }
        } catch (error) {
          console.error("Error fetching badge details:", error);
          if (
            selectedBadge.includes("custom") &&
            selectedBadge.length === 1 &&
            badges.length === 0
          ) {
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
  }, [
    badges?.length,
    currentStep,
    getBadgesByTypes,
    selectedBadge,
    setBadges,
    badges,
  ]);

  // Helper function to add an empty badge
  const addEmptyBadge = () => {
    const newBadge = {
      name: "",
      issuer: "",
      score: 0,
    } as Badge;

    addBadge(newBadge);
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
      const badgeTypesToFetch = selectedTypes.filter(
        (type) => type !== "custom",
      );
      if (badgeTypesToFetch.length > 0) {
        const newBadges = await getBadgesByTypes(badgeTypesToFetch);
        setBadges(newBadges);
      } else {
        if (selectedTypes.includes("custom") && badges.length === 0) {
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
    id: string,
  ) => {
    const newSelectedBadges = selectedBadge.includes(id)
      ? selectedBadge.filter((badge) => badge !== id)
      : [...selectedBadge, id];

    setSelectedBadge(newSelectedBadges);
    updateBadgesFromSelection(newSelectedBadges);
  };

  const clearAllBadges = () => {
    setBadges([]);
    setSelectedBadge([]);
    useBadgeStore.getState().clearBadges();
  };

  const onSubmit = async (data: CreateCommunityForm) => {
    if (currentStep !== 3) {
      return;
    }

    setIsSubmitting(true);

    try {
      const badgeValidation = validateBadges();
      if (!badgeValidation.isValid) {
        toast.error(badgeValidation.error || "Badge validation failed");
        setIsSubmitting(false);
        return;
      }

      const filteredBadges = badges.filter(
        (badge) => badge && badge.name && badge.name.trim() !== "",
      );

      const { pubkey } = await albedo.publicKey({
        require_existing: true,
      }); //Todo-user logged

      const server = new rpc.Server(STELLAR.RPC_URL, { allowHttp: true });
      const account = await server.getAccount(pubkey);
      const saltBuffer = Buffer.alloc(32);
      for (let i = 0; i < 32; i++) {
        saltBuffer[i] = Math.floor(Math.random() * 256);
      }
      const saltScVal = xdr.ScVal.scvBytes(saltBuffer);
      const adminAddressScVal = new Address(pubkey).toScVal();

      // Create badge map entries
      const badgeMapEntries: xdr.ScMapEntry[] = filteredBadges.map(
        (badgeType) => {
          const issuerAddress = badgeType.issuer.toUpperCase();

          // Create BadgeId as ScMap (struct fields in alphabetical order)
          const badgeIdMap = xdr.ScVal.scvMap([
            new xdr.ScMapEntry({
              key: xdr.ScVal.scvSymbol("issuer"),
              val: new Address(issuerAddress).toScVal(),
            }),
            new xdr.ScMapEntry({
              key: xdr.ScVal.scvSymbol("name"),
              val: xdr.ScVal.scvString(String(badgeType.name)),
            }),
          ]);

          return new xdr.ScMapEntry({
            key: badgeIdMap,
            val: xdr.ScVal.scvU32(Number(badgeType.score)),
          });
        },
      );

      // Sort map entries by BadgeId keys using XDR comparison (required by Soroban)
      badgeMapEntries.sort((a, b) => {
        const mapA = a.key().map();
        const mapB = b.key().map();

        if (!mapA || !mapB) return 0;

        // Compare issuer field (first in alphabetical order)
        const issuerA = mapA[0].val();
        const issuerB = mapB[0].val();
        const issuerCmp = Buffer.from(issuerA.toXDR()).compare(
          Buffer.from(issuerB.toXDR()),
        );
        if (issuerCmp !== 0) return issuerCmp;

        // Compare name field if issuers are equal
        const nameA = mapA[1].val().str().toString();
        const nameB = mapB[1].val().str().toString();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });

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
        networkPassphrase: STELLAR.NETWORK_PASSPHRASE,
      })
        .addOperation(
          Operation.invokeContractFunction({
            function: "create_scorer",
            contract: STELLAR.FACTORY_CONTRACT_ID,
            args: [
              new Address(pubkey).toScVal(),
              saltScVal,
              xdr.ScVal.scvSymbol("initialize"),
              initArgsScVal,
            ],
          }),
        )
        .setTimeout(30)
        .build();

      const preparedTransaction = await server.prepareTransaction(transaction);
      const transactionXDR = preparedTransaction.toXDR();
      const result = await albedo.tx({
        xdr: transactionXDR,
        network: ALBEDO.NETWORK_TYPE,
        submit: true,
      });
      console.log("Result Creating Community", result);
      if (!result.tx_hash) {
        console.error("No tx_hash returned from Albedo.");
        setIsSubmitting(false);
        return;
      }

      let attempts = 0;
      const maxAttempts = 10;
      let txResponse;

      do {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        txResponse = await server.getTransaction(result.tx_hash);
        attempts++;
      } while (txResponse.status === "NOT_FOUND" && attempts < maxAttempts);

      if (txResponse.status === "SUCCESS") {
        console.log("Scorer contract created!");
        console.log("Contract Address:", txResponse.returnValue?.toString());
        console.log("Transaction Hash:", result.tx_hash);

        setIsSubmitting(false);
        onClose();
        clearAllBadges();
        toast.success("Successful transaction");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error("❌ Transaction failed:", txResponse.status);
        setIsSubmitting(false);
        toast.error("Transaction failed");
      }
    } catch (error: any) {
      console.error("Error Creating Community", error);
      setIsSubmitting(false);
      toast.error(error.message || "Error Creating Community");
    }
  };

  const handleRemoveBadge = (index: number) => {
    removeBadge(index);
  };

  const validateBadges = () => {
    if (badges.length === 0) {
      return { isValid: false, error: "At least one badge is required" };
    }

    for (let i = 0; i < badges.length; i++) {
      const badge = badges[i];
      if (!badge.name || badge.name.trim() === "") {
        return { isValid: false, error: `Badge ${i + 1}: Name is required` };
      }
      if (!badge.issuer || badge.issuer.trim() === "") {
        return { isValid: false, error: `Badge ${i + 1}: Issuer is required` };
      }
      if (!isValidStellarAddress(badge.issuer.toUpperCase())) {
        return {
          isValid: false,
          error: `${badge.issuer} is not a valid Stellar address`,
        };
      }
      if (!badge.score || badge.score <= 0) {
        return {
          isValid: false,
          error: `Score must be greater than 0`,
        };
      }
    }

    return { isValid: true, error: null };
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="space-y-4 pb-4">
              <div>
                <label className="mb-2 block text-sm font-light">Name</label>
                <input
                  {...register("name")}
                  type="text"
                  className="w-full rounded-lg bg-gray-700 bg-whiteOpacity008 p-2"
                />
                {errors.name && (
                  <span className="text-sm text-red-500">
                    {errors.name?.message}
                  </span>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-light">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="max-h-[200px] min-h-[100px] w-full rounded-lg bg-gray-700 bg-whiteOpacity008 p-2"
                  rows={4}
                  onChange={(e) => {
                    e.stopPropagation();
                    register("description").onChange(e);
                  }}
                />
                {errors.description && (
                  <span className="text-sm text-red-500">
                    {errors.description?.message}
                  </span>
                )}
                <div className="text-right text-sm text-gray-400">
                  {watch("description")?.length || 0}
                  /120
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm">Avatar</label>
                <div className="flex h-10 w-8 gap-1.5 rounded">
                  {ICONS_MAPPER.map(({ icon, id }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={(e) => handleAvatarSelect(e, id)}
                      className={`rounded-full bg-whiteOpacity005 p-3 transition-colors hover:bg-gray-600 ${
                        selectedAvatar === id ? "ring-2 ring-brandGreen" : ""
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                {errors.avatar && (
                  <span className="text-sm text-red-500">
                    {errors.avatar?.message}
                  </span>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm">Badges</label>
                <div className="flex gap-4">
                  {BADGE_OPTIONS.map(({ id, label }) => (
                    <div className="flex" key={id}>
                      <label className="flex cursor-pointer flex-nowrap items-center gap-x-0.5">
                        <input
                          type="checkbox"
                          checked={selectedBadge.includes(id)}
                          onChange={(e) => handleBadgeSelect(e, id)}
                          className="hidden"
                        />
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded border-2 ${
                            selectedBadge.includes(id)
                              ? "border-brandGreen bg-darkGreenOpacity01"
                              : "border-whiteOpacity008"
                          }`}
                        >
                          {selectedBadge.includes(id) && (
                            <span className="h-2.5 w-2.5 bg-brandGreen"></span>
                          )}
                        </span>
                        <span className="ml-2 text-sm font-light">{label}</span>
                      </label>
                    </div>
                  ))}
                </div>
                {errors.badgeType && (
                  <span className="text-sm text-red-500">
                    {errors.badgeType?.message}
                  </span>
                )}
              </div>
            </div>

            {selectedBadge.includes("custom") && (
              <div className="pb-4 pt-2">
                <CustomBadge />
              </div>
            )}

            <CustomHR />
          </>
        );
      case 2: {
        return (
          <>
            <div className="h-full max-h-80 min-h-80 w-full space-y-4 overflow-y-auto overflow-x-hidden p-1">
              {loadingBadgeListType ? (
                <>Loading...</>
              ) : (
                <>
                  <div className="grid w-full grid-cols-[140px_100px_80px] gap-3 overflow-x-hidden">
                    <span className="text-xs font-light text-whiteOpacity05">
                      Badge
                    </span>
                    <span className="text-xs font-light text-whiteOpacity05">
                      Issuer
                    </span>
                    <span className="text-xs font-light text-whiteOpacity05">
                      Score
                    </span>
                  </div>
                  <CustomHR />

                  {Array.from({ length: badges.length }, (_, index) => (
                    <React.Fragment key={`badge-${index}`}>
                      <div className="grid grid-cols-[140px_100px_80px] gap-3">
                        <div className="flex flex-col">
                          <input
                            type="text"
                            placeholder={`Badge Name #${index + 1}`}
                            value={badges[index]?.name || ""}
                            onChange={(e) =>
                              updateBadge(index, "name", e.target.value)
                            }
                            className="h-10 max-h-10 max-w-full rounded-lg bg-whiteOpacity005 px-2"
                          />
                          {!badges[index]?.name && showValidationErrors && (
                            <span className="mt-1 text-[10px] text-red-500">
                              Required
                            </span>
                          )}
                        </div>
                        <div className="flex h-full flex-col">
                          {badges[index]?.issuer &&
                          badges[index].issuer !== "" &&
                          !selectedBadge.includes("custom") ? (
                            <div className="overflow-hidden py-2">
                              {getEllipsedAddress(badges[index]?.issuer || "")}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={badges[index]?.issuer || ""}
                              onChange={(e) =>
                                updateBadge(
                                  index,
                                  "issuer",
                                  e.target.value.toUpperCase(),
                                )
                              }
                              placeholder={`Issuer #${index + 1}`}
                              className="max-h-10 w-full flex-1 rounded-lg border-whiteOpacity008 bg-whiteOpacity005 p-2"
                            />
                          )}
                          {!badges[index]?.issuer && showValidationErrors && (
                            <span className="mt-1 text-[10px] text-red-500">
                              Required
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <input
                              type="number"
                              value={badges[index]?.score || ""}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? 0
                                    : parseInt(e.target.value) || 0;
                                updateBadge(index, "score", value);
                              }}
                              placeholder="Score"
                              className="max-h-10 max-w-20 flex-1 rounded-lg border-whiteOpacity008 bg-whiteOpacity005 p-2"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveBadge(index)}
                              className="ml-2 shrink-0 text-gray-400"
                            >
                              <div className="w-6">
                                <TrashIcon />
                              </div>
                            </button>
                          </div>
                          {(!badges[index]?.score ||
                            badges[index].score === 0) &&
                            showValidationErrors && (
                              <span className="mt-1 text-[10px] text-red-500">
                                Required
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
            {selectedBadge.includes("custom") && (
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
        const avatar = watch("avatar");
        // const badges = watch("badges");
        const description = watch("description");
        const name = watch("name");
        const icon =
          avatar && ICONS_MAPPER.find((icon) => icon.id === avatar)?.icon;

        return (
          <div className="h-96 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-whiteOpacity008">
              {icon}
            </div>
            <h2 className="font-space-grotesk break-words text-xl font-bold">
              {name}
            </h2>
            <p className="whitespace-normal break-words text-sm font-light text-whiteOpacity05">
              {description}
            </p>
            <div className="flex flex-row items-center gap-2">
              <div className="h-5 w-5 overflow-hidden rounded-full">
                <UserIcon />
              </div>
              <div>
                <p className="text-sm font-light text-whiteOpacity05">
                  Created by {getEllipsedAddress(userAddress || "")}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3 text-whiteOpacity05">
              <TagIcon />
              <p className="text-sm font-light text-whiteOpacity05">
                {badges?.length} badges
              </p>
            </div>
            <BadgeInfoMessage />
          </div>
        );
      }

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="text-xs font-light text-whiteOpacity05">
                Badge Name
              </p>
              <p className="mr-36 text-xs font-light text-whiteOpacity05">
                Issuer
              </p>
            </div>
            <CustomHR />
            {[1].map((num, index) => (
              <React.Fragment key={num}>
                {" "}
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="number"
                    className="rounded-lg border-whiteOpacity008 bg-whiteOpacity005 p-2"
                  />
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      className="w-full rounded-lg border-whiteOpacity008 bg-whiteOpacity005 p-2"
                    />
                    <button className="ml-2 text-gray-400">
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
    if (
      currentStep === 1 &&
      selectedBadge.includes("custom") &&
      selectedBadge.length === 1
    ) {
      if (badges.length === 0) {
        const newBadge = addEmptyBadge();
        setBadges([newBadge]);
      }
      onNext();
      return;
    }

    // Valida formulário básico
    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    // Se estamos no step 2, valida badges também
    if (currentStep === 2) {
      const badgeValidation = validateBadges();
      if (!badgeValidation.isValid) {
        setShowValidationErrors(true);
        toast.error(badgeValidation.error || "Please fill all badge fields");
        return;
      }
    }

    setShowValidationErrors(false);
    onNext();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-50 w-full max-w-md rounded-lg bg-grey02 p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-space-grotesk text-xl">Create community</h2>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            <div className="w-4">
              <CloseIcon />
            </div>
          </button>
        </div>
        <CustomHR />

        {renderStep()}

        <div className="mt-6 flex justify-end gap-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="w-24 rounded-lg bg-darkGreenOpacity01 px-4 py-2"
            >
              <p className="text-brandGreen">Back</p>
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextClick}
              className="w-24 rounded-lg bg-brandGreen px-4 py-2 text-black"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brandGreen px-4 py-2 text-black"
            >
              {isSubmitting ? "Processing..." : "Confirm"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
