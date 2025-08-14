import { Badge } from "@/components/verify-reputation/hooks/Controller"; // ajuste o path conforme necessário
import { create } from "zustand";

interface BadgeStore {
  badges: Badge[];
  setBadges: (badges: Badge[]) => void;
  addBadge: (badge: Badge) => void;
  removeBadge: (index: number) => void;
  clearBadges: () => void;
}

export const useBadgeStore = create<BadgeStore>((set) => ({
  badges: [],
  setBadges: (badges) => set({ badges }),
  addBadge: (badge) =>
    set((state) => ({
      badges: [...state.badges, badge],
    })),
  removeBadge: (index) =>
    set((state) => ({
      badges: state.badges.filter((_, i) => i !== index),
    })),
  clearBadges: () => set({ badges: [] }),
}));
