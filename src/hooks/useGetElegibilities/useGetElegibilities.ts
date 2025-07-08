import { api } from "@/api/index";
import { useQuery } from "@tanstack/react-query";

export const useGetElegibilities = (filters: any) => {
  return useQuery({
    queryKey: ["elegibilities", filters],
    queryFn: async () => {
      const response = await api.get("elegibilidades/listar");
      const all = response.data?.data ?? [];

      const { carFederal, nomePropriedade, cpfCnpj, status, email } = filters;
      return all.filter((item: any) => {
        const matchCAR = carFederal
          ? item.carFederal?.trim().toUpperCase() ===
            carFederal.trim().toUpperCase()
          : true;

        const matchNome = nomePropriedade
          ? item.nomePropriedade
              ?.toLowerCase()
              .includes(nomePropriedade.toLowerCase())
          : true;

        const matchCPF = cpfCnpj ? item.cpfCnpj === cpfCnpj : true;

        const matchStatus = status ? item.status === status : true;

        const matchEmail = email
          ? item.email?.toLowerCase().includes(email.toLowerCase())
          : true;

        return matchCAR && matchNome && matchCPF && matchStatus && matchEmail;
      });
    },
    enabled: true,
  });
};
