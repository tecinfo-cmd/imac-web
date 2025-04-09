import { create } from "zustand";

interface TooltipState {
  visibleTooltip: string | null;
  showTooltip: (id: string) => void;
  hideTooltip: () => void;
}

export const useTooltipStore = create<TooltipState>((set) => ({
  visibleTooltip: null,
  showTooltip: (id) => set({ visibleTooltip: id }),
  hideTooltip: () => set({ visibleTooltip: null }),
}));
