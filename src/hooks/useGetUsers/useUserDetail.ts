import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { api } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
//import type { UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

type SelectOption = { label: string; value: string };

export type UserDetailForm = {
  telefone: string;
  perfil: SelectOption | null;
  tipo: SelectOption | null;
  profissao: string;
};

interface Pessoa {
  telefone: string | null;
  nome: string;
  cpfCnpj: string;
  rgie: string;
}

interface Role {
  id: number;
  nome: string;
}

interface Usuario {
  id: number;
  email: string;
  cargo: string;
  tipo: string;
  profissao: string;
  pessoa: Pessoa;
  roles: Role[];
}

export const useUserDetail = (email: string | string[] | undefined) => {
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery<Usuario, Error>({
    queryKey: ["userByEmail", email],
    queryFn: async () => {
      const { data } = await api.get(`/usuario/email/${email}`);
      return data;
    },
    enabled: !!email,
  });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty },
  } = useForm<UserDetailForm>({
    defaultValues: {
      telefone: "",
      perfil: null,
      tipo: null,
      profissao: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (userData) {
      reset({
        telefone: userData.pessoa?.telefone || "",
        perfil:
          userData.roles && userData.roles.length > 0
            ? { label: userData.roles[0].nome, value: userData.roles[0].nome }
            : null,
        tipo: userData.tipo
          ? {
              label:
                userData.tipo === "PF"
                  ? "Pessoa Física"
                  : userData.tipo === "PJ"
                  ? "Pessoa Jurídica"
                  : userData.tipo,
              value: userData.tipo,
            }
          : null,
        profissao: userData.profissao || "",
      });
    }
  }, [userData, reset]);

  const mutation = useMutation({
    mutationFn: async (formData: UserDetailForm) => {
      if (!userData) {
        toast.error("Usuário não carregado.");
        return;
      }

      const roleData =
        formData.perfil?.value === "ADMINISTRATIVO"
          ? { nome: "ADMINISTRATIVO", id: 1 }
          : formData.perfil?.value === "ANALISTA"
          ? { nome: "ANALISTA", id: 2 }
          : null;

      const payload: any = {
        telefone: formData.telefone,
        tipo: formData.tipo,
        profissao: formData.profissao,
      };

      if (roleData) {
        payload.roles = [roleData];
      }

      const response = await api.patch(`/usuario/${userData.id}`, payload);

      console.log("Resposta PATCH:", response.data);
      console.log(payload);

      console.log("Status:", response.status);

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userByEmail", email] });
      toast.success("Usuário atualizado com sucesso!", { duration: 3000 });

      const currentValues = getValues();
      reset(currentValues);
    },
    onError: () => {
      toast.error("Erro ao cadastrar usuário. tente novamente.", {
        duration: 3000,
      });
    },
  });

  const onSubmit = (data: UserDetailForm) => {
    mutation.mutate(data);
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    userData,
    isLoading,
    isDirty,
    isSaving: mutation.isPending,
  };
};
