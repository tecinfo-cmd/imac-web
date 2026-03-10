import { api } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

interface CreateSelfInspectionPayload {
  dataInicio: string;
  idPropriedade: number;
}

interface SelfInspection {
  id: number;
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

export function useSendParecerAutoVistoria() {
  return useMutation({
    mutationFn: async ({
      id,
      status,
      file,
    }: {
      id: number;
      status: string;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append(
        "parametros",
        JSON.stringify([
          { nome: file.name, tipo: "PARECER_AUTO_VISTORIA" },
        ])
      );
      formData.append("arquivos", file);
      formData.append("status", status);

      const { data } = await api.post(
        `/auto-vistoria/${id}/parecer-auto-vistoria`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    },
  });
}
