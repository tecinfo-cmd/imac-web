"use client";

import { useParams } from "next/navigation";
import { JSX, useState } from "react";
import {
  FaClipboardCheck,
  FaExclamation,
  FaFileAlt,
  FaFileSignature,
  FaGavel,
  FaLeaf,
  FaSearch,
  FaStore,
} from "react-icons/fa";
import { GoAlertFill, GoArrowLeft } from "react-icons/go";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Tooltip } from "@/components/Tooltip";

import GetDcsStatus from "@/app/(public)/getDcsStatus/page";
import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import PropertyDocumentsLayout from "@/layouts/DashboardUser/Properties/[id]/ProprtyDocuments";

import { AdequancyTerm } from "./AdequancyTerm";
import { CommercializationAuthorization } from "./CommercializationAuthorization";
import { Contestation } from "./Contestation";
import { EnvironmentalAnalysisPDF } from "./EnvironmentalAnalysisPDF";
import { FarmOverview } from "./FarmOverview";
import { Fines } from "./Fines";
import { Guidelines } from "./Guidelines";
import { Inspection } from "./Inspection";
import { SuitabilityPlan } from "./SuitabilityPlan";

type MenuItem = {
  label: string;
  icon: any;
  key?: string;
  disabled?: boolean;
  tooltip?: string | ((farm: any) => string | null);
};

const termoStatuses = [
  "Termo Assinado",
  "Multa disponível",
  "Autovistoria Disponível",
  "Autovistoria Realizado",
  "Autovistoria Não realizado",
  "Autorização de Comercialização Vigente",
  "Autorização de Comercialização Expirada",
];

const FINAL_STATUSES = [
  "Deferido",
  "Indeferido",
  "DEFERIDO",
  "INDEFERIDO",
  "deferido",
  "indeferido",
];

const isFinalStatus = (situacao?: string | null) => {
  return FINAL_STATUSES.includes(situacao ?? "");
};

const isUnderAnalysis = (situacao?: string | null) => {
  return situacao === "Em Análise";
};

const isEmpty = (obj: any) => {
  return (
    !obj ||
    (Array.isArray(obj) ? obj.length === 0 : Object.keys(obj).length === 0)
  );
};

export const EnvironmentalAnalysisLayout = () => {
  const params = useParams();
  const farmId = Number(params.id);

  const { data: farm } = useGetFarmById(farmId);

  const [activeScreen, setActiveScreen] = useState<string | null | undefined>(
    null
  );

  const [contestationParams, setContestationParams] = useState<{
    farmId: number;
    analysisId: number;
  } | null>(null);

  const currentAnalysis = farm?.retornoAnalises?.[0];

  const reportContestation = currentAnalysis?.contestacaoLaudo;
  const suppressionContestation =
    currentAnalysis?.contestacaoAutorizacaoSupressao;
  const suitabilityPlan = currentAnalysis?.planoAdequacao;

  const viewStatus = termoStatuses.includes(farm?.status ?? "");

  const contestationTooltip =
    isEmpty(reportContestation) || isEmpty(suppressionContestation)
      ? "Contestação deve ser enviada em até 10 dias."
      : undefined;

  const isContestationUnderAnalysis =
    isUnderAnalysis(reportContestation?.situacao) ||
    isUnderAnalysis(suppressionContestation?.situacao);

  const isSuitabilityPlanUnderAnalysis = isUnderAnalysis(
    suitabilityPlan?.situacao
  );

  const hasSuitabilityPlanFinalOpinion = isFinalStatus(
    suitabilityPlan?.situacao
  );

  const contestationEnabled = !!farm?.contestarDeteccoes;

  const suitabilityPlanEnabled =
    !!farm?.proporNovaArea &&
    !farm?.confirmarEstrategia &&
    !farm?.termoAssinado;

  const adequancyTermEnabled =
    !!farm?.confirmarEstrategia ||
    !!farm?.termoAssinado ||
    hasSuitabilityPlanFinalOpinion;

  const handleNavigateToAdequancyTerm = () => {
    setActiveScreen("AdequancyTerm");
  };

  const handleNavigateToContestation = (farmId: number, analysisId: number) => {
    setContestationParams({ farmId, analysisId });
    setActiveScreen("contestation");
  };

  const handleNavigateToSuitabilityPlan = (
    farmId: number,
    analysisId: number
  ) => {
    setContestationParams({ farmId, analysisId });
    setActiveScreen("suitabilityPlan");
  };

  const handleCommercializationAuthorization = () => {
    if (!farm?.carFederal || !farm?.id) return;

    const queryParams = new URLSearchParams({
      carFederal: farm.carFederal,
      idPropriedade: farm.id.toString(),
    });

    window.open(`/getDcsStatus?${queryParams.toString()}`, "_blank");
  };

  const menuItems: MenuItem[] = [
    {
      label: "Resumo da Propriedade",
      icon: FaFileAlt,
      key: "overview",
      disabled: !farm?.endereco || !farm?.territorios?.length,
    },
    {
      label: "Análise Ambiental",
      icon: FaLeaf,
      key: "environmentalAnalysisPDF",
      disabled: !farm?.retornoAnalises?.length,
      tooltip: (f: any) =>
        !f?.retornoAnalises?.length
          ? "Solicite a análise para gerar o relatório."
          : null,
    },
    {
      label: "Contestação",
      icon: FaExclamation,
      key: "contestation",
      tooltip: contestationTooltip,
    },
    {
      label: "Estratégia de Adequação",
      icon: FaClipboardCheck,
      key: "suitabilityPlan",
    },
    {
      label: "Plano de Adequação",
      icon: FaFileSignature,
      key: "AdequancyTerm",
    },
    {
      label: "Multas",
      icon: FaGavel,
      key: "fines",
      disabled: !viewStatus,
    },
    {
      label: "Autovistoria",
      icon: FaSearch,
      key: "inspection",
      disabled: !viewStatus,
    },
    {
      label: "Autorização de Comercialização",
      icon: FaStore,
      key: "getDcsStatus",
      disabled: !viewStatus,
    },
    {
      label: "Roteiros Orientativos",
      icon: FaFileAlt,
      key: "guidelines",
    },
    {
      label: "Documentos da propriedade",
      icon: FaStore,
      key: "propertyDocuments",
    },
  ];

  const getCardTooltip = (
    item: MenuItem,
    effectiveDisabled: boolean
  ): string | null | undefined => {
    const { key, label, disabled } = item;

    if (
      (key === "fines" || key === "inspection" || key === "getDcsStatus") &&
      effectiveDisabled
    ) {
      return "Assine o plano de adequação para prosseguir.";
    }

    if (key === "contestation" && effectiveDisabled) {
      return "Conteste as detecções informadas na Análise Ambiental para liberar esta etapa.";
    }

    if (key === "suitabilityPlan" && effectiveDisabled) {
      if (isContestationUnderAnalysis) {
        return "Aguarde a conclusão da análise da contestação.";
      }

      if (farm?.confirmarEstrategia || farm?.termoAssinado) {
        return "A Estratégia de Adequação já foi concluída.";
      }

      return "Confirme as detecções ou solicite a estratégia após o parecer da contestação.";
    }

    if (key === "AdequancyTerm" && effectiveDisabled) {
      if (isContestationUnderAnalysis) {
        return "Aguarde a conclusão da análise da contestação.";
      }

      if (isSuitabilityPlanUnderAnalysis) {
        return "Aguarde a conclusão da análise da estratégia de adequação.";
      }

      return "O Plano de Adequação será liberado após a decisão da estratégia ou assinatura do termo.";
    }

    if (typeof item.tooltip === "function") {
      return item.tooltip(farm);
    }

    if (typeof item.tooltip === "string") {
      return item.tooltip;
    }

    if (label === "Resumo da Propriedade" && disabled) {
      const missingEndereco = !farm?.endereco;
      const missingTerritorios = !farm?.territorios?.length;

      return missingTerritorios && !missingEndereco
        ? "Ainda estamos cadastrando sua propriedade na base!"
        : "Finalize o cadastro para prosseguir.";
    }

    return undefined;
  };

  const renderMenuButton = (item: MenuItem) => {
    const { label, icon: Icon, disabled, key } = item;

    const effectiveDisabled =
      !!disabled ||
      (key === "contestation" && !contestationEnabled) ||
      (key === "suitabilityPlan" && !suitabilityPlanEnabled) ||
      (key === "AdequancyTerm" &&
        (!adequancyTermEnabled ||
          isContestationUnderAnalysis ||
          isSuitabilityPlanUnderAnalysis));

    const buttonElement = (
      <button
        key={label}
        disabled={effectiveDisabled}
        onClick={() => {
          if (effectiveDisabled) return;

          if (key === "getDcsStatus") {
            handleCommercializationAuthorization();
            return;
          }

          setActiveScreen(key);
        }}
        className={`flex flex-col items-center justify-center text-center p-4 rounded-lg w-44 h-40 transition-colors ${
          effectiveDisabled
            ? "bg-[#CAC4D0] text-[#7A7A7A] cursor-not-allowed"
            : "bg-[#21801A] text-white hover:bg-[#1C6A16] cursor-pointer"
        }`}
      >
        <Icon size={32} />
        <span className="mt-2 text-sm font-medium">{label}</span>
      </button>
    );

    const tooltipMessage = getCardTooltip(item, effectiveDisabled);

    if (!tooltipMessage) return buttonElement;

    return (
      <Tooltip
        key={label}
        id={`${label.replace(/\s+/g, "-").toLowerCase()}-tooltip`}
        message={tooltipMessage}
        position="bottom"
      >
        {buttonElement}
      </Tooltip>
    );
  };

  const componentMap: Record<string, JSX.Element> = {
    overview: <FarmOverview farmId={farmId} />,

    getDcsStatus: <GetDcsStatus />,

    AdequancyTerm: <AdequancyTerm farmId={farmId} />,

    environmentalAnalysisPDF: (
      <EnvironmentalAnalysisPDF
        farmId={farmId}
        onNavigateToContestation={handleNavigateToContestation}
        onNavigateToSuitabilityPlan={handleNavigateToSuitabilityPlan}
        onAnalysisClick={() => {}}
      />
    ),

    suitabilityPlan: (
      <SuitabilityPlan
        farmId={farmId}
        analysisId={contestationParams?.analysisId || currentAnalysis?.id || 0}
        onNavigateToAdequancyTerm={handleNavigateToAdequancyTerm}
      />
    ),

    fines: <Fines farmId={farmId} />,

    inspection: <Inspection farmId={farmId} />,

    commercializationAuthorization: (
      <CommercializationAuthorization farmId={farmId} />
    ),

    contestation: (
      <Contestation
        farmId={farmId}
        analysisId={contestationParams?.analysisId}
        onNavigateToSuitabilityPlan={handleNavigateToSuitabilityPlan}
        onNavigateToAdequancyTerm={handleNavigateToAdequancyTerm}
        onAnalysisClick={() => {}}
      />
    ),

    propertyDocuments: (
      <PropertyDocumentsLayout
        farmId={farmId}
        onGoBack={() => setActiveScreen(null)}
      />
    ),

    guidelines: <Guidelines />,
  };

  if (activeScreen === "propertyDocuments") {
    return componentMap[activeScreen] || <div>Tela não encontrada.</div>;
  }

  if (activeScreen) {
    return (
      <LayoutContainer title="Análise Socioambiental">
        <div className="max-w-6xl mx-auto my-8">
          <button
            onClick={() => setActiveScreen(null)}
            className="text-[#21801A] flex items-center gap-3"
          >
            <GoArrowLeft size={28} />
          </button>
        </div>

        {componentMap[activeScreen] || <div>Tela não encontrada.</div>}
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer title="Análise Socioambiental">
      <div className="w-fit mx-auto flex justify-center items-center gap-3 border border-[#CAC4D0] p-4 rounded">
        <GoAlertFill size={35} color="#F12929" />

        <p className="text-[#0A3503]">
          Antes de solicitar a Análise Socioambiental, revise atentamente os
          dados da propriedade
          <br />e dos proprietários. Após a solicitação, não será possível
          editar essas informações.
        </p>
      </div>

      <h1 className="font-semibold text-2xl text-[#1A6415] text-center mt-8 mb-6">
        Análise Socioambiental
      </h1>

      <div className="grid grid-cols-3 gap-8 p-6 border border-[#CAC4D0] rounded shadow">
        <div>
          <h2 className="text-[#21801A]">Cadastro Ambiental Rural (CAR)</h2>
          <p>{farm?.carFederal}</p>
        </div>

        <div>
          <h2 className="text-[#21801A]">Car Estadual</h2>
          <p>{farm?.carEstadual || "-"}</p>
        </div>

        <div>
          <h2 className="text-[#21801A]">Código Voucher PREM</h2>
          <p>{farm?.voucher}</p>
        </div>

        <div className="col-span-3 mt-4">
          <div className="grid grid-cols-3">
            <div>
              <h2 className="text-[#21801A]">Nome da propriedade</h2>
              <p>{farm?.nomePropriedade}</p>
            </div>

            <div>
              <h2 className="text-[#21801A]">Município</h2>
              <p>{farm?.endereco?.municipio}</p>
            </div>

            <div>
              <h2 className="text-[#21801A]">Estado</h2>
              <p>{farm?.endereco?.estado}</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 mt-4">
          <div className="grid grid-cols-2">
            <div>
              <h2 className="text-[#21801A]">Etapa Atual</h2>
              <p>{farm?.etapa}</p>
            </div>

            <div>
              <h2 className="text-[#21801A]">Status</h2>
              <p>{farm?.status}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-6 mt-8">
        {menuItems.slice(0, 8).map((item) => renderMenuButton(item))}
      </div>

      <div className="w-full h-px bg-gray-300 my-8" />

      <div className="grid p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-6">
        {menuItems.slice(8).map((item) => renderMenuButton(item))}
      </div>
    </LayoutContainer>
  );
};
