import { api } from "@/api/index";
import { useQuery } from "@tanstack/react-query";

export const useGetElegibilities = (filters: any) => {
  return useQuery({
    queryKey: ["elegibilities", filters],
    queryFn: async () => {
      const response = await api.get("elegibilidades/listar", { params: filters });
      return response.data?.data ?? [];
    },
    enabled: true, 
  });
};
