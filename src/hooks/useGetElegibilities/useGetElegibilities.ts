import { api } from "@/api/index";
import { useQuery } from "@tanstack/react-query";

export const useGetElegibilities = (filters: any) => {
  return useQuery({
    queryKey: ["elegibilities", filters],
    queryFn: async () => {
      const response = await api.get("elegibilidades/listar", {
        params: filters,
      });

      return response.data ?? { data: [], total: 0, page: 1, size: 10 };
    },
    enabled: true,
  });
};

