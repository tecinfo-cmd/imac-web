import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetElegibilityDetail = (id: number | string | null, enabled = false) => {
  return useQuery({
    queryKey: ["elegibility-detail", id],
    queryFn: async () => {
      const response = await api.get(`elegibilidades/buscar-por-id/${id}`);
      return response.data;
    },
    enabled: !!id && enabled,
  });
};
