"use client";
import { useParams } from "next/navigation";
import { JSX, useState } from "react";
import {
  FaFileAlt,
  FaLeaf,
  FaExclamation,
  FaClipboardCheck,
  FaFileSignature,
  FaGavel,
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

export const EnvironmentalAnalysisLayout = () => {
  const params = useParams();
  const farmId = Number(params.id);

  const { data: farm } = useGetFarmById(farmId);

  const menuItems: MenuItem[] = [
    {
      label: "Resumo da Propriedade",
      icon: FaFileAlt,
      key: "overview",
      disabled: !farm?.endereco || !farm.territorios.length,
    },
    {
      label: "Análise Ambiental",
      icon: FaLeaf,
      key: "environmentalAnalysisPDF",
      disabled: !farm?.retornoAnalises?.length,
    },
    {
      label: "Contestação",
      icon: FaExclamation,
      key: "contestation",
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
    { label: "Multas", icon: FaGavel, key: "fines" },
    {
      label: "Autovistoria",
      icon: FaSearch,
      key: "inspection",
    },
    {
      label: "Autorização de Comercialização",
      icon: FaStore,
      key: "getDcsStatus",
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

  type MenuItem = {
    label: string;
    icon: any;
    key?: string;
    disabled?: boolean;
  };

  const [activeScreen, setActiveScreen] = useState<null | string | undefined>(
    null
  );

  const handleNavigateToAdequancyTerm = () => {
    setActiveScreen("AdequancyTerm");
  };
  const [contestationParams, setContestationParams] = useState<{
    farmId: number;
    analysisId: number;
  } | null>(null);

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
    if (farm?.carFederal && farm?.id) {
      const queryParams = new URLSearchParams({
        carFederal: farm.carFederal,
        idPropriedade: farm.id.toString(),
      });
      window.open(`/getDcsStatus?${queryParams.toString()}`, "_blank");
    }
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
      />
    ),
    suitabilityPlan: (
      <SuitabilityPlan
        farmId={farmId}
        analysisId={
          contestationParams?.analysisId || farm?.retornoAnalises?.[0]?.id || 0
        }
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
      />
    ),
    propertyDocuments: (
      <PropertyDocumentsLayout
        farmId={farmId}
        onGoBack={() => setActiveScreen(null)}
      />
    ),
    guidelines: (
      <Guidelines />
    ),
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
              <p>{farm?.cidade?.nome}</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Estado</h2>
              <p>MT</p>
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
        {menuItems.slice(0, 8).map(({ label, icon: Icon, disabled, key }) => {
          const buttonElement = (
            <button
              key={label}
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                if (key === "getDcsStatus") {
                  handleCommercializationAuthorization();
                } else {
                  setActiveScreen(key);
                }
              }}
              className={`flex flex-col items-center justify-center text-center p-4 rounded-lg w-44 h-40 transition-colors ${
                disabled
                  ? "bg-[#CAC4D0] text-[#7A7A7A] cursor-not-allowed"
                  : "bg-[#21801A] text-white hover:bg-[#1C6A16] cursor-pointer"
              }`}
            >
              <Icon size={32} />
              <span className="mt-2 text-sm font-medium">{label}</span>
            </button>
          );

          if (label === "Resumo da Propriedade" && disabled) {
            return (
              <Tooltip
                key={label}
                id="overview-tooltip"
                message="Ainda estamos cadastrando sua propriedade na base!"
                position="bottom"
              >
                {buttonElement}
              </Tooltip>
            );
          }

          return buttonElement;
        })}
      </div>

      <div className="w-full h-px bg-gray-300 my-8"></div>

      <div className="grid p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-6">
        {menuItems.slice(8).map(({ label, icon: Icon, disabled, key }) => {
          const buttonElement = (
            <button
              key={label}
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                if (key === "getDcsStatus") {
                  handleCommercializationAuthorization();
                } else {
                  setActiveScreen(key);
                }
              }}
              className={`flex flex-col items-center justify-center text-center p-4 rounded-lg w-44 h-40 transition-colors ${
                disabled
                  ? "bg-[#CAC4D0] text-[#7A7A7A] cursor-not-allowed"
                  : "bg-[#21801A] text-white hover:bg-[#1C6A16] cursor-pointer"
              }`}
            >
              <Icon size={32} />
              <span className="mt-2 text-sm font-medium">{label}</span>
            </button>
          );

          if (label === "Resumo da Propriedade" && disabled) {
            return (
              <Tooltip
                key={label}
                id="overview-tooltip"
                message="Ainda estamos cadastrando sua propriedade na base!"
                position="bottom"
              >
                {buttonElement}
              </Tooltip>
            );
          }

          return buttonElement;
        })}
      </div>
    </LayoutContainer>
  );
};
