import { api } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = `${process.env.NEXT_PUBLIC_API_HOST}documentos-orientativos`;

export function useGuidelines(filters = {}, page = 1) {
  const limit = 10;
  return useQuery({
    queryKey: ["guidelines", page, filters],
    queryFn: async () => {
      console.log("Filtros na API:", filters);
      const { data } = await api.get(`${API_URL}`, {
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

export function useCreateGuideline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (guideline: any) => {
      const { data } = await api.post(`${API_URL}`, guideline, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guidelines"] });
    },
  });
}

export function useGuidelineById(id: string | null) {
  return useQuery({
    queryKey: ["guideline", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get(`${API_URL}/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useDeleteGuideline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`${API_URL}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guidelines"] });
    },
  });
}

export function useUpdateGuideline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { data } = await api.patch(`${API_URL}/${id}/status`, { ativo });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["guidelines"] });
      queryClient.invalidateQueries({ queryKey: ["guideline", variables.id] });
    },
  });
}

export function useUpdateGuidelineStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: any }) => {
      const { data } = await api.patch(`${API_URL}/${id}/status`, status);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["guidelines"] });
      queryClient.invalidateQueries({ queryKey: ["guideline", variables.id] });
    },
  });
}
