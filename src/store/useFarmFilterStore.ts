import { create } from "zustand";

export interface FarmFilter {
  nomePropriedade?: string;
  codigoMunicipio?: string;
  carFederal?: string;
  carEstadual?: string;
  statusVoucher?: boolean;
}

export interface FarmFilterStore {
  farmFilterValues: FarmFilter;
  addFilterValues: (filterValues: FarmFilter) => void;
  clearFilterValues: () => void;
};

export const useFarmFilterStore = create<FarmFilterStore>((set) => ({
  farmFilterValues: {} as FarmFilter,
  addFilterValues: (filterValues) => {
    set(() => ({
      farmFilterValues: filterValues,
    }));
  },
  clearFilterValues: () => {
    set(() => ({
      farmFilterValues: {} as FarmFilter,
    }));
  },
}));