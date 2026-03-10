import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FarmData {
  id: number;
  carFederal: string;
  carEstadual: string;
  voucher: string;
  cidade: string;
  nomePropriedade: string;
  moduloFiscal: string;
}

interface FarmStore {
  farmStore: Partial<FarmData>;
  setFarm: (farmStore: Partial<FarmData>) => void;
}

export const useFarmStore = create<FarmStore>()(
  persist(
    (set) => ({
      farmStore: {},
      setFarm: (farmStore) => set({ farmStore }),
    }),
    {
      name: "farm-storage",
    }
  )
);
