"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  PiFarmLight,
  PiSealCheckLight,
  PiUser,
  PiPencil,
} from "react-icons/pi";

import { Modal } from "../AbattoirRegister/../../Properties/[id]/SelfInspection/components/Modal";
import { Input } from "@/components/Input";
import { InputFileUpload } from "@/components/InputFile";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import {
  useAbattoir,
  useUpdateAbattoir,
  useCreateUserAbattoir,
  useUpdateUserAbattoir,
} from "@/hooks/useAbattoir/useAbattoir";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { Trash } from "@/icons/Trash";
import { maskCep } from "@/utils/maskCEP";
import { maskCPF } from "@/utils/maskCPF";
import { maskCPFOrCNPJ } from "@/utils/maskCPFOrCNPJ";
import { maskPhone } from "@/utils/maskPhone";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

const userSchema = yup.object({
  cpf: yup.string().required(),
  nome: yup.string().required(),
  email: yup.string().email().required(),
  status: yup.string().optional(),
});

const AbattoirEditLayout = () => {
  const { id } = useParams();
  const { data, isLoading, error, refetch } = useAbattoir({}, 1);
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const updateAbattoir = useUpdateAbattoir();
  const createUserAbattoir = useCreateUserAbattoir();
  const updateUserAbattoir = useUpdateUserAbattoir();

  const abattoir =
    data?.data?.find((item: any) => String(item.id) === String(id)) || null;

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      ie: "",
      telefone: "",
      cep: "",
      endereco: "",
      municipio: "",
      status: "",
      quantidadeVoucher: "",
      termoCooperacao: null as any,
    },
  });

  const {
    control: userControl,
    handleSubmit: handleUserSubmitForm,
    reset: resetUserForm,
    formState: { isSubmitting: isSubmittingUser },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: { cpf: "", nome: "", email: "", status: "" },
  });

  const {
    control: editUserControl,
    handleSubmit: handleEditUserSubmitForm,
    reset: resetEditUserForm,
    formState: { isSubmitting: isSubmittingEditUser },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: { cpf: "", nome: "", email: "", status: "" },
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
          setValue("municipio", `${data.localidade || ""}`);
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

  const customMenuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Analityc />,
    },
    {
      label: "Usuários",
      href: "/dashboard/users",
      icon: <PiUser size={44} />,
    },
    {
      label: "Elegibilidade",
      href: "/dashboard/elegibility",
      icon: <PiSealCheckLight size={44} />,
    },
    {
      label: "Propriedades",
      href: "/dashboard/properties",
      icon: <PiFarmLight size={44} />,
    },
    {
      label: "Frigorificos",
      href: "/dashboard/abattoir-industry",
      icon: <Abattoir size={44} />,
    },
  ];

  const handleEdit = () => {
    setIsEditing(true);
    if (abattoir) {
      Object.keys(abattoir).forEach((key) => {
        if (key === "urlTermoCooperacao" && abattoir[key]) {
          const fileName =
            abattoir[key].split("/").pop()?.split("-").pop() ||
            "termocooperacao.pdf";
          setValue("termoCooperacao", {
            name: fileName,
            url: abattoir[key],
            isExisting: true,
          } as any);
        } else if (key !== "termoCooperacao" && key !== "urlTermoCooperacao") {
          setValue(key as any, abattoir[key]);
        }
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset();
  };

  const handleEditSubmit = async (data: any) => {
    try {
      await updateAbattoir.mutateAsync({
        id: abattoir.id,
        ...data,
      });

      setIsEditing(false);
      await refetch();
      toast.success("Frigorífico atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar frigorífico.");
    }
  };

  const handleUserSubmit = async (data: any) => {
    try {
      console.log("Dados enviados para cadastro:", {
        id: abattoir?.id,
        cpf: data.cpf?.replace(/\D/g, ""),
        nome: data.nome,
        email: data.email,
        status: data.status,
      });

      await createUserAbattoir.mutateAsync({
        id: abattoir?.id,
        cpf: data.cpf?.replace(/\D/g, ""),
        nome: data.nome,
        email: data.email,
        status: data.status,
      });

      resetUserForm({ cpf: "", nome: "", email: "", status: "" });
      setModalOpen(false);

      await refetch();

      toast.success("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error("Erro ao cadastrar usuário.");
    }
  };

  const handleEditUser = (user: any) => {
    console.log("Dados do usuário para edição:", user);

    setEditingUser(user);
    setEditModalOpen(true);

    const formData = {
      cpf: user.pessoa?.cpfCnpj || "",
      nome: user.pessoa?.nome || "",
      email: user.pessoa?.email || user.email || "",
      status: user.status || "",
    };

    console.log("Dados preenchidos no formulário:", formData);
    resetEditUserForm(formData);
  };

  const handleEditUserSubmit = async (data: any) => {
    try {
      console.log("Dados enviados para atualização:", {
        id: editingUser.id,
        cpf: data.cpf?.replace(/\D/g, ""),
        nome: data.nome,
        email: data.email,
        status: data.status,
      });

      await updateUserAbattoir.mutateAsync({
        id: editingUser.id,
        cpf: data.cpf?.replace(/\D/g, ""),
        nome: data.nome,
        email: data.email,
        status: data.status,
      });

      resetEditUserForm({ cpf: "", nome: "", email: "", status: "" });
      setEditModalOpen(false);
      setEditingUser(null);

      await refetch();
      await refetch();

      toast.success("Usuário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar usuário.");
    }
  };

  const handleCancelEditUser = () => {
    setEditModalOpen(false);
    setEditingUser(null);
    resetEditUserForm({ cpf: "", nome: "", email: "", status: "" });
  };

  const handleInactivateUser = (user: any) => {
    console.log("Inativar usuário:", user);
  };

  if (isLoading) return <div className="p-4">Carregando...</div>;
  if (error || !abattoir)
    return <div className="p-4">Frigorífico não encontrado.</div>;

  const renderAbattoirContent = () => {
    if (isEditing) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-[#21801A]">
              Editar Frigorífico
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(handleEditSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Input
              name="razaoSocial"
              label="Razão Social"
              placeholder="Digite a razão social"
              control={control}
              disabled={true}
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
              disabled={true}
            />

            <Input
              name="cnpj"
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              control={control}
              mask={maskCPFOrCNPJ}
              disabled={true}
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
              name="quantidadeVoucher"
              label="Quantidade de voucher acordado"
              placeholder="Digite a quantidade de voucher"
              control={control}
            />

            <Input
              name="status"
              label="Status"
              placeholder="Digite o status"
              control={control}
            />

            <InputFileUpload
              name="termoCooperacao"
              label="Termo de Cooperação"
              control={control}
              accept=".pdf"
              onRemove={() => {
                setValue("termoCooperacao", null);
              }}
            />

            <div className="flex justify-end gap-2 md:col-span-3">
              <Button type="button" variant="dark" onClick={handleCancelEdit}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Atualizar"}
              </Button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-[#21801A]">
            Detalhes do Frigorífico
          </h2>
          <Button
            type="button"
            variant="default"
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <PiPencil size={16} />
            Editar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Razão Social
            </label>
            <p className="text-gray-900">{abattoir?.razaoSocial}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Nome Fantasia
            </label>
            <p className="text-gray-900">{abattoir?.nomeFantasia}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              CNPJ
            </label>
            <p className="text-gray-900">{abattoir?.cnpj}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              IE
            </label>
            <p className="text-gray-900">{abattoir?.ie}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Telefone
            </label>
            <p className="text-gray-900">{abattoir?.telefone}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              CEP
            </label>
            <p className="text-gray-900">{abattoir?.cep}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Endereço
            </label>
            <p className="text-gray-900">{abattoir?.endereco}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Município - UF
            </label>
            <p className="text-gray-900">{abattoir?.municipio}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Status
            </label>
            <p className="text-gray-900">{abattoir?.status}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Quantidade de Voucher acordado
            </label>
            <p className="text-gray-900">{abattoir?.quantidadeVoucher}</p>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-green-700 mb-1">
              Termo de Cooperação
            </label>
            {abattoir?.urlTermoCooperacao ? (
              <div className="flex items-center gap-2">
                <a
                  href={abattoir.urlTermoCooperacao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline cursor-pointer"
                >
                  {abattoir.urlTermoCooperacao
                    .split("/")
                    .pop()
                    ?.split("-")
                    .pop() || "termocooperacao.pdf"}
                </a>
              </div>
            ) : (
              <p className="text-gray-500 italic">Termo não disponível</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <LayoutContainer
      title="Detalhes do Frigorifico"
      menuItems={customMenuItems}
    >
      {renderAbattoirContent()}

      <div className="col-span-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-8">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Usuários da Indústria
        </h1>
        <Button
          type="button"
          onClick={() => setModalOpen(true)}
          disabled={!abattoir?.id || createUserAbattoir.isPending}
          className="w-full sm:w-auto"
        >
          + Adicionar Usuários
        </Button>
      </div>

      {abattoir.usuarios?.length > 0 ? (
        <div className="mt-6 space-y-4">
          {abattoir.usuarios.map((user: any, index: number) => (
            <div
              key={user.id || index}
              className="bg-white p-4 rounded-lg shadow-sm border"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      CPF
                    </label>
                    <p className="text-gray-900 break-all">
                      {user.pessoa?.cpfCnpj || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      Nome
                    </label>
                    <p className="text-gray-900 break-words">
                      {user.pessoa?.nome || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      E-mail
                    </label>
                    <p className="text-gray-900 break-all">
                      {user.pessoa?.email || user.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      Status
                    </label>
                    <p className="text-gray-900">{user.status || "N/A"}</p>
                  </div>
                </div>
                <div className="flex flex-row lg:flex-col items-center justify-center lg:ml-4">
                  <label className="hidden lg:block text-sm font-medium text-green-700 mb-2">
                    Ações
                  </label>
                  <div className="flex items-center gap-2">
                    <Tooltip message="Editar" id={`edit-${user.id}`}>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 hover:bg-gray-100 rounded"
                        disabled={updateUserAbattoir.isPending}
                      >
                        <PiPencil size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip message="Inativar" id={`inactivate-${user.id}`}>
                      <button
                        onClick={() => handleInactivateUser(user)}
                        className="p-2 hover:bg-gray-100 rounded text-red-500"
                        disabled={updateUserAbattoir.isPending}
                      >
                        <Trash />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-gray-500 text-center">
            Nenhum usuário cadastrado.
          </p>
        </div>
      )}

      <div className="mt-4">
        <Link
          href="/dashboard/abattoir-industry"
          className="text-[#21801A] underline"
        >
          Voltar
        </Link>
      </div>

      <Modal.Container isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header className="text-[#21801A]">
          Cadastro de Usuário Frigorífico
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUserSubmitForm(handleUserSubmit)}>
            <div className="space-y-4">
              <Input
                name="cpf"
                label="CPF"
                mask={maskCPF}
                control={userControl}
              />
              <Input
                name="nome"
                label="Nome do Contato"
                control={userControl}
              />
              <Input name="email" label="E-mail" control={userControl} />
            </div>
            <div className="mt-6 flex justify-center">
              <Button type="submit" disabled={isSubmittingUser}>
                {isSubmittingUser ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Container>

      <Modal.Container isOpen={editModalOpen} onClose={handleCancelEditUser}>
        <Modal.Header className="text-[#21801A]">
          Editar Usuário Frigorífico
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditUserSubmitForm(handleEditUserSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="cpf"
                label="CPF"
                mask={maskCPF}
                control={editUserControl}
                disabled={true}
              />
              <Input
                name="nome"
                label="Nome do Contato"
                control={editUserControl}
              />
              <Input name="email" label="E-mail" control={editUserControl} />
              <Input name="status" label="Status" control={editUserControl} />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2">
              <Button
                type="button"
                variant="dark"
                onClick={handleCancelEditUser}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingEditUser}
                className="w-full sm:w-auto"
              >
                {isSubmittingEditUser ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Container>
    </LayoutContainer>
  );
};

export default AbattoirEditLayout;
