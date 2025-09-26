import { api } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

const API_URL = `${process.env.NEXT_PUBLIC_API_HOST}frigoficos`;

export function useAbattoirElegibilities(filters = {}, page = 1) {
  const limit = 10;
  return useQuery({
    queryKey: ["elegibilities", page, filters],
    queryFn: async () => {
      const { data } = await api.get(`${API_URL}/elegibilidades`, {
        params: { page, size: limit, ...filters },
      });
      console.log(data);
      return {
        data: data[0] ?? [],
        total: data[1] ?? 0,
        page,
        size: limit,
      };
    },
  });
}

export function useCheckElegibility(options: any = {}) {
  return useMutation({
    mutationFn: async (numeroCar: string) => {
      const { data } = await api.get(`${API_URL}/elegibilidade/${numeroCar}`);
      return data;
    },
    ...options,
  });
}
