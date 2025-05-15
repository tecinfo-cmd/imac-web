import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface Endereco {
  cep: string;
  longitude: number;
  latitude: number;
  municipio: string;
  estado: string;
  codigoPostal: string;
  logradouro: string;
  complemento: string;
}

interface UpdateFarmPayload {
  endereco?: Endereco;
  idAtividadePrincipal?: number;
  idCicloProducao?: number;
  tamanhoPropriedade?: number;
  numeroProprietarios?: number;
}

interface UpdateFarmArgs {
  idPropriedade: number;
  data: UpdateFarmPayload;
}

export const updateFarmRequest = async ({ idPropriedade, data }: UpdateFarmArgs) => {
  try {
    const response = await api.put("/propriedade-prem/dados-basicos", data, {
      params: {
        idPropriedade,
      },
    });
    return response.data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};

export const useUpdateFarm = () => {
  return useMutation<unknown, AxiosError, UpdateFarmArgs>({
    mutationFn: updateFarmRequest,
  });
};
