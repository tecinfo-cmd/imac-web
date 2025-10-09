import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserRoleState {
  role: string | null;
  setRole: (role: string) => void;
  clearRole: () => void;
}

export const useUserRoleStore = create<UserRoleState>()(
  persist(
    (set) => ({
      role: null,
      setRole: (role) => set({ role }),
      clearRole: () => set({ role: null }),
    }),
    {
      name: "user-role-storage",
    }
  )
);
