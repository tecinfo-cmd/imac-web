
import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";


interface SuitabilityPlanRequest {
  parametros: string;
  arquivos: File[];
  motivo: string;
  idResponsavelTecnico: number;
}

interface SuitabilityPlanResponse {
  id: string;
  parametros: string;
  arquivos: string[];
  motivo: string;
  idResponsavelTecnico: number;
}

const createSuitabilityPlanRequest = async (
  farmId: number,
  analysisId: number,
  data: SuitabilityPlanRequest
): Promise<SuitabilityPlanResponse> => {
  const formData = new FormData();

  data.arquivos.forEach((file) => {
    formData.append("arquivos", file);
  });

  formData.append("parametros", data.parametros);
  formData.append("motivo", data.motivo);
  formData.append("idResponsavelTecnico", data.idResponsavelTecnico.toString());

  const response = await api.post(
    `/propriedade-prem/${farmId}/analise-socioambiental/${analysisId}/plano-adequacao`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const useCreateSuitabilityPlan = () => {
  return useMutation({
    mutationFn: ({
      farmId,
      analysisId,
      data,
    }: {
      farmId: number;
      analysisId: number;
      data: SuitabilityPlanRequest;
    }) => createSuitabilityPlanRequest(farmId, analysisId, data),
  });
}; 