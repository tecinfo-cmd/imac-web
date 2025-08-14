import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface SuppressionType {
  id: string;
  nome: string;
}

export const useGetSuppressionTypes = () => {
  return useQuery({
    queryKey: ["suppressionTypes"],
    queryFn: async () => {
      const { data } = await api.get("/propriedade-prem/analise-socioambiental/tipos-contestacao-autorizacao-supressao");
      return data as SuppressionType[];
    },
  });
}; 