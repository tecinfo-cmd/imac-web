import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Pessoa {
  id: number;
  cpfCnpj: string;
  nome: string;
  nomeMae: string | null;
  nomePai: string | null;
  sexo: string | null;
  dataNascimento: string | null;
  telefone: string | null;
  email: string;
  rgInscricaoSocial: string | null;
}

export interface UserData {
  id: number;
  email: string;
  aceitouTermos: boolean;
  cargo: string;
  dataCriacao: string;
  dataAtualizacao: string;
  pessoa: Pessoa;
}

interface AuthState {
  userData: UserData | null;
  setUserData: (userData: UserData) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userData: null,

      setUserData: (userData) => {
        set({ userData });
      },

      clearSession: () => {
        set({ userData: null });
      },
    }),
    {
      name: "session",
    }
  )
);

export const useAuthEmail = () =>
  useAuthStore((s) => s.userData?.pessoa?.email ?? s.userData?.email ?? "");
