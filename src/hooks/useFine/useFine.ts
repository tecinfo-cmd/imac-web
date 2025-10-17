import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetFine = (idPropriedade: string) => {
     return useQuery({
    queryKey: ["Fines", idPropriedade],
    queryFn: async () => {
      const response = await api.get(`boletos/pagamento-multas/${idPropriedade}`);
      return response.data;
    },
    enabled: !!idPropriedade,
  });
};