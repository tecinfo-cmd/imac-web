import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY_GET_CITIES = "cities";

interface City {
  id: number;
  codigo: string;
  nome: string;
  uf: string;
}

export const getCities = async () => {
  try {
    const { data } = await api.get("/propriedade-prem/cidade/");
    return data as City[];
  } catch (error) {
    return Promise.reject(error);
  }
};

export function useGetCities() {
  return useQuery({
    queryKey: [QUERY_KEY_GET_CITIES],
    queryFn: getCities,
  });
}