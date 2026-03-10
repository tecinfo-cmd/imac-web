import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface SuppressionAuthorizationData {
  motivo: string;
  idResponsavelTecnico: number;
  parametros: string;
  arquivos: File[];
  autorizacoesSupressoes: string;
}

const createSuppressionAuthorizationRequest = async (
  data: SuppressionAuthorizationData,
  farmId: number,
  analysisId: number
) => {
  const formData = new FormData();

  data.arquivos.forEach((file) => {
    formData.append("arquivos", file);
  });

  formData.append("motivo", data.motivo);
  formData.append("idResponsavelTecnico", data.idResponsavelTecnico.toString());
  formData.append("parametros", data.parametros);
  formData.append("autorizacoesSupressoes", data.autorizacoesSupressoes);

  const response = await api.post(
    `/propriedade-prem/${farmId}/analise-socioambiental/${analysisId}/contestacao-autorizacao-supressao`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const useCreateSuppressionAuthorization = (farmId: number, analysisId: number) => {
  return useMutation<unknown, AxiosError, SuppressionAuthorizationData>({
    mutationFn: (data: SuppressionAuthorizationData) =>
      createSuppressionAuthorizationRequest(data, farmId, analysisId),
  });
}; 