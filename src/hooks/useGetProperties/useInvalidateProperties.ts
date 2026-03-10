import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useInvalidateProperties = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`propriedade-prem/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Propriedade inativada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao inativar propriedade.");
    },
  });
};
