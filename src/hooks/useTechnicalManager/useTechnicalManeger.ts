import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useTechnicalManager(filters = {}, page = 1) {
  const limit = 10;
  return useQuery({
    queryKey: ["technical", page, filters],
    queryFn: async () => {
      const { data } = await api.get("responsavel-tecnico", {
        params: { page, size: limit, ...filters },
      });
      return {
        data: data.data ?? [],
        total: data.total ?? 0,
        page: data.page ?? 1,
        size: data.pageSize ?? 10,
      };
    },
  });
}