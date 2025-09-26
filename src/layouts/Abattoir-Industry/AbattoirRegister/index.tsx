"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PiSealCheckLight } from "react-icons/pi";

import { Modal } from "../../DashboardUser/Properties/[id]/SelfInspection/components/Modal";
import { Input } from "@/components/Input";
import { InputFileUpload } from "@/components/InputFile";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import {
  useCreateAbattoir,
  useCreateUserAbattoir,
} from "@/hooks/useAbattoir/useAbattoir";
import { Abattoir } from "@/icons/Abattoir";
import { maskCep } from "@/utils/maskCEP";
import { maskCPFOrCNPJ } from "@/utils/maskCPFOrCNPJ";
import { maskPhone } from "@/utils/maskPhone";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

function validarTelefone(telefone: string): boolean {
  const regex =
    /^(?:(?:\+|00)?(55)\s?)?(?:([1-9][1-9]))?\s?(?:9?\d{4})-?(\d{4})$/;
  return regex.test(telefone);
}

const schema = yup.object({
  razaoSocial: yup.string().required(),
  nomeFantasia: yup.string().required(),
  ie: yup.string().required(),
  cnpj: yup.string().required(),
  telefone: yup
    .string()
    .required()
    .test("validar-telefone", "Telefone inválido", (value) =>
      value ? validarTelefone(value) : false
    ),
  cep: yup.string().required(),
  endereco: yup.string().required(),
  municipio: yup.string().required(),
  qtuVoucher: yup
    .number()
    .typeError("Digite um número válido")
    .required()
    .min(1),
  termoCooperacao: yup.mixed().required(),
});

const userSchema = yup.object({
  cpf: yup.string().required(),
  nome: yup.string().required(),
  email: yup.string().email().required(),
});

const defaultValues = {
  razaoSocial: "",
  nomeFantasia: "",
  ie: "",
  cnpj: "",
  telefone: "",
  cep: "",
  endereco: "",
  municipio: "",
  qtuVoucher: "",
  termoCooperacao: null,
};

export const AbattoirRegisterLayout = ({
  defaultValues: propsDefaultValues,
}: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [createdAbattoirId, setCreatedAbattoirId] = useState<string | null>(
    null
  );

  const createAbattoir = useCreateAbattoir();
  const createUserAbattoir = useCreateUserAbattoir();

  const {
    control,
    handleSubmit,
    reset: resetAbattoirForm,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { isSubmitting: isSubmittingAbattoir },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: propsDefaultValues || defaultValues,
  });

  const cep = watch("cep");

  useEffect(() => {
    const fetchEndereco = async () => {
      const rawCEP = cep?.replace(/\D/g, "");
      if (rawCEP?.length === 8) {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${rawCEP}/json/`);
          const data = await res.json();

          if (data.erro) {
            setError("cep", {
              type: "manual",
              message: "CEP inválido.",
            });
            return;
          }

          setValue("endereco", data.logradouro || "");
          setValue("municipio", `${data.localidade || ""}-${data.uf || ""}`);
        } catch (error) {
          console.error("Erro ao buscar o CEP:", error);
        }
      }
    };

    fetchEndereco();
  }, [cep, setValue, setError]);

  useEffect(() => {
    if (cep?.replace(/\D/g, "").length !== 8) {
      clearErrors("cep");
    }
  }, [cep, clearErrors]);

  const {
    control: userControl,
    handleSubmit: handleUserSubmit,
    reset: resetUserForm,
    formState: { isSubmitting: isSubmittingUser },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: { cpf: "", nome: "", email: "" },
  });

  const customMenuItems = [
    {
      label: "Elegibilidade",
      href: "/dashboard/abattoir-industry/elegibilityAbattoir",
      icon: <PiSealCheckLight size={44} />,
    },
    {
      label: "Frigorificos",
      href: "/dashboard/abattoir-industry",
      icon: <Abattoir size={44} />,
    },
  ];

  const handleAbattoirSubmit = async (data: any) => {
    try {
      const response = await createAbattoir.mutateAsync(data);
      setCreatedAbattoirId(response?.id);
      resetAbattoirForm();
      toast.success("Frigorífico cadastrado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar frigorífico.");
    }
  };

  const handleUserAbattoirSubmit = async (data: any) => {
    try {
      await createUserAbattoir.mutateAsync({ id: createdAbattoirId, ...data });
      resetUserForm();
      setModalOpen(false);
      toast.success("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar usuário.");
    }
  };

  return (
    <LayoutContainer title="Cadastrar Frigorifico" menuItems={customMenuItems}>
      <form
        onSubmit={handleSubmit(handleAbattoirSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Input
          name="razaoSocial"
          label="Razão Social"
          placeholder="Digite a razão social"
          control={control}
        />
        <Input
          name="nomeFantasia"
          label="Nome Fantasia"
          placeholder="Digite o nome fantasia"
          control={control}
        />
        <Input
          name="ie"
          label="IE"
          placeholder="00.000.000-0"
          control={control}
        />

        <Input
          name="cnpj"
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          control={control}
          mask={maskCPFOrCNPJ}
        />

        <Input
          name="telefone"
          label="Telefone"
          placeholder="(00) 0 0000 - 0000"
          control={control}
          mask={maskPhone}
        />

        <Input
          name="cep"
          label="CEP"
          placeholder="00.000-000"
          control={control}
          mask={maskCep}
        />

        <Input
          name="endereco"
          label="Endereço"
          placeholder="Digite o endereço"
          control={control}
        />

        <Input
          name="municipio"
          label="Município-UF"
          placeholder="Digite o município"
          control={control}
        />

        <Input
          name="qtuVoucher"
          label="Quantidade de voucher acordado"
          placeholder="Digite a quantidade de voucher"
          control={control}
        />

        <InputFileUpload
          name="termoCooperacao"
          label="Termo de Cooperação"
          control={control}
          accept=".pdf"
        />

        <div className="flex justify-end md:col-span-3">
          <Button type="submit" disabled={isSubmittingAbattoir}>
            {isSubmittingAbattoir ? "Salvando..." : "Salvar"}
          </Button>
        </div>

        <div className="col-span-full flex justify-between mt-4">
          <h1 className="text-2xl font-semibold">Usuários da Indústria</h1>
          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            disabled={!createdAbattoirId}
          >
            + Adicionar Usuários
          </Button>
        </div>

        <Link
          href="/dashboard/abattoir-industry"
          className="text-[#21801A] underline"
        >
          Voltar
        </Link>
      </form>

      <Modal.Container isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header className="text-[#21801A]">
          Cadastro de Usuário Frigorifico
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUserSubmit(handleUserAbattoirSubmit)}>
            <Input name="cpf" label="CPF" control={userControl} />
            <Input name="nome" label="Nome do Contato" control={userControl} />
            <Input name="email" label="E-mail" control={userControl} />
            <div className="mt-4 flex justify-center">
              <Button type="submit" disabled={isSubmittingUser}>
                {isSubmittingUser ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Container>
    </LayoutContainer>
  );
};
