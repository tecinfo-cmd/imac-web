import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY_GET_PRODUCTION_CYCLE = "production-cycle";

interface ProductionCycle {
  id: number;
  descricao: string;
}

export const getProductionCycle = async () => {
  try {
    const { data } = await api.get("/propriedade-prem/ciclo-producao");
    return data as ProductionCycle[];
  } catch (error) {
    return Promise.reject(error);
  }
};

export function useGetProductionCycle() {
  return useQuery({
    queryKey: [QUERY_KEY_GET_PRODUCTION_CYCLE],
    queryFn: getProductionCycle,
  });
}
