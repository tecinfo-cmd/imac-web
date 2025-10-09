import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY_GET_ISSUING_BODIES = "issuing-bodies";

interface IssuingBody {
  id: string;
  nome: string;
}

export const getIssuingBodies = async () => {
  try {
    const { data } = await api.get("/propriedade-prem/analise-socioambiental/orgaos-emissores-autorizacao-supressao");
    return data as IssuingBody[];
  } catch (error) {
    return Promise.reject(error);
  }
};

export function useGetIssuingBodies() {
  return useQuery({
    queryKey: [QUERY_KEY_GET_ISSUING_BODIES],
    queryFn: getIssuingBodies,
  });
}
