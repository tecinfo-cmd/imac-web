import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetPropriedades = (filters: any) => {
  const cleanFilters = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(filters).filter(([_, v]) => v !== null && v !== "")
  );

  return useQuery({
    queryKey: ["proprerties", cleanFilters],
    queryFn: async () => {
      const response = await api.get("propriedade-prem", {
        params: cleanFilters,
      });
      return response.data?.data ?? [];
    },
    enabled: true, 
  });
};
