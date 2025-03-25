import React, { useState, useEffect } from "react";
import { PlusIcon, StarIcon, TagIcon } from "../atoms/icons";
import { AwardIcon } from "../atoms/icons/AwardIcon";
import { GithubIcon } from "../atoms/icons/GithubIcon";
import { TrophyIcon } from "../atoms/icons/TrophyIcon";
import { KeyIcon } from "../atoms/icons/KeyIcon";
import { HeartIcon } from "../atoms/icons/HeartIcon";
import { UserNinjaIcon } from "../atoms/icons/UserNinjaIcon";
import { EthereumIcon } from "../atoms/icons/EthereumIcon";
import { CakeIcon } from "../atoms/icons/CakeIcon";
import { BankIcon } from "../atoms/icons/BankIcon";
import { AlertIcon } from "../atoms/icons/AlertIcon";
import { TrashIcon } from "../atoms/icons/TrashIcon";
import { CloseIcon } from "../atoms/icons/CloseIcon";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  { id: "blockful", label: "Blockful" },
  { id: "custom", label: "Custom" },
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

// Define o schema de validação
const createCommunitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().max(120, "Description must be less than 120 characters"),
  avatar: z.string().min(1, "Avatar is required"),
  badge: z.string().min(1, "Badge is required"),
  badges: z.array(z.object({
    name: z.string(),
    score: z.number()
  }))
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
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateCommunityForm>({
    resolver: zodResolver(createCommunitySchema)
  });

  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [selectedBadge, setSelectedBadge] = useState<string>("");

  useEffect(() => {
    setValue('avatar', selectedAvatar);
    setValue('badge', selectedBadge);
  }, [selectedAvatar, selectedBadge, setValue]);

  // const onSubmit = async (data: CreateCommunityForm) => {
  //   try {
  //     const response = await fetch('/api/communities', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to create community');
  //     }

  //     onClose();
  //     console.log(response);

  //   } catch (error) {
  //     console.error('Error creating community:', error);
  //   }
  // };

  const onSubmit = async (data: CreateCommunityForm) => {
    console.log(data);

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
                  <span className="text-red-500 text-sm">{errors.name?.message}</span>
                )}
              </div>
              <div>
                <label className="block text-sm mb-2 font-light">Description</label>
                <textarea
                  {...register('description')}
                  className="w-full bg-gray-700 rounded-lg p-2 bg-whiteOpacity008 max-h-[200px] min-h-[100px]"
                  rows={4}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">{errors.description?.message}</span>
                )}
                <div className="text-right text-sm text-gray-400">
                  {watch('description')?.length || 0}/120
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Avatar</label>
                <div className="flex gap-1.5 w-8 h-10 rounded">
                  {[
                    {
                      icon: (
                        <div className="w-5 items-center justify-center">
                          <TrophyIcon />
                        </div>
                      ),
                      id: "trophy",
                    },
                    {
                      icon: (
                        <div className="w-4 items-center justify-center">
                          <KeyIcon />
                        </div>
                      ),
                      id: "key",
                    },
                    {
                      icon: (
                        <div className="w-4 items-center justify-center">
                          <HeartIcon />
                        </div>
                      ),
                      id: "heart",
                    },
                    {
                      icon: (
                        <div className="w-4 items-center justify-center">
                          <EthereumIcon />
                        </div>
                      ),
                      id: "diamond",
                    },
                    {
                      icon: (
                        <div className="w-4 items-center justify-center">
                          <CakeIcon />
                        </div>
                      ),
                      id: "cake",
                    },
                    {
                      icon: (
                        <div className="w-4 items-center justify-center">
                          <BankIcon />
                        </div>
                      ),
                      id: "building",
                    },
                    {
                      icon: (
                        <div className="w-4 items-center justify-center">
                          <AwardIcon />
                        </div>
                      ),
                      id: "medal",
                    },
                    {
                      icon: (
                        <div className="w-4 items-center justify-center">
                          <UserNinjaIcon />
                        </div>
                      ),
                      id: "user",
                    },
                    {
                      icon: (
                        <div className="w-4 items-center justify-center">
                          <GithubIcon />
                        </div>
                      ),
                      id: "github",
                    },
                  ].map(({ icon, id }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedAvatar(id)}
                      className={`p-3 rounded-full bg-whiteOpacity005 hover:bg-gray-600 transition-colors ${selectedAvatar === id ? "ring-2 ring-brandGreen" : ""
                        }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Badges</label>
                <div className="flex gap-1">
                  {BADGE_OPTIONS.map(({ id, label }) => (
                    <div className="flex" key={id}>
                      <button
                        onClick={() => setSelectedBadge(id)}
                        className={`p-2 w-24 flex items-center justify-center  rounded-lg border border-whiteOpacity008 hover:border-gray-600 transition-colors ${selectedBadge == id ? "bg-darkGreenOpacity01" : ""}`}
                      >
                        <span
                          className={`w-4 h-4 flex items-center bg-whiteOpacity005 justify-center border-2 rounded-full ${selectedBadge == id ? "border-brandGreen" : ""}`}
                        >
                          {selectedBadge === id && (
                            <span className="w-2 h-2  rounded-full bg-brandGreen"></span>
                          )}
                        </span>
                        <span className="ml-2 font-light text-sm">{label}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* <CustomBadge /> */}

            <CustomHR />
          </>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-light text-xs text-whiteOpacity05">Badge</p>
              <p className="font-light text-xs text-whiteOpacity05 mr-28">
                Score
              </p>
            </div>
            <CustomHR />
            {[1, 2, 3, 4, 5].map((num) => (
              <React.Fragment key={`badge-${num}`}>
                <div className="flex w-full justify-between items-center">
                  <div>
                    <input
                      {...register(`badges.${num - 1}.name`)}
                      type="text"
                      placeholder={`Badge Name #${num}`}
                      className="bg-whiteOpacity005 rounded-lg p-2"
                    />
                  </div>
                  <div className="flex items-center justify-between w-1/3">
                    <input
                      {...register(`badges.${num - 1}.score`, {
                        valueAsNumber: true
                      })}
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
                {num < 6 && <CustomHR />}
              </React.Fragment>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 h-96">
            <div className="w-16 h-16 bg-whiteOpacity008 rounded-full flex items-center justify-center">
              <div className="w-6">
                <StarIcon />
              </div>
            </div>
            <h2 className="text-xl font-bold font-space-grotesk">
              Stellar Quests
            </h2>
            <p className="text-whiteOpacity05 text-sm font-light">
              Integer malesuada leo nisi, quis ullamcorper mauris elementum ut.
              Suspendisse eget libero iaculis, maximus velit vitae.
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
                  Created by 012312...1ED8
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3 text-whiteOpacity05">
              <TagIcon />
              <p className="text-sm font-light text-whiteOpacity05">
                20 badges
              </p>
            </div>
            <CustomBadge />
          </div>
        );

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
                {" "}
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-grey02 rounded-lg p-6 w-full max-w-md z-50 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-space-grotesk">Create community</h2>
          <button onClick={onClose}>
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
              onClick={onNext}
              className="px-4 py-2 bg-brandGreen w-24 rounded-lg text-black"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-brandGreen w-24 rounded-lg text-black"
            >
              Confirm
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
