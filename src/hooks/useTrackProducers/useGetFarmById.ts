import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY_GET_FARM_BY_ID_PUBLIC = "farm-by-id-public";

export const getFarmByIdPublic = async (id: number | undefined) => {
  if (!id) return null;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}propriedade-prem/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Erro ao buscar propriedade");
  return await response.json();
};

export function useGetFarmByIdPublic(id: number | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY_GET_FARM_BY_ID_PUBLIC, id],
    queryFn: () => getFarmByIdPublic(id),
    enabled: !!id,
  });
}
