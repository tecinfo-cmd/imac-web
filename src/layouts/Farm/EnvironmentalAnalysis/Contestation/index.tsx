"use client";
import { GoAlertFill } from "react-icons/go";
import { LuFileSearch } from "react-icons/lu";

import { ReportContestationSection } from "./components/ReportContestationSection";
import { SuppressionAuthorizationSection } from "./components/SuppressionAuthorizationSection";
import { TechnicalResponsibleSection } from "./components/TechnicalResponsibleSection";
import { Button } from "@/components/ui/button";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { formatDate } from "@/utils/formatters/formatDate";

interface ContestationProps {
  farmId: number;
  analysisId?: number;
}

export const Contestation = ({ farmId, analysisId }: ContestationProps) => {
  const { data: farm, isLoading } = useGetFarmById(farmId);

  if (isLoading) return <p>Carregando...</p>;

  const hasAnalysisInProgress =
    farm?.retornoAnalises && farm.retornoAnalises.length > 0;

  const hasValidParams = farmId && analysisId;

  const canAccess = hasAnalysisInProgress || hasValidParams;

  if (!canAccess) {
    return (
      <div className="w-fit mx-auto flex justify-center items-center gap-3 border border-[#CAC4D0] p-4 rounded">
        <GoAlertFill size={35} color="#F12929" />
        <p className="text-[#0A3503]">
          Esta página só pode ser acessada quando houver uma análise em
          andamento ou quando os parâmetros necessários estiverem disponíveis.
        </p>
      </div>
    );
  }

  const currentAnalysis = farm?.retornoAnalises[0];

  const suppressionContestation =
    currentAnalysis?.contestacaoAutorizacaoSupressao;
  const reportContestation = currentAnalysis?.contestacaoLaudo;

  const finalAnalysisId = analysisId || currentAnalysis?.id || 0;
  

  return (
    <>
      <div className="w-fit mx-auto flex justify-center items-center gap-3 border border-[#CAC4D0] p-4 rounded">
        <GoAlertFill size={35} color="#F12929" />
        <p className="text-[#0A3503] text-sm">
          Para Contestar a Análise Sócioambiental é necessário enviar os
          documentos necessários de acordo com o tipo de contestação. <br />
          Caso tenha mais de um tipo de contestação, certifique-se de preencher
          o formulário de acordo com o tipo que deseja contestar.
          <br /> Após a solicitação não é possível editar os dados da
          propriedade e dos proprietários.
        </p>
      </div>

      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Contestação de Análise Socioambiental
      </h1>

      <div className="grid grid-cols-3 gap-8 p-6 border border-[#CAC4D0] rounded shadow mb-6">
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

      {suppressionContestation && (
        <div className="mb-6">
          <div className="bg-white border border-[#CAC4D0] shadow">
            <div className="bg-[#1A6415] text-white p-4">
              <h2 className="text-center font-semibold uppercase">
                Situação da Autorização de sepressão
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[#21801A] font-medium">
                    Protocolo da Contestação:
                  </span>
                  <p className="text-gray-800">{suppressionContestation.id}</p>
                </div>
                <div>
                  <span className="text-[#21801A] font-medium">
                    Data de envio da contestação:
                  </span>
                  <p className="text-gray-800">
                    {formatDate(suppressionContestation.dataCriacao)}
                  </p>
                </div>
                <div>
                  <span className="text-[#21801A] font-medium">
                    Situação da contestação:
                  </span>
                  <p className="text-gray-800">
                    {suppressionContestation.situacao}
                  </p>
                </div>
                <div>
                  <span className="text-[#21801A] font-medium">
                    Observação:
                  </span>
                  <p className="text-gray-800">
                    {suppressionContestation.observacao ||
                      "Prazo estimado de análise é de até 10 dias úteis."}
                  </p>
                </div>
              </div>

              {currentAnalysis?.documentos &&
                currentAnalysis.documentos.filter(
                  (doc) => doc.tipo === "CONTESTACAO"
                ).length > 0 && (
                  <div className="mt-4 flex justify-start">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const contestacaoDoc = currentAnalysis.documentos.find(
                          (doc) => doc.tipo === "CONTESTACAO"
                        );
                        if (contestacaoDoc) {
                          window.open(contestacaoDoc.urlArquivo, "_blank");
                        }
                      }}
                    >
                      <LuFileSearch size={20} />
                      Acessar parecer
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {currentAnalysis?.contestacaoLaudo && (
        <div className="mb-6">
          <div className="bg-white border border-[#CAC4D0] shadow">
            <div className="bg-[#1A6415] text-white p-4">
              <h2 className="text-center font-semibold uppercase">
                Situação da Contestação
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[#21801A] font-medium">
                    Protocolo da Contestação:
                  </span>
                  <p className="text-gray-800">{currentAnalysis.contestacaoLaudo.id}</p>
                </div>
                <div>
                  <span className="text-[#21801A] font-medium">
                    Data de envio da contestação:
                  </span>
                  <p className="text-gray-800">
                     {formatDate(currentAnalysis.contestacaoLaudo.dataCriacao)}
                  </p>
                </div>
                <div>
                  <span className="text-[#21801A] font-medium">
                    Situação da contestação:
                  </span>
                  <p className="text-gray-800">
                    {currentAnalysis.contestacaoLaudo.situacao}
                  </p>
                </div>
                <div>
                  <span className="text-[#21801A] font-medium">
                    Observação:
                  </span>
                  <p className="text-gray-800">
                    {currentAnalysis.contestacaoLaudo.observacao ||
                      "Prazo estimado de análise é de até 10 dias úteis."}
                  </p>
                </div>
              </div>

              {currentAnalysis?.documentos &&
                currentAnalysis.documentos.filter(
                  (doc) => doc.tipo === "CONTESTACAO"
                ).length > 0 && (
                  <div className="mt-4 flex justify-start">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const contestacaoDoc = currentAnalysis.documentos.find(
                          (doc) => doc.tipo === "CONTESTACAO"
                        );
                        if (contestacaoDoc) {
                          window.open(contestacaoDoc.urlArquivo, "_blank");
                        }
                      }}
                    >
                      <LuFileSearch size={20} />
                      Acessar parecer
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <TechnicalResponsibleSection />
        <SuppressionAuthorizationSection
          farmId={farmId}
          analysisId={finalAnalysisId}
          suppressionContestation={suppressionContestation}
        />
        <ReportContestationSection
          farmId={farmId}
          analysisId={finalAnalysisId}
          reportContestation={reportContestation}
        />
      </div>
    </>
  );
};
