import { api } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = `${process.env.NEXT_PUBLIC_API_HOST}frigoficos`;

export function useAbattoir(filters = {}, page = 1) {
  const limit = 10;
  return useQuery({
    queryKey: ["abattoirs", page, filters],
    queryFn: async () => {
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

export function useCreateAbattoir() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (abattoir: any) => {
      const formData = new FormData();

      if (abattoir.termoCooperacao && abattoir.termoCooperacao[0]) {
        formData.append("arquivos", abattoir.termoCooperacao[0]);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { termoCooperacao, ...rest } = abattoir;

      rest.cep = rest.cep?.replace(/\D/g, "");
      rest.cnpj = rest.cnpj?.replace(/\D/g, "");
      rest.telefone = rest.telefone?.replace(/\D/g, "");

      formData.append("arquivos", abattoir.termoCooperacao);
      formData.append("parametros", JSON.stringify(rest));
      
      const { data } = await api.post(`${API_URL}/cadastrar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abattoirs"] });
    },
  });
}

export function useCreateUserAbattoir() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...abattoir }: any) => {
      const { data } = await api.post(`${API_URL}/usuario/${id}`, abattoir);
      console.log("ID do abatedouro:", id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abattoirs"] });
    },
  });
}

export function useInvalidateAbattoir() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.put(`${API_URL}/inativar/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abattoirs"] });
    },
  });
}

export function useUpdateUserAbattoir() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...abattoir }: any) => {
      const { data } = await api.patch(`${API_URL}/usuario/${id}`, abattoir);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abattoirs"] });
    },
  });
}
