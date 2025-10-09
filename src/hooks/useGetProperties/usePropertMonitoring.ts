import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export type PropriedadeDetailForm = {
  nomePropriedade: string;
  carFederal: string;
  municipio: string;
  estado: string;
  voucher: string;
  etapa: string;
  status: string;
};

interface Cidade {
  nome: string;
  uf: string;
}

interface PropriedadeResponse {
  id: number;
  nomePropriedade: string;
  carFederal: string;
  cidade: Cidade;
  voucher: string;
  etapa: string;
  status: string;
}

export const usePropertyMonitoring = (id?: string | number) => {
  const { data, isLoading } = useQuery<PropriedadeResponse>({
    queryKey: ["propriedadeById", id],
    queryFn: async () => {
      const { data } = await api.get(`propriedade-prem/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<PropriedadeDetailForm>({
    defaultValues: {
      nomePropriedade: "",
      carFederal: "",
      municipio: "",
      estado: "",
      voucher: "",
      etapa: "",
      status: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      reset({
        nomePropriedade: data.nomePropriedade,
        carFederal: data.carFederal,
        municipio: data.cidade?.nome,
        estado: data.cidade?.uf,
        voucher: data.voucher,
        etapa: data.etapa,
        status: data.status,
      });
    } else if (!isLoading && id) {
      toast.error("Erro ao carregar dados da propriedade.");
    }
  }, [data, reset, isLoading, id]);

  return {
    control,
    handleSubmit,
    data,
    isLoading,
    isDirty,
  };
};
