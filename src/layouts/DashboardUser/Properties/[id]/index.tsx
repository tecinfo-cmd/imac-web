"use client";

import { useParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { useState } from "react";
import { MdEngineering } from "react-icons/md";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  PiFarmLight,
} from "react-icons/pi";

import { InfoGrid } from "@/components/InfoGrid";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Card } from "@/components/ui/card";

import { useGetFine } from "@/hooks/useFine/useFine";
import { usePropertyMonitoring } from "@/hooks/useGetProperties/usePropertMonitoring";
import { usePropertySummary } from "@/hooks/useGetProperties/usePropertySummary";
import { Abattoir } from "@/icons/Abattoir";
import { AdjustmentTerm } from "@/icons/AdjustmentTerm";
import { Analityc } from "@/icons/Analityc";
import DocPropertie from "@/icons/DocPropertie";
import { FineTracking } from "@/icons/FineTracking";
import { SalesPermit } from "@/icons/SalesPermit";
import { SelfInspection } from "@/icons/SelfInspection";
import { toast } from "sonner";
//import { Taxa } from "@/icons/Taxa";

export const MonitoringLayout = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const propriedadeId = params?.id as string;

  const { data: propriedade, isLoading } = usePropertyMonitoring(propriedadeId);
  const { data: summary } = usePropertySummary();
  const { data: fines } = useGetFine(propriedadeId);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const contestacao = propriedade?.retornoAnalises?.[0]?.contestacaoLaudo;
  const contestacaoAutorizacaoSupressao =
    propriedade?.retornoAnalises?.[0]?.contestacaoAutorizacaoSupressao;
  const retorno = propriedade?.retornoAnalises;
  const Adequacao = propriedade?.retornoAnalises?.[0]?.planoAdequacao;
  const status =
    propriedade?.status === "Enviado" || propriedade?.status === "Assinado";
  const multas = fines;

  const isEmpty = (obj: any) =>
    !obj ||
    (Array.isArray(obj) ? obj.length === 0 : Object.keys(obj).length === 0);

  const cards = [
    {
      label: "Resumo da Propriedade",
      icon: <PiFarmLight size={36} />,
      active: false,
      path: (id: string) => `/dashboard/properties/${id}/summary`,
    },
    {
      label: "Análise Socioambiental",
      icon: <Analityc size={36} />,
      active: false,
      disabled: isEmpty(retorno),
    },
    {
      label: "Contestação",
      icon: <DocPropertie size={36} />,
      active: false,
      path: (id: string) => `/dashboard/properties/${id}/objection`,
      disabled:
        isEmpty(contestacao) && isEmpty(contestacaoAutorizacaoSupressao),
    },
    {
      label: "Plano de Adequação",
      icon: <DocPropertie size={36} />,
      active: false,
      path: (id: string) => `/dashboard/properties/${id}/adaptationPlan`,
      disabled: isEmpty(Adequacao),
    },
    {
      label: "Termo de Adequação",
      icon: <AdjustmentTerm size={36} />,
      active: false,
      path: (id: string) => `/dashboard/properties/${id}/adjustmentTerm`,
      disabled: !status,
    },
    {
      label: "Multas",
      icon: <FineTracking size={36} />,
      active: false,
      path: (id: string) => `/dashboard/properties/${id}/fines`,
      disabled: isEmpty(multas),
    },
    {
      label: "Autovistoria",
      icon: <SelfInspection size={36} />,
      active: false,
      path: (id: string) => `/dashboard/properties/${id}/selfInspection`,
      disabled: !status,
    },
    {
      label: "Autorização de Comercialização",
      icon: <SalesPermit size={36} />,
      active: false,
      path: (id: string) => `/getDcsStatus?carFederal=&idPropriedade=${id}`,
    },
    {
      label: "Revisão de Car",
      icon: <SalesPermit size={36} />,
      active: false,
      disabled: true,
    },
    {
      label: "Documentos da Propriedade",
      icon: <DocPropertie size={36} />,
      active: false,
      disabled: true,
    },
  ];

  const customMenuItems = [
    {
      label: "Home",
      href: "/dashboard",
      icon: <Analityc />,
    },
    {
      label: "Usuários",
      href: "/dashboard/users",
      icon: <PiUserCircleThin size={44} />,
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
    /*
    {
      label: "Multas",
      href: "/multas",
      icon: <Taxa />,
    },
    */
    {
      label: "Frigorificos",
      href: "/dashboard/abattoir-industry",
      icon: <Abattoir size={44} />,
    },
    {
      label: "Responsável Técnico",
      href: "/dashboard/technical-manager",
      icon: <MdEngineering size={44} />,
    },
  ];

  if (isLoading || !propriedade) {
    return (
      <LayoutContainer title="ACOMPANHAMENTO PREM" menuItems={customMenuItems}>
        <p className="text-center mt-8">Carregando dados da propriedade...</p>
      </LayoutContainer>
    );
  }

  const farmData = {
    car: propriedade.carFederal,
    voucher: propriedade.voucher,
    nome: propriedade.nomePropriedade,
    municipio: propriedade.cidade?.nome,
    estado: propriedade.cidade?.uf,
    etapa: propriedade.etapa,
    status: propriedade.status,
  };

  const farmInfoRows = [
    [
      { label: "Cadastro Ambiental Rural (CAR)", value: farmData.car },
      { label: "Código Voucher PREM", value: farmData.voucher },
    ],
    [
      { label: "Nome da propriedade*", value: farmData.nome },
      { label: "Município*", value: farmData.municipio },
      { label: "Estado*", value: farmData.estado },
    ],
    [
      { label: "Etapa Atual:", value: farmData.etapa },
      { label: "Status", value: farmData.status },
    ],
  ];

  const handleCardClick = (idx: number) => {
    const card = cards[idx];
    if (card.label === "Análise Socioambiental") {
      const url = summary?.relatorioUrl;
      if (url) {
        setPdfUrl(url);
      } else {
        toast(
          "Relatório socioambiental ainda não está disponível para esta propriedade."
        );
      }
      return;
    }
    if (card.label === "Autorização de Comercialização") {
      const url = `/getDcsStatus?carFederal=${propriedade?.carFederal}&idPropriedade=${propriedadeId}`;
      window.open(url, "_blank");
      return;
    }
    if (card.path) {
      router.push(card.path(propriedadeId));
    }
  };

  return (
    <LayoutContainer title="ACOMPANHAMENTO PREM" menuItems={customMenuItems}>
      <h2 className="text-center text-[#21801A] font-bold mb-4">
        ACOMPANHAMENTO PREM
      </h2>

      <InfoGrid rows={farmInfoRows} data={[]} />
      <div className="grid p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-6 mt-8">
        {cards.map((card, idx) => (
          <Card
            key={card.label}
            className={`flex flex-col items-center justify-center text-center p-4 rounded-lg w-44 h-40 cursor-pointer transition
              bg-[#21801A] text-white
              hover:bg-[#F3F3F3] hover:text-[#21801A] hover:opacity-60
              ${
                card.path && pathname === card.path(propriedadeId)
                  ? "bg-[#F3F3F3] !text-[#21801A] opacity-60"
                  : ""
              }
               ${
                 card.disabled
                   ? "bg-[#F3F3F3] !text-[#21801A] cursor-not-allowed pointer-events-none opacity-60"
                   : ""
               }
            `}
            onClick={() => !card.disabled && handleCardClick(idx)}
          >
            <div className="mb-2">{card.icon}</div>
            <span className="text-center text-sm font-semibold">
              {card.label}
            </span>
          </Card>
        ))}
      </div>
      {pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded-lg overflow-hidden flex flex-col">
            <div className="p-2 bg-gray-100 flex justify-between items-center">
              <span className="font-bold text-lg">Análise Socioambiental</span>
              <button
                onClick={() => setPdfUrl(null)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Fechar
              </button>
            </div>
            <iframe
              src={pdfUrl}
              className="flex-1"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}
    </LayoutContainer>
  );
};
