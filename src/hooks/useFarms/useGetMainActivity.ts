import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY_GET_MAIN_ACTIVITY = "main-activity";

interface MainActivity {
  id: number;
  descricao: string;
}

export const getMainActivity = async () => {
  try {
    const { data } = await api.get("/propriedade-prem/atividade-principal");
    return data as MainActivity[];
  } catch (error) {
    return Promise.reject(error);
  }
};

export function useGetMainActivity() {
  return useQuery({
    queryKey: [QUERY_KEY_GET_MAIN_ACTIVITY],
    queryFn: getMainActivity,
  });
}
