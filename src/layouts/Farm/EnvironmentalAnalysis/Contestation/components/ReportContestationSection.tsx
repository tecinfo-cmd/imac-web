"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { TableInformation } from "@/components/TableInformation";
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import { useCreateReportContestation } from "@/hooks/useEnvironmentalAnalysis/useCreateReportContestation";
import { useTechnicalResponsibleContestationStore } from "@/store/useTechnicalResponsibleContestationStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import { Document, DOCUMENT_LABEL_MAP, INITIAL_DOCUMENTS } from "../types";
import { DocumentTable } from "./DocumentTable";

const reportSchema = yup.object({
  motivo: yup.string().optional(),
});

type ReportFormData = yup.InferType<typeof reportSchema>;

interface ReportContestationSectionProps {
  farmId: number;
  analysisId: number;
  disabled?: boolean;
}

export const ReportContestationSection = ({
  farmId,
  analysisId,
  disabled = false,
}: ReportContestationSectionProps) => {
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
    const [sent, setSent] = useState(false);

  const { mutateAsync: createReportContestation, isPending } =
    useCreateReportContestation(farmId, analysisId);
  const { technicalResponsible } = useTechnicalResponsibleContestationStore();

  const { control, watch } = useForm<ReportFormData>({
    resolver: yupResolver(reportSchema),
    defaultValues: {
      motivo: "",
    },
  });

  const motivo = watch("motivo");

  if (sent || disabled) {
    return (
      <div className="bg-white border border-[#CAC4D0] shadow">
        <div className="bg-[#1A6415] text-white p-4">
          <h2 className="font-semibold text-lg">Contestação por Laudo</h2>
        </div>
        <div className="bg-[#E8F5E8] p-4 border-b border-[#CAC4D0]">
          <p className="text-[#0A3503] text-sm">
            Dados da contestação por laudo
          </p>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-600">
              Contestação enviada com sucesso.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleDocument = (index: number) => {
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

  const handleUploadDocument = (index: number, file: File) => {
    setDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments];
      updatedDocuments[index].file = file;
      updatedDocuments[index].uploadDate = new Date().toLocaleDateString(
        "pt-BR"
      );
      return updatedDocuments;
    });
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments];
      updatedDocuments[index].file = undefined;
      updatedDocuments[index].uploadDate = undefined;
      return updatedDocuments;
    });
  };

  const handleSubmitReportContestation = async () => {
    try {
      const documentsWithFiles = documents.filter((doc) => doc.file);

      if (documentsWithFiles.length === 0) {
        toast.error("Adicione pelo menos um arquivo!");
        return;
      }

      if (!technicalResponsible?.id) {
        toast.error("Responsável técnico não encontrado!");
        return;
      }

      const parametros = JSON.stringify(
        documentsWithFiles.map((doc) => ({
          nome: doc.file?.name || "",
          tipo: doc.type,
        }))
      );

      const arquivos = documentsWithFiles
        .map((doc) => doc.file!)
        .filter(Boolean);

      await createReportContestation(
        {
          parametros,
          arquivos,
          motivo: motivo || "",
          idResponsavelTecnico: parseInt(technicalResponsible.id),
        },
        {
          onSuccess: () => {
            toast.success("Contestação por laudo enviada com sucesso!");
            setDocuments(INITIAL_DOCUMENTS);
            setSent(true);
          },
          onError: (error) => {
            console.error("Erro ao enviar contestação por laudo:", error);
            toast.error(
              "Erro ao enviar contestação por laudo. Tente novamente."
            );
          },
        }
      );
    } catch (error) {
      console.error("Erro ao enviar contestação por laudo:", error);
    }
  };

  return (
    <TableInformation.Section
      title="Contestação por Laudo"
      showArrow
      defaultOpen={false}
    >
      <TableInformation.Row columnsPerRow={1}>
        <TableInformation.Column>
          <TableInformation.Title>
            A Contestação por laudo podem ser de:
            <br />
            1- Falso-positivo: a área indicada manteve a cobertura do solo, sem
            desmatamento no período analisado.
            <br />
            2- De área consolidada: O desmatamento identificado pelo PRODES
            ocorreu, porém, antes da data limite estabelecida. (data 22/07/2008)
          </TableInformation.Title>
          <TableInformation.Value>
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

            <div className="mt-8">
              <DocumentTable
                documents={documents}
                onCheckboxChange={handleToggleDocument}
                onFileChange={handleUploadDocument}
                onRemoveFile={handleRemoveDocument}
                labelMap={DOCUMENT_LABEL_MAP}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSubmitReportContestation}
                variant="green"
                className="w-[253px]"
                disabled={isPending || disabled}
              >
                {isPending ? "Enviando..." : "Salvar"}
              </Button>
            </div>
          </TableInformation.Value>
        </TableInformation.Column>
      </TableInformation.Row>
    </TableInformation.Section>
  );
};
