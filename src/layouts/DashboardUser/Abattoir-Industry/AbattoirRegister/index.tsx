"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  PiFarmLight,
  PiSealCheckLight,
  PiUser,
  PiPencil,
} from "react-icons/pi";

import { Modal } from "../../Properties/[id]/SelfInspection/components/Modal";
import { Input } from "@/components/Input";
import { InputFileUpload } from "@/components/InputFile";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import {
  useCreateAbattoir,
  useCreateUserAbattoir,
  useAbattoirById,
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

function validarTelefone(telefone: string): boolean {
  const regex = /^(\(?\d{2}\)?\s?)?(9?\d{4})-?(\d{4})$/;
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
  quantidadeVoucher: yup.number().required(),
  termoCooperacao: yup.mixed().required(),
  status: yup.string().optional(),
});

const userSchema = yup.object({
  cpf: yup.string().required(),
  nome: yup.string().required(),
  email: yup.string().email().required(),
  status: yup.string().optional(),
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
  quantidadeVoucher: null,
  termoCooperacao: null,
};

export const AbattoirRegisterLayout = ({
  defaultValues: propsDefaultValues,
}: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createdAbattoirId, setCreatedAbattoirId] = useState<string | null>(
    null
  );
  const [isRegistered, setIsRegistered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [registeredData, setRegisteredData] = useState<any>(null);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);

  const createAbattoir = useCreateAbattoir();
  const createUserAbattoir = useCreateUserAbattoir();
  const updateUserAbattoir = useUpdateUserAbattoir();

  const { data: abattoirData, refetch: refetchAbattoir } =
    useAbattoirById(createdAbattoirId);

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

          clearErrors("cep");

          setValue("endereco", data.logradouro || "");
          setValue("municipio", `${data.localidade || ""}`);
        } catch (error) {
          console.error("Erro ao buscar o CEP:", error);
          setError("cep", {
            type: "manual",
            message: "Erro ao buscar CEP.",
          });
        }
      }
    };

    fetchEndereco();
  }, [cep, setValue, setError, clearErrors]);

  useEffect(() => {
    if (cep?.replace(/\D/g, "").length !== 8) {
      clearErrors("cep");
    }
  }, [cep, clearErrors]);

  useEffect(() => {
    if (abattoirData) {
      setRegisteredData((prevData: any) => ({
        ...prevData,
        ...abattoirData,
        termoCooperacao:
          prevData?.termoCooperacao || abattoirData.termoCooperacao,
      }));

      if (abattoirData.usuarios) {
        setRegisteredUsers(abattoirData.usuarios);
      }
    }
  }, [abattoirData]);

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
    /*{
          label: "Multas",
          href: "/dashboard/multas",
          icon: <Taxa className="text-current" />,
        },
        */
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
      setRegisteredData({
        ...data,
        ...response,
      });
      setIsRegistered(true);
      setIsEditing(false);

      if (response?.id) {
        setTimeout(async () => {
          await refetchAbattoir();
        }, 500);
      }

      toast.success("Frigorífico cadastrado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar frigorífico.");
    }
  };

  const handleEditSubmit = async (data: any) => {
    try {
      console.log("Dados para atualização (aguardando endpoint):", data);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar frigorífico.");
    }
  };

  const handleUserSubmit = async (data: any) => {
    try {
      console.log("Dados enviados para cadastro:", {
        id: createdAbattoirId,
        cpf: data.cpf?.replace(/\D/g, ""),
        nome: data.nome,
        email: data.email,
        status: data.status,
      });

      await createUserAbattoir.mutateAsync({
        id: createdAbattoirId,
        cpf: data.cpf?.replace(/\D/g, ""),
        nome: data.nome,
        email: data.email,
        status: data.status,
      });

      resetUserForm({ cpf: "", nome: "", email: "", status: "" });
      setModalOpen(false);

      await refetchAbattoir();

      toast.success("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error("Erro ao cadastrar usuário.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    Object.keys(registeredData).forEach((key) => {
      setValue(key, registeredData[key]);
    });
  };

  const handleDeleteTerm = () => {
    setRegisteredData({
      ...registeredData,
      termoCooperacao: null,
    });
    setValue("termoCooperacao", null);
    setIsEditing(true);
    Object.keys(registeredData).forEach((key) => {
      if (key !== "termoCooperacao") {
        setValue(key, registeredData[key]);
      }
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    resetAbattoirForm(registeredData);
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

      await refetchAbattoir();

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

  const handleInactivateUser = async (user: any) => {
    const confirmInactivate = window.confirm(
      `Tem certeza que deseja inativar o usuário ${
        user.pessoa?.nome || "este usuário"
      }?`
    );

    if (!confirmInactivate) return;

    try {

      console.log("Inativando usuário:", user.id);

      await refetchAbattoir();

      toast.success("Usuário inativado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao inativar usuário.");
    }
  };

  const renderAbattoirInfo = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-[#21801A]">
          Cadastrar Frigorífico
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
          <p className="text-gray-900">{registeredData?.razaoSocial}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Nome Fantasia
          </label>
          <p className="text-gray-900">{registeredData?.nomeFantasia}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            CNPJ
          </label>
          <p className="text-gray-900">{registeredData?.cnpj}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            IE
          </label>
          <p className="text-gray-900">{registeredData?.ie}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Telefone
          </label>
          <p className="text-gray-900">{registeredData?.telefone}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            CEP
          </label>
          <p className="text-gray-900">{registeredData?.cep}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Endereço
          </label>
          <p className="text-gray-900">{registeredData?.endereco}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Município - UF
          </label>
          <p className="text-gray-900">{registeredData?.municipio}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Status
          </label>
          <p className="text-gray-900">{registeredData?.status}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Quantidade de Voucher acordado
          </label>
          <p className="text-gray-900">{registeredData?.quantidadeVoucher}</p>
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-green-700 mb-1">
            Termo de Cooperação
          </label>
          {registeredData?.termoCooperacao ? (
            <div className="flex items-center gap-2">
              <p className="text-gray-900 underline cursor-pointer">
                {registeredData?.termoCooperacao?.name || "termocooperacao.pdf"}
              </p>
              <button
                type="button"
                onClick={handleDeleteTerm}
                className="text-red-500 hover:text-red-700"
                title="Excluir termo"
              >
                <Trash />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-gray-500 italic">Termo removido</p>
              <Button
                type="button"
                variant="default"
                onClick={() => setIsEditing(true)}
                className="text-sm"
              >
                Adicionar novo termo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <LayoutContainer title="Cadastrar Frigorifico" menuItems={customMenuItems}>
      {isRegistered && !isEditing ? (
        renderAbattoirInfo()
      ) : (
        <form
          onSubmit={handleSubmit(
            isEditing ? handleEditSubmit : handleAbattoirSubmit
          )}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {isEditing && (
            <div className="md:col-span-3 mb-4">
              <h2 className="text-xl font-semibold text-[#21801A]">
                Editar Frigorífico
              </h2>
            </div>
          )}

          <Input
            name="razaoSocial"
            label="Razão Social"
            placeholder="Digite a razão social"
            control={control}
            disabled={isEditing}
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
            disabled={isEditing}
          />

          <Input
            name="cnpj"
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            control={control}
            mask={maskCPFOrCNPJ}
            disabled={isEditing}
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

          {isEditing && (
            <Input
              name="status"
              label="Status"
              placeholder="Digite o status"
              control={control}
            />
          )}

          <InputFileUpload
            name="termoCooperacao"
            label="Termo de Cooperação"
            control={control}
            accept=".pdf"
            onRemove={() => {
              if (isEditing) {
                setValue("termoCooperacao", null);
                setRegisteredData({
                  ...registeredData,
                  termoCooperacao: null,
                });
              }
            }}
          />

          <div className="flex justify-end gap-2 md:col-span-3">
            {isEditing && (
              <Button
                type="button"
                variant="default"
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmittingAbattoir}>
              {isSubmittingAbattoir
                ? "Salvando..."
                : isEditing
                ? "Atualizar"
                : "Salvar"}
            </Button>
          </div>
        </form>
      )}

      <div className="col-span-full flex justify-between mt-8">
        <h1 className="text-2xl font-semibold">Usuários da Indústria</h1>
        <Button
          type="button"
          onClick={() => setModalOpen(true)}
          disabled={!createdAbattoirId}
        >
          + Adicionar Usuários
        </Button>
      </div>

      {registeredUsers.length > 0 && (
        <div className="mt-6 space-y-4">
          {registeredUsers.map((user, index) => (
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
