import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY_GET_AUTO_INSPECTION = "auto-inspection";

export interface Form {
  id: number;
  name: string;
  type: string;
  url: string;
}

export interface AutoInspection {
  id: number;
  startDate: string;
  endDate: string;
  inspectionStatus: string;
  inspection: string;
  surveyId: string;
  forms: Form[];
}

export const getAutoInspection = async () => {
  try {
    const { data } = await api.get("/auto-vistoria");
    return data as AutoInspection[];
  } catch (error) {
    return Promise.reject(error);
  }
};

export function useGetAutoInspection() {
  return useQuery({
    queryKey: [QUERY_KEY_GET_AUTO_INSPECTION],
    queryFn: getAutoInspection,
  });
} 