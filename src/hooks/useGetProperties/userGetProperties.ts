import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetPropriedades = (filters: any) => {
  return useQuery({
    queryKey: ["proprerties", filters],
    queryFn: async () => {
      const response = await api.get("propriedade-prem", {
        params: filters,
      });
      return response.data?.data ?? [];
    },
    enabled: true, 
  });
};
