import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface Owner {
  idProprietario?: number;
  nome: string;
  cpfCnpj: string;
  rgInscricaoSocial: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  tipoProprietario: string;
}

export const linkOwnerRequest = async (payload: Owner[], idPropriedade: number) => {
  try {
    const { data } = await api.post("/propriedade-prem/cadastro/proprietarios", payload, {
      params: { idPropriedade }
    });
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};

export const useLinkOwnerToFarm = (idPropriedade: number) => {
  return useMutation<Response, AxiosError, Owner[]>({
    mutationFn: (payload: Owner[]) => linkOwnerRequest(payload, idPropriedade),
  });
};