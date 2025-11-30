import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      return await api.patch(`/usuario/${userId}`, { status: "ATIVO" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Usuário ativado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao ativar usuário.");
    },
  });
};
