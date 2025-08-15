"use client";

import { useParams } from "next/navigation";
import { PiSealCheckLight, PiUser, PiFarmLight } from "react-icons/pi";

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
  ];

  if (isLoading || !userData) return <p className="p-4">Carregando...</p>;

  return (
    <LayoutContainer title="Detalhes do Usuário" menuItems={customMenuItems}>
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
