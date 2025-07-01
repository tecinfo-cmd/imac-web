"use client";

import { useParams } from "next/navigation";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  PiFarmLight,
  PiCurrencyCircleDollarLight,
} from "react-icons/pi";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Button } from "@/components/ui/button";

import { useUserDetail } from "@/hooks/useGetUsers/useUserDetail";
import { Analityc } from "@/icons/Analityc";

export const UserDetailLayout = () => {
  const { email } = useParams();
  const {
    control,
    handleSubmit,
    onSubmit,
    userData,
    isLoading,
    isDirty,
    isSaving,
  } = useUserDetail(email);

  const menuItems = [
    { label: "Home", href: "/dashboardUser", icon: <Analityc /> },
    {
      label: "Usuários",
      href: "/dashboardUser/users",
      icon: <PiUserCircleThin size={44} />,
    },
    {
      label: "Elegibilidade",
      href: "/dashboardUser/elegibility",
      icon: <PiSealCheckLight size={44} />,
    },
    {
      label: "Propriedades",
      href: "/dashboardUser/properties",
      icon: <PiFarmLight size={44} />,
    },
    {
      label: "Multas",
      href: "/multas",
      icon: <PiCurrencyCircleDollarLight size={44} />,
    },
  ];

  if (isLoading || !userData) return <p className="p-4">Carregando...</p>;

  return (
    <LayoutContainer title="Detalhes do Usuário" menuItems={menuItems}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Input
          label="Nome"
          value={userData.pessoa?.nome ?? ""}
          name="nome"
          disabled
          control={control}
        />
        <Input
          label="CPF"
          value={userData.pessoa?.cpfCnpj ?? ""}
          name="cpf"
          disabled
          control={control}
        />
        <Input
          name="rgie"
          label="RG/IE"
          value={userData.pessoa?.rgie ?? ""}
          disabled
          control={control}
        />
        <Input
          name="telefone"
          label="Telefone"
          placeholder="(00) 0 0000 - 0000"
          control={control}
        />
        <Input
          label="E-mail"
          value={userData.email ?? ""}
          name="email"
          disabled
          control={control}
        />
        <InputSelect
          name="perfil"
          label="Perfil"
          placeholder="Administrador"
          control={control}
          options={[
            { label: "Administrativo", value: "ADMINISTRATIVO" },
            { label: "Analista", value: "ANALISTA" },
          ]}
        />
        <InputSelect
          name="tipo"
          label="Tipo"
          placeholder="Pessoa Física"
          control={control}
          options={[
            { label: "Pessoa Física", value: "PF" },
            { label: "Pessoa Jurídica", value: "PJ" },
          ]}
        />
        <Input
          name="profissao"
          label="Profissão"
          placeholder="Engenheiro ambiental"
          control={control}
        />

        <div className="col-span-full flex justify-end mt-4">
          <Button type="submit" disabled={!isDirty || isSaving}>
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </LayoutContainer>
  );
};
