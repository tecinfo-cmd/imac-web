
import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";


interface TechnicalResponsibleAddress {
  cep: string;
  longitude: number;
  latitude: number;
  municipio: string;
  estado: string;
  logradouro: string;
  complemento: string;
}

interface TechnicalResponsible {
  cpf: string;
  nome: string;
  profissao: string;
  registroCrea: string;
  telefone: string;
  email: string;
  endereco: TechnicalResponsibleAddress;
}

interface TechnicalResponsibleResponse {
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

export const createTechnicalResponsibleRequest = async (payload: TechnicalResponsible) => {
  try {
    const { data } = await api.post("/responsavel-tecnico", payload);
    return data as TechnicalResponsibleResponse;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};

export const useCreateTechnicalResponsible = () => {
  return useMutation({
    mutationFn: createTechnicalResponsibleRequest,
  });
}; 