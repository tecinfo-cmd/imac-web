//import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { api } from "@/api/index";
import { yup } from "@/config/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

const unmask = (value: string) => value.replace(/\D/g, "");

const schema = yup.object().shape({
  nome: yup
    .string()
    .required()
    .test("nome-completo", "Digite o nome completo", (value) => {
      if (!value) return false;
      const partes = value.trim().split(" ");
      return partes.length >= 2 && partes.every((p) => p.length > 1);
    }),
  cpf: yup
    .string()
    .required()
    .matches(
      /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/,
      "CPF inválido"
    ),
  rgie: yup.string().required(),
  telefone: yup
    .string()
    .required()
    .matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido"),
  email: yup.string().required(),
  profissao: yup.string().required(),
  perfil: yup.string().required(),
  tipo: yup.string().required(),
});

export const useUserRegister = () => {
  //const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: yupResolver(schema),
  });

  const { reset } = form;

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    const roleData =
      data.perfil === "ADMINISTRATIVO"
        ? { nome: "ADMINISTRATIVO", id: 1 }
        : data.perfil === "ANALISTA"
        ? { nome: "ANALISTA", id: 2 }
        : null;

    const payload = {
      ...data,
      nome: data.nome ?? null,
      cpf: data.cpf ? unmask(data.cpf) : null,
      rgie: data.rgie ? unmask(data.rgie) : null,
      telefone: data.telefone ? unmask(data.telefone) : null,
      email: data.email ?? null,
      profissao: data.profissao ?? null,
      tipo: data.tipo ?? null,
      roles: roleData ? [roleData] : [],
    };
    try {
      console.log("Payload que será enviado:", payload);

      await api.post("usuario", payload);
      toast.success("Usuário cadastrado com sucesso!", { duration: 3000 });
      reset();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Erro desconhecido.";
      console.error("Erro ao cadastrar usuário:", error);
      toast.error("Erro ao cadastrar usuário. tente novamente.", {
        duration: 3000,
      });
      console.log(`${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...form,
    onSubmit,
    isLoading,
  };
};
