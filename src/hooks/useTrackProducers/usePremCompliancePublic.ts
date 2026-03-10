import { useQuery } from "@tanstack/react-query";

export function usePremCompliancePublic({ 
  idPropriedade, 
  carFederal 
}: { 
  idPropriedade?: number
  carFederal?: string 
}) {
  return useQuery({
    queryKey: ["prem-compliance-public", idPropriedade, carFederal],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (idPropriedade) params.append("idPropriedade", String(idPropriedade));
      if (carFederal) params.append("carFederal", carFederal);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}propriedade-prem/conformidade-socioambiental?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao buscar conformidade");
      return await response.json();
    },
    enabled: !!idPropriedade || !!carFederal,
  });
}