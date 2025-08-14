import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export interface TechnicalResponsible {
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

interface TechnicalResponsibleResponse {
  data: TechnicalResponsible[];
  total: number;
  page: number;
  size: number;
}

export const useGetTechnicalResponsible = (cpf?: string) => {
  return useQuery({
    queryKey: ["technicalResponsible", cpf],
    queryFn: async (): Promise<TechnicalResponsibleResponse> => {
      if (!cpf) {
        throw new Error("CPF is required");
      }

      const response = await api.get<TechnicalResponsibleResponse>("/responsavel-tecnico", {
        params: { cpf }
      });

      return response.data;
    },
    enabled: !!cpf,
  });
};
