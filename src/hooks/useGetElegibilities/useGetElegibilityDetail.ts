import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetElegibilityDetail = (car: string, enabled = false) => {
  return useQuery({
    queryKey: ["elegibility-detail", car],
    queryFn: async () => {
      const response = await api.get("elegibilidades/solicitacoes", {
        params: { carFederal: car },
      });
      return response.data;
    },
    enabled,
  });
};
