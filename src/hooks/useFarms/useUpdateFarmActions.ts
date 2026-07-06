import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface FarmActionsPayload {
  idPropriedade: number;
  contestarDeteccoes?: boolean;
  confirmarDeteccoes?: boolean;
  termoAssinado?: boolean;
  proporNovaArea?: boolean;
  confirmarEstrategia?: boolean;
}

export const updateFarmActionsRequest = async (data: FarmActionsPayload) => {
  try {
    const response = await api.put("/propriedade-prem/acoes", {
      idPropriedade: data.idPropriedade,
      contestarDeteccoes: data.contestarDeteccoes ?? false,
      confirmarDeteccoes: data.confirmarDeteccoes ?? false,
      termoAssinado: data.termoAssinado ?? false,
      proporNovaArea: data.proporNovaArea ?? false,
      confirmarEstrategia: data.confirmarEstrategia ?? false,
    });

    return response.data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};

export const useUpdateFarmActions = () => {
  return useMutation<unknown, AxiosError, FarmActionsPayload>({
    mutationFn: updateFarmActionsRequest,
  });
};