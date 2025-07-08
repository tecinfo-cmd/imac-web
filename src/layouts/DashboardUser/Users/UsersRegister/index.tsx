"use client";

import Link from "next/link";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  //PiFarmLight,
} from "react-icons/pi";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Button } from "@/components/ui/button";

import { useUserRegister } from "@/hooks/useUserRegisterForm/useUserRegisterForm";
import { Analityc } from "@/icons/Analityc";
import { maskCPF } from "@/utils/maskCPF";
import { maskPhone } from "@/utils/maskPhone";

export const UsersRegisterLayout = () => {
  const customMenuItems = [
    {
      label: "Home",
      href: "/dashboardUser",
      icon: <Analityc />,
    },
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
    /*{
      label: "Propriedades",
      href: "/dashboardUser/properties",
      icon: <PiFarmLight size={44} />,
    },
    {
      label: "Multas",
      href: "/multas",
      icon: <PiCurrencyCircleDollarLight size={44} />,
    },
    */
  ];
  const { control, handleSubmit, onSubmit, isLoading } = useUserRegister();

  return (
    <LayoutContainer title="Cadastrar Usuário" menuItems={customMenuItems}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Input
          name="nome"
          label="Nome Completo"
          placeholder="Digite o nome do usuário"
          control={control}
        />
        <Input
          name="cpf"
          label="CPF"
          placeholder="000.000.000-00"
          control={control}
          mask={maskCPF}
        />
        <Input
          name="rgie"
          label="RG/IE"
          placeholder="00.000.000-0"
          control={control}
        />
        <Input
          name="telefone"
          label="Telefone"
          placeholder="(00) 0 0000 - 0000"
          control={control}
          mask={maskPhone}
        />
        <Input
          name="email"
          label="E-mail"
          placeholder="Digite o e-mail"
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
          placeholder="engenheiro ambiental"
          control={control}
        />

        <div className="col-span-full flex justify-between mt-4">
          <Link
            href="/dashboardUser/users"
            className="text-[#21801A] underline"
          >
            Voltar
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </LayoutContainer>
  );
};
