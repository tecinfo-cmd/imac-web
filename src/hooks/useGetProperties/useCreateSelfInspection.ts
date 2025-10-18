import { api } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

interface CreateSelfInspectionPayload {
  dataInicio: string;
  idPropriedade: number;
}

interface SelfInspection {
  dataInicio: string;
  statusVistoria: string;
  vistoria: string;
  formularios: {
    reportUrl: string | null;
  };
}

export function useCreateSelfInspection() {
  return useMutation({
    mutationFn: async (payload: CreateSelfInspectionPayload) => {
      const { data } = await api.post("auto-vistoria/cadastro", payload);
      return data;
    },
  });
}

export function useGetSelfInspections(idPropriedade: number) {
  return useQuery<SelfInspection[]>({
    queryKey: ["self-inspections", idPropriedade],
    queryFn: async () => {
      const { data } = await api.get<SelfInspection[]>("auto-vistoria", {
        params: {
          idPropriedade,
        },
      });
      return data;
    },
    enabled: !!idPropriedade,
  });
}
