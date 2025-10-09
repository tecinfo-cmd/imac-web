import { api } from "@/api/index";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (filters: any) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async () => {
      const response = await api.get("usuario/listar", {
        params: filters,
      });

      return response.data ?? { data: [], total: 0, page: 1, size: 10 };
    },
    enabled: true,
  });
};
