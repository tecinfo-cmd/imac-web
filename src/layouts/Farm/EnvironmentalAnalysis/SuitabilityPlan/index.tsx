"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GoAlertFill } from "react-icons/go";
import { LuFileSearch } from "react-icons/lu";

import { DocumentsTechnical } from "../Contestation/components/Documents";
import { TechnicalResponsibleSection } from "./components/TechnicalResponsibleSection";
import { ActionConfirmationModal } from "@/components/ConfirmationModal";
import { TableInformation } from "@/components/TableInformation";
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import { useCreateSuitabilityPlan } from "@/hooks/useEnvironmentalAnalysis/useCreateSuitabilityPlan";
import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { useUpdateFarmActions } from "@/hooks/useFarms/useUpdateFarmActions";
import { useTechnicalResponsibleSuitabilityPlanStore } from "@/store/useTechnicalResponsibleSuitabilityPlanStore";
import { customToast } from "@/utils/customToast";
import { yupResolver } from "@hookform/resolvers/yup";

type Documento = {
  id: number;
  nomeArquivo: string;
  nomeArquivoOriginal: string;
  urlArquivo: string;
  tipo: string;
};

interface SuitabilityPlanProps {
  farmId: number;
  analysisId: number;
  onNavigateToAdequancyTerm?: () => void;
}

type ProposeNewAreaOption = "yes" | "no" | null;

type ConfirmationAction = "proposeNewArea" | "doNotProposeNewArea" | null;

const suitabilityPlanSchema = yup.object({
  motivo: yup.string().required("Justificativa é obrigatória"),
});

type SuitabilityPlanFormData = yup.InferType<typeof suitabilityPlanSchema>;

export const SuitabilityPlan = ({
  farmId,
  analysisId,
  onNavigateToAdequancyTerm,
}: SuitabilityPlanProps) => {
  const { data: farm, refetch } = useGetFarmById(farmId);
  const createSuitabilityPlan = useCreateSuitabilityPlan();
  const updateFarmActions = useUpdateFarmActions();

  const { technicalResponsible } =
    useTechnicalResponsibleSuitabilityPlanStore();

  const { control, handleSubmit, setValue } = useForm<SuitabilityPlanFormData>({
    resolver: yupResolver(suitabilityPlanSchema),
    defaultValues: {
      motivo: "",
    },
  });

  const [files, setFiles] = useState<(Documento | File)[]>([]);
  const [files2, setFiles2] = useState<(Documento | File)[]>([]);
  const [proposeNewArea, setProposeNewArea] =
    useState<ProposeNewAreaOption>(null);
  const [confirmationAction, setConfirmationAction] =
    useState<ConfirmationAction>(null);
  const [sent, setSent] = useState(false);

  const existingSuitabilityPlan = farm?.retornoAnalises?.find(
    (analise) => analise.planoAdequacao
  )?.planoAdequacao;

  const hasSubmittedSuitabilityPlan = sent || !!existingSuitabilityPlan;

  const imgAdequancyBase64 = farm?.territorios?.[0]?.imagemAdequacao;

  const hasUserAlreadyChosenPath =
    !!farm?.proporNovaArea ||
    !!farm?.confirmarEstrategia ||
    !!farm?.termoAssinado;

  const canChangeProposeNewAreaOption = !hasUserAlreadyChosenPath;

  const canAccess =
    (!!farmId && !!analysisId) ||
    !!existingSuitabilityPlan ||
    !!farm?.proporNovaArea ||
    !!farm?.confirmarEstrategia;

  useEffect(() => {
    if (existingSuitabilityPlan) {
      setValue("motivo", existingSuitabilityPlan.motivo);
      setProposeNewArea("yes");
      return;
    }

    if (farm?.proporNovaArea) {
      setProposeNewArea("yes");
      return;
    }

    if (farm?.confirmarEstrategia || farm?.termoAssinado) {
      setProposeNewArea("no");
    }
  }, [
    existingSuitabilityPlan,
    farm?.proporNovaArea,
    farm?.confirmarEstrategia,
    farm?.termoAssinado,
    setValue,
  ]);

  if (!canAccess) {
    return (
      <div className="w-fit mx-auto flex justify-center items-center gap-3 border border-[#CAC4D0] p-4 rounded">
        <GoAlertFill size={35} color="#F12929" />
        <p className="text-[#0A3503]">
          Esta página só pode ser acessada quando houver um plano de adequação
          em andamento ou quando os parâmetros necessários estiverem
          disponíveis.
        </p>
      </div>
    );
  }

  const closeConfirmationModal = () => {
    setConfirmationAction(null);
  };

  const handleOpenProposeNewAreaModal = () => {
    if (!canChangeProposeNewAreaOption) return;

    setConfirmationAction("proposeNewArea");
  };

  const handleOpenDoNotProposeNewAreaModal = () => {
    if (!canChangeProposeNewAreaOption) return;

    setConfirmationAction("doNotProposeNewArea");
  };

  const handleConfirmProposeNewArea = async () => {
    try {
      await updateFarmActions.mutateAsync({
        idPropriedade: farmId,
        contestarDeteccoes: farm?.contestarDeteccoes ?? false,
        confirmarDeteccoes: farm?.confirmarDeteccoes ?? false,
        proporNovaArea: true,
        confirmarEstrategia: false,
        termoAssinado: farm?.termoAssinado ?? false,
      });

      setProposeNewArea("yes");
      closeConfirmationModal();

      await refetch();

      customToast.success("Estratégia de adequação habilitada com sucesso.");
    } catch {
      customToast.error("Erro ao salvar a ação. Tente novamente.");
    }
  };

  const handleConfirmDoNotProposeNewArea = async () => {
    try {
      await updateFarmActions.mutateAsync({
        idPropriedade: farmId,
        contestarDeteccoes: farm?.contestarDeteccoes ?? false,
        confirmarDeteccoes: farm?.confirmarDeteccoes ?? false,
        proporNovaArea: false,
        confirmarEstrategia: true,
        termoAssinado: farm?.termoAssinado ?? false,
      });

      setProposeNewArea("no");
      closeConfirmationModal();

      await refetch();

      customToast.success("Plano de Adequação habilitado com sucesso.");

      onNavigateToAdequancyTerm?.();
    } catch {
      customToast.error("Erro ao salvar a ação. Tente novamente.");
    }
  };

  const handleConfirmModalAction = () => {
    if (confirmationAction === "proposeNewArea") {
      handleConfirmProposeNewArea();
      return;
    }

    if (confirmationAction === "doNotProposeNewArea") {
      handleConfirmDoNotProposeNewArea();
    }
  };

  const handleSaveDocuments = async (data: SuitabilityPlanFormData) => {
    if (proposeNewArea === null) {
      customToast.error(
        "Selecione se deseja propor uma nova área para regeneração!"
      );
      return;
    }

    if (proposeNewArea !== "yes") {
      customToast.error(
        "Para enviar a estratégia, é necessário selecionar a opção Sim."
      );
      return;
    }

    if (files.length === 0 || files2.length === 0) {
      customToast.error(
        "Adicione pelo menos um arquivo em cada seção de documentos!"
      );
      return;
    }

    if (!technicalResponsible) {
      customToast.error("Primeiro cadastre um responsável técnico!");
      return;
    }

    const stripExtension = (filename: string) =>
      filename.replace(/\.[^/.]+$/, "");

    const params = [...files, ...files2].map((file) => {
      if (file instanceof File) {
        return {
          nome: file.name,
          tipo: stripExtension(file.name).toLocaleUpperCase(),
        };
      }

      return {
        nome: file.nomeArquivo,
        tipo: stripExtension(file.nomeArquivo).toLocaleUpperCase(),
      };
    });

    try {
      await createSuitabilityPlan.mutateAsync({
        farmId,
        analysisId,
        data: {
          parametros: JSON.stringify(params),
          arquivos: [...files, ...files2].filter(
            (file): file is File => file instanceof File
          ),
          motivo: data.motivo,
          idResponsavelTecnico: Number(technicalResponsible.id),
        },
      });

      customToast.success("Plano de adequação salvo com sucesso!");
      setSent(true);
      refetch();
    } catch {
      customToast.error("Erro ao salvar plano de adequação. Tente novamente.");
    }
  };

  const confirmationModalContent = {
    proposeNewArea: {
      title: "Propor nova área para regeneração?",
      description:
        "Ao confirmar esta opção, o formulário de Estratégia de Adequação será habilitado. Depois disso, você não poderá escolher a opção Não.",
    },
    doNotProposeNewArea: {
      title: "Não propor nova área?",
      description:
        "Ao confirmar esta opção, você será direcionado para o Plano de Adequação e não poderá voltar para propor uma nova área para regeneração.",
    },
  };

  const currentModalContent = confirmationAction
    ? confirmationModalContent[confirmationAction]
    : null;

  return (
    <>
      <div className="w-fit mx-auto flex justify-center items-center gap-3 border border-[#CAC4D0] p-4 rounded">
        <GoAlertFill size={35} color="#F12929" />
        <p className="text-[#0A3503]">
          Para fazer o Aceite da Analise Sócioambiental, é necessário solicitar
          a Estratégia <br /> de Adequação.
        </p>
      </div>

      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Estratégia de Adequação
      </h1>

      <div className="grid grid-cols-3 gap-8 p-6 border border-[#CAC4D0] rounded shadow mb-6">
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

      {existingSuitabilityPlan && (
        <div className="mb-6">
          <div className="bg-white border border-[#CAC4D0] shadow">
            <div className="bg-[#1A6415] text-white p-4">
              <h2 className="text-center font-semibold uppercase">
                Situação da Estratégia de Adequação
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[#21801A] font-medium">
                    Protocolo da Estratégia:
                  </span>
                  <p className="text-gray-800">{existingSuitabilityPlan.id}</p>
                </div>

                <div>
                  <span className="text-[#21801A] font-medium">
                    Situação da estratégia:
                  </span>
                  <p className="text-gray-800">
                    {existingSuitabilityPlan.situacao}
                  </p>
                </div>

                <div>
                  <span className="text-[#21801A] font-medium">
                    Observação:
                  </span>
                  <p className="text-gray-800">
                    {existingSuitabilityPlan.observacao ||
                      "Prazo estimado de análise é de até 10 dias úteis."}
                  </p>
                </div>
              </div>

              {existingSuitabilityPlan.documentos &&
                existingSuitabilityPlan.documentos.filter(
                  (doc) => doc.tipo === "ADEQUACAO"
                ).length > 0 && (
                  <div className="mt-4 flex justify-start">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const adequacaoDoc =
                          existingSuitabilityPlan.documentos.find(
                            (doc) => doc.tipo === "ADEQUACAO"
                          );

                        if (adequacaoDoc) {
                          window.open(adequacaoDoc.urlArquivo, "_blank");
                        }
                      }}
                    >
                      <LuFileSearch size={20} />
                      Acessar parecer
                    </Button>
                  </div>
                )}
            </div>

            {imgAdequancyBase64 && (
              <div className="flex justify-center py-4">
                <Image
                  src={`${imgAdequancyBase64}`}
                  alt="Área destinada à Regeneração"
                  width={900}
                  height={700}
                  className="max-w-full rounded-[20px] shadow"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {hasSubmittedSuitabilityPlan ? (
        <div className="bg-white border border-[#CAC4D0] shadow">
          <div className="bg-[#1A6415] text-white p-4">
            <h2 className="font-semibold text-lg">Estratégia de Adequação</h2>
          </div>

          <div className="bg-[#E8F5E8] p-4 border-b border-[#CAC4D0]">
            <p className="text-[#0A3503] text-sm">
              Situação da Estratégia de Adequação
            </p>
          </div>

          <div className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-600">
                Estratégia de Adequação enviada com sucesso.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <TableInformation>
          <TableInformation.Section title="Deseja propor uma nova área para regeneração?">
            <TableInformation.Row columnsPerRow={2}>
              <TableInformation.Column>
                <TableInformation.Value>
                  <input
                    type="checkbox"
                    id="propose-yes"
                    name="proposeNewArea"
                    value="yes"
                    checked={proposeNewArea === "yes"}
                    disabled={!canChangeProposeNewAreaOption}
                    onChange={handleOpenProposeNewAreaModal}
                    className="accent-[#21801A]"
                  />

                  <label htmlFor="propose-yes" className="ml-2 cursor-pointer">
                    Sim
                  </label>
                </TableInformation.Value>
              </TableInformation.Column>

              <TableInformation.Column>
                <TableInformation.Value>
                  <input
                    type="checkbox"
                    id="propose-no"
                    name="proposeNewArea"
                    value="no"
                    checked={proposeNewArea === "no"}
                    disabled={!canChangeProposeNewAreaOption}
                    onChange={handleOpenDoNotProposeNewAreaModal}
                    className="accent-[#21801A]"
                  />

                  <label htmlFor="propose-no" className="ml-2 cursor-pointer">
                    Não
                  </label>
                </TableInformation.Value>
              </TableInformation.Column>
            </TableInformation.Row>
          </TableInformation.Section>

          <TableInformation.Section
            title="Estratégia de Adequação"
            showArrow
            disabled={proposeNewArea !== "yes"}
            defaultOpen={!!existingSuitabilityPlan || proposeNewArea === "yes"}
          >
            <TableInformation.Row columnsPerRow={1}>
              <TableInformation.Column>
                <TableInformation.Title>
                  Disponibilize o projeto da proposta de Estratégia de Adequação
                  na nova área para regeneração
                </TableInformation.Title>

                <br />

                <TechnicalResponsibleSection />

                <form onSubmit={handleSubmit(handleSaveDocuments)}>
                  <div className="mt-6">
                    <p className="text-[#0A3503] mb-4">
                      Justificativa: Explique de forma breve o objetivo do
                      laudo, indicando o que se pretende comprovar.
                    </p>

                    <TextArea
                      name="motivo"
                      label="Justificativa"
                      placeholder="Digite a justificativa..."
                      control={control}
                    />
                  </div>

                  <DocumentsTechnical files={files} setFiles={setFiles} />

                  <DocumentsTechnical
                    files={files2}
                    setFiles={setFiles2}
                    title="Campo de anexo exclusivo para arquivo SHP zipado"
                    subtitle="(Obrigatório o envio do arquivo SHP no formato .zip)"
                  />

                  <div className="my-6 flex justify-end">
                    <Button
                      type="submit"
                      disabled={
                        createSuitabilityPlan.isPending ||
                        !technicalResponsible ||
                        files.length === 0 ||
                        files2.length === 0 ||
                        proposeNewArea !== "yes"
                      }
                      variant="green"
                      className="w-[320px]"
                    >
                      {existingSuitabilityPlan
                        ? "Plano de Adequação já solicitado"
                        : createSuitabilityPlan.isPending
                          ? "Salvando..."
                          : "Solicitar Plano de Adequação"}
                    </Button>
                  </div>
                </form>
              </TableInformation.Column>
            </TableInformation.Row>
          </TableInformation.Section>
        </TableInformation>
      )}

      {currentModalContent && (
        <ActionConfirmationModal
          isOpen={!!confirmationAction}
          title={currentModalContent.title}
          description={currentModalContent.description}
          confirmText="Sim, continuar"
          cancelText="Cancelar"
          isLoading={updateFarmActions.isPending}
          onClose={closeConfirmationModal}
          onConfirm={handleConfirmModalAction}
        />
      )}
    </>
  );
};
