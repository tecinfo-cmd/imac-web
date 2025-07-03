import { api } from "@/api/index";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (filters: any) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async () => {
      const response = await api.get("usuario/listar", {
        params: filters,
      });

      return response.data.data ?? []; 
    },
    enabled: true,
  });
};
