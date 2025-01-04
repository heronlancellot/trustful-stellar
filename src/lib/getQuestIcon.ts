import { CalculatorIcon, StarIcon } from "@/components";
import { AwardIcon } from "@/components/atoms/icons/AwardIcon";
import { CodeIcon } from "@/components/atoms/icons/CodeIcon";
import { UserNinjaIcon } from "@/components/atoms/icons/UserNinjaIcon";

export const getQuestIcon = (questName: string) => {
  switch (questName) {
    case "Stellar-Quests":
      return StarIcon;
    case "Soroban-Quests":
      return CalculatorIcon;
    case "RpCiege-Quests":
      return UserNinjaIcon;
    case "Fca00c-Quests":
      return CodeIcon;
    default:
      return AwardIcon;
  }
};
