import { Badge } from "@/components/verify-reputation/hooks/Controller"; // ajuste o path conforme necessário
import { create } from "zustand";

interface BadgeStore {
  badges: Badge[];
  setBadges: (badges: Badge[]) => void;
  addBadge: (badge: Badge) => void;
  removeBadge: (index: number) => void;
  updateBadge: (index: number, field: keyof Badge, value: string | number) => void;
  clearBadges: () => void;
}

export const useBadgeStore = create<BadgeStore>((set) => ({
  badges: [],
  setBadges: (badges) => set({ badges }),
  addBadge: (badge) =>
    set((state) => ({
      badges: [badge, ...state.badges],
    })),
  removeBadge: (index) =>
    set((state) => ({
      badges: state.badges.filter((_, i) => i !== index),
    })),
  updateBadge: (index, field, value) =>
    set((state) => ({
      badges: state.badges.map((badge, i) =>
        i === index ? { ...badge, [field]: value } : badge
      ),
    })),
  clearBadges: () => set({ badges: [] }),
}));
