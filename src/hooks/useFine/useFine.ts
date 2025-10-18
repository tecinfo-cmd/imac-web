import { api } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetFine = (idPropriedade: string) => {
  return useQuery({
    queryKey: ["Fines", idPropriedade],
    queryFn: async () => {
      const response = await api.get(
        `boletos/pagamento-multas/${idPropriedade}`
      );
      return response.data;
    },
    enabled: !!idPropriedade,
  });
};

export const useImprimirBoleto = () => {
  return useMutation({
    mutationFn: async (linhaDigitavel: string) => {
      const { data } = await api.get(`/boletos/imprimir/${linhaDigitavel}`);
      return data;
    },
  });
};
