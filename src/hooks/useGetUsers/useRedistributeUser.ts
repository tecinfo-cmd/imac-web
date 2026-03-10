import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRedistributeUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      return await api.put(`/usuario/redistribuir/${userId}`);
    },
    onSuccess: () => {
      toast.success("Redistribuído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Erro ao redistribuir. Tente novamente.");
    },
  });
};