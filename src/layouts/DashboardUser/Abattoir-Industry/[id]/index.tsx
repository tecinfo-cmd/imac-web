"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { PiFarmLight, PiSealCheckLight, PiUser } from "react-icons/pi";

import { LayoutContainer } from "@/components/LayoutContainer";

import { useAbattoir } from "@/hooks/useAbattoir/useAbattoir";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";

const AbattoirEditLayout = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useAbattoir({}, 1);

  const abattoir =
    data?.data?.find((item: any) => String(item.id) === String(id)) || null;

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

  if (isLoading) return <div className="p-4">Carregando...</div>;
  if (error || !abattoir)
    return <div className="p-4">Frigorífico não encontrado.</div>;

  return (
    <LayoutContainer title="Frigorifico" menuItems={customMenuItems}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <strong className="text-[#21801A]">Razão Social:</strong> <br />{" "}
          {abattoir.razaoSocial}
        </div>
        <div>
          <strong className="text-[#21801A]">Nome Fantasia:</strong> <br />{" "}
          {abattoir.nomeFantasia}
        </div>
        <div>
          <strong className="text-[#21801A]">IE:</strong> <br /> {abattoir.ie}
        </div>
        <div>
          <strong className="text-[#21801A]">CNPJ:</strong> <br />{" "}
          {abattoir.cnpj}
        </div>
        <div>
          <strong className="text-[#21801A]">Telefone:</strong> <br />{" "}
          {abattoir.telefone}
        </div>
        <div>
          <strong className="text-[#21801A]">CEP:</strong> <br /> {abattoir.cep}
        </div>
        <div>
          <strong className="text-[#21801A]">Endereço:</strong> <br />{" "}
          {abattoir.endereco}
        </div>
        <div>
          <strong className="text-[#21801A]">Município:</strong> <br />{" "}
          {abattoir.municipio}
        </div>
        <div>
          <strong className="text-[#21801A]">Status:</strong> <br />{" "}
          {abattoir.status}
        </div>
        <div>
          <strong className="text-[#21801A]">Termo de Cooperação:</strong>{" "}
          <br />{" "}
          {abattoir.urlTermoCooperacao ? (
            <a
              href={abattoir.urlTermoCooperacao}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#21801A] underline"
            >
              {abattoir.urlTermoCooperacao.split("/").pop()?.split("-").pop()}
            </a>
          ) : (
            "Não disponível"
          )}
        </div>
        <div>
          <strong className="text-[#21801A]">Quantidade de Voucher:</strong>{" "}
          <br /> {abattoir.quantidadeVoucher}
        </div>
      </div>

      <h1 className="text-2xl font-semibold mt-28">Usuários da Indústria</h1>

          {abattoir.usuarios?.length > 0 ? (
  <table className="min-w-[300px] mt-10">
    <thead>
      <tr className="text-[#21801A] font-bold">
        <th className="text-left pr-8">Nome:</th>
        <th className="text-left pr-8">CPF:</th>
        <th className="text-left pr-8">Email:</th>
      </tr>
    </thead>
    <tbody>
      {abattoir.usuarios.map((usuario: any) => (
        <tr key={usuario.id}>
          <td className="pr-8">{usuario.pessoa?.nome ?? "Não informado"}</td>
          <td className="pr-8">{usuario.pessoa?.cpfCnpj ?? "Não informado"}</td>
          <td className="pr-8">{usuario.pessoa?.email ?? "Não informado"}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <div>Nenhum usuário cadastrado.</div>
)}


      
      <Link
        href="/dashboard/abattoir-industry"
        className="text-[#21801A] underline mt-4 block"
      >
        Voltar
      </Link>
    </LayoutContainer>
  );
};

export default AbattoirEditLayout;
