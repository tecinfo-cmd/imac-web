import { api } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

const API_URL = `${process.env.NEXT_PUBLIC_API_HOST}frigoficos`;

export function useAbattoirUser() {
  return useQuery({
    queryKey: ["abattoir-user"],
    queryFn: async () => {
      const { data } = await api.get(`${API_URL}/usuario`);
      return data;
    },
  });
}

export function useAbattoirElegibilities(
  filters = {},
  page = 1,
  refreshKey = 0
) {
  const limit = 10;
  return useQuery({
    queryKey: ["elegibilities", page, filters, refreshKey],
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

export function useCreateProdutor(options: any = {}) {
  return useMutation({
    mutationFn: async (produtorData: any) => {
      const { data } = await api.post(`${API_URL}/produtor`, produtorData);
      return data;
    },
    ...options,
  });
}
