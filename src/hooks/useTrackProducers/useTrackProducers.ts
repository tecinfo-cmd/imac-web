import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

const API_URL = `${process.env.NEXT_PUBLIC_API_HOST}frigoficos`;

export function useAbattoirUser() {
  return useQuery({
    queryKey: ["abattoir-user"],
    queryFn: async () => {
      const { data } = await api.get(`${API_URL}/usuario`);
      return data;
    },
  });
}

export function useTrackProducers(filters = {}, page = 1) {
  const limit = 10;
  const { data: abattoirUser } = useAbattoirUser();
  const idFrigorifico = abattoirUser?.id;

  return useQuery({
    queryKey: ["vouchers", page, filters, idFrigorifico],
    queryFn: async () => {
      if (!idFrigorifico) return { data: [], total: 0, page, size: limit };
      const { data } = await api.post(`${API_URL}/voucher`, {}, {
        params: { page, size: limit, idFrigorifico, ...filters },
      });
      return data ?? {
        data: [],
        total: data.length ?? 0,
        page,
        size: limit,
      };
    },
    enabled: !!idFrigorifico,
  });
}

export function usePremCompliance({ idPropriedade, carFederal }: { idPropriedade?: number; carFederal?: string }) {
  return useQuery({
    queryKey: ["prem-compliance", idPropriedade, carFederal],
    queryFn: async () => {
      const { data } = await api.get("propriedade-prem/conformidade-socioambiental", {
        params: {
          idPropriedade,
          carFederal,
        },
      });
      return data;
    },
    enabled: !!idPropriedade || !!carFederal,
  });
}
