import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ReportContestationData {
  parametros: string;
  motivo: string;
  arquivos: File[];
}

const createReportContestationRequest = async (
  data: ReportContestationData,
  farmId: number,
  analysisId: number
) => {
  const formData = new FormData();

  data.arquivos.forEach((arquivo) => {
    formData.append("arquivos", arquivo);
  });

  formData.append("parametros", data.parametros);
  formData.append("motivo", data.motivo);

  const response = await api.post(
    `/propriedade-prem/${farmId}/analise-socioambiental/${analysisId}/contestacao-laudo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const useCreateReportContestation = (farmId: number, analysisId: number) => {
  return useMutation<unknown, AxiosError, ReportContestationData>({
    mutationFn: (data: ReportContestationData) =>
      createReportContestationRequest(data, farmId, analysisId),
  });
}; 