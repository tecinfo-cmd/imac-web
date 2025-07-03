// src/hooks/useGetDashboardData.ts
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface Indicador {
  tipo: string;
  valor: string;
  porcentagem: string;
}

interface InfoPorDia {
  dia: string;
  solicitacoes: string;
  compra_voucher: string;
  propriedades_elegiveis: string;
}

interface DashboardData {
  porIndicadores: Indicador[];
  infoPorDias: InfoPorDia[];
}

export const useGetDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const response = await api.get("elegibilidades/grafico-acompanhamento-geral");
      return response.data;
    },
  });
};
