import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoAlertFill } from "react-icons/go";

import { DocumentTable } from "../Contestation/components/DocumentTable";
import { TechnicalResponsibleSection } from "./components/TechnicalResponsibleSection";
import { TableInformation } from "@/components/TableInformation";
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import { useCreateSuitabilityPlan } from "@/hooks/useEnvironmentalAnalysis/useCreateSuitabilityPlan";
import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { useTechnicalResponsibleSuitabilityPlanStore } from "@/store/useTechnicalResponsibleSuitabilityPlanStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import { Document, DOCUMENT_LABEL_MAP, INITIAL_DOCUMENTS } from "./types";

interface SuitabilityPlanProps {
  farmId: number;
  analysisId: number;
  onNavigateToAdequancyTerm?: () => void;
}

const suitabilityPlanSchema = yup.object({
  motivo: yup.string().required("Justificativa é obrigatória"),
});

type SuitabilityPlanFormData = yup.InferType<typeof suitabilityPlanSchema>;

export const SuitabilityPlan = ({
  farmId,
  analysisId,
  onNavigateToAdequancyTerm,
}: SuitabilityPlanProps) => {
  const { data: farm } = useGetFarmById(farmId);
  const createSuitabilityPlan = useCreateSuitabilityPlan();
  const { technicalResponsible } =
    useTechnicalResponsibleSuitabilityPlanStore();

  const { control, handleSubmit } = useForm<SuitabilityPlanFormData>({
    resolver: yupResolver(suitabilityPlanSchema),
    defaultValues: {
      motivo: "",
    },
  });

  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [proposeNewArea, setProposeNewArea] = useState<"yes" | "no" | null>(
    null
  );

  const hasValidParams = farmId && analysisId;
  const hasSuitabilityPlanInProgress = farm?.analise?.planoAdequacao;

  const canAccess = hasValidParams || hasSuitabilityPlanInProgress;

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

  const handleCheckboxChange = (index: number) => {
    setDocuments((prevDocuments) => {
      const updatedDocuments = prevDocuments.map((doc, i) => {
        if (i === index) {
          return { ...doc, checked: !doc.checked };
        }
        return doc;
      });
      return updatedDocuments;
    });
  };

  const handleFileChange = (index: number, file: File) => {
    setDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments];
      updatedDocuments[index].file = file;
      updatedDocuments[index].uploadDate = new Date().toLocaleDateString(
        "pt-BR"
      );
      return updatedDocuments;
    });
  };

  const handleRemoveFile = (index: number) => {
    setDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments];
      updatedDocuments[index].file = undefined;
      updatedDocuments[index].uploadDate = undefined;
      return updatedDocuments;
    });
  };

  const handleProposeNewAreaChange = (value: "yes" | "no") => {
    setProposeNewArea(value);
  };

  const handleSaveDocuments = async (data: SuitabilityPlanFormData) => {
    // Verificar se o usuário escolheu uma opção para nova área
    if (proposeNewArea === null) {
      toast.error("Selecione se deseja propor uma nova área para regeneração!");
      return;
    }

    // Verificar se há documentos com arquivos
    const documentsWithFiles = documents.filter((doc) => doc.file);

    if (documentsWithFiles.length === 0) {
      toast.error("Adicione pelo menos um documento!");
      return;
    }

    if (!technicalResponsible) {
      toast.error("Primeiro cadastre um responsável técnico!");
      return;
    }

    // Criar array de parâmetros para os arquivos
    const params = documentsWithFiles.map((doc) => ({
      nome: doc.file!.name,
      tipo: doc.type,
    }));

    // Extrair arquivos dos documentos
    const files = documentsWithFiles.map((doc) => doc.file!);

    try {
      await createSuitabilityPlan.mutateAsync({
        farmId,
        analysisId: analysisId,
        data: {
          parametros: JSON.stringify(params),
          arquivos: files,
          motivo: data.motivo,
          idResponsavelTecnico: Number(technicalResponsible.id),
        },
      });

      toast.success("Plano de adequação salvo com sucesso!");
    } catch {
      toast.error("Erro ao salvar plano de adequação. Tente novamente.");
    }
  };

  return (
    <>
      <div className="w-fit mx-auto flex justify-center items-center gap-3 border border-[#CAC4D0] p-4 rounded">
        <GoAlertFill size={35} color="#F12929" />
        <p className="text-[#0A3503]">
          Para fazer o Aceite da Analise Sócioambiental, é necessário solicitar
          o Plano <br /> de Adequação.
        </p>
      </div>
      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Plano de Adequação
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
              <p>-</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Status</h2>
              <p>-</p>
            </div>
          </div>
        </div>
      </div>

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
                  onChange={() => handleProposeNewAreaChange("yes")}
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
                  onChange={() => {
                    handleProposeNewAreaChange("no");
                    if (onNavigateToAdequancyTerm) {
                      onNavigateToAdequancyTerm();
                    }
                  }}
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
          defaultOpen={false}
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
                    Justificativa: Explique de forma breve o objetivo do laudo,
                    indicando o que se pretende comprovar.
                  </p>
                  <TextArea
                    name="motivo"
                    label="Justificativa"
                    placeholder="Digite a justificativa..."
                    control={control}
                  />
                </div>

                <DocumentTable
                  documents={documents}
                  onCheckboxChange={handleCheckboxChange}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleRemoveFile}
                  labelMap={DOCUMENT_LABEL_MAP}
                />

                <div className="my-6 flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      createSuitabilityPlan.isPending || !technicalResponsible
                    }
                    variant="green"
                    className="w-[320px]"
                  >
                    {createSuitabilityPlan.isPending
                      ? "Salvando..."
                      : "Solicitar Plano de Adequação"}
                  </Button>
                </div>
              </form>
            </TableInformation.Column>
          </TableInformation.Row>
        </TableInformation.Section>
      </TableInformation>
    </>
  );
};
