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
}

export function useCreateSelfInspection() {
  return useMutation({
    mutationFn: async (payload: CreateSelfInspectionPayload) => {
      const { data } = await api.post(
        "auto-vistoria/cadastro",
        payload
      );
      return data;
    },
  });


}

export function useGetSelfInspections() {
  return useQuery<{data: SelfInspection[]}>({
    queryKey: ["self-inspections"],
    queryFn: async () => {
      const { data } = await api.get<{data: SelfInspection[]}>(
        "auto-vistoria"
      );
      return data;
    },
  });
}
