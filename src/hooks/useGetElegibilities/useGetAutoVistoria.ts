import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY_GET_AUTO_INSPECTION = "auto-inspection";

export interface Form {
  id: number;
  name: string;
  type: string;
  url: string;
  
}

export interface Formularios {
  reportUrl: string | null;
  title: string;
  comments: string | null;
  mobileImei: string | null;
  quizzes: any[];
}

export interface AutoInspection {
  id: number;
  startDate: string;
  dataTermino: string;
  statusVistoria: string;
  vistoria: string;
  surveyId: string;
  forms: Form[];
  formularios: Formularios;
}

export const getAutoInspection = async (idPropriedade: number) => {
  try {
    const { data } = await api.get("/auto-vistoria",
      {
          params: {
            idPropriedade,
          },
        }
    );
    return data as AutoInspection[];
  } catch (error) {
    return Promise.reject(error);
  }
};

export function useGetAutoInspection(idPropriedade: number) {
  return useQuery({
    queryKey: [QUERY_KEY_GET_AUTO_INSPECTION, idPropriedade],
    queryFn: () => getAutoInspection(idPropriedade),
  });
} 