import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TechnicalResponsibleData {
  id: string;
  cpf: string;
  nome: string;
  profissao: string;
  registroCrea: string;
  telefone: string;
  email: string;
  endereco: {
    id: number;
    cep: string;
    longitude: number;
    latitude: number;
    municipio: string;
    estado: string;
    logradouro: string;
    complemento: string;
  };
}

interface TechnicalResponsibleContestationStore {
  technicalResponsible: TechnicalResponsibleData | null;
  setTechnicalResponsible: (data: TechnicalResponsibleData) => void;
  clearTechnicalResponsible: () => void;
}

export const useTechnicalResponsibleContestationStore = create<TechnicalResponsibleContestationStore>()(
  persist(
    (set) => ({
      technicalResponsible: null,
      setTechnicalResponsible: (data) => set({ technicalResponsible: data }),
      clearTechnicalResponsible: () => set({ technicalResponsible: null }),
    }),
    {
      name: "technical-responsible-contestation-storage",
    }
  )
);
