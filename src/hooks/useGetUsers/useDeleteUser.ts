import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      return await api.delete(`/usuario/${userId}`);
    },
    onSuccess: () => {
      toast.success("Usuário desativado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Erro ao desativar usuário. Tente novamente.");
    },
  });
};
