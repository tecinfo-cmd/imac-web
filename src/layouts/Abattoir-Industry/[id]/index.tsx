"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { PiSealCheckLight } from "react-icons/pi";

import { LayoutContainer } from "@/components/LayoutContainer";

import { useAbattoir } from "@/hooks/useAbattoir/useAbattoir";
import { Abattoir } from "@/icons/Abattoir";

const AbattoirEditLayout = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useAbattoir({}, 1);

  const abattoir =
    data?.data?.find((item: any) => String(item.id) === String(id)) || null;

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
              Visualizar PDF
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
