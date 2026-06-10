"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { TableInformation } from "@/components/TableInformation";
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import { useCreateReportContestation } from "@/hooks/useEnvironmentalAnalysis/useCreateReportContestation";
import { useTechnicalResponsibleContestationStore } from "@/store/useTechnicalResponsibleContestationStore";
import { customToast } from "@/utils/customToast";
import { yupResolver } from "@hookform/resolvers/yup";

import { DocumentsTechnical } from "./Documents";

const reportSchema = yup.object({
  motivo: yup.string().optional(),
});

type ReportFormData = yup.InferType<typeof reportSchema>;

interface ReportContestationSectionProps {
  farmId: number;
  analysisId: number;
  disabled?: boolean;
  reportContestation?: {
    situacao: string;
    dataCriacao: string | null;
  } | null;
}

type Documento = {
  id: number;
  nomeArquivo: string;
  nomeArquivoOriginal: string;
  urlArquivo: string;
  tipo: string;
};

const isSuccessfulStatus = (situacao: string | undefined): boolean => {
  if (!situacao) return false;
  const normalizedStatus = situacao;
  return normalizedStatus === "Em Análise" || normalizedStatus === "DEFERIDO";
};

export const ReportContestationSection = ({
  farmId,
  analysisId,
  disabled = false,
  reportContestation,
}: ReportContestationSectionProps) => {
  const [files, setFiles] = useState<(Documento | File)[]>([]);
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

  const shouldShowSuccessMessage =
    sent ||
    (reportContestation && isSuccessfulStatus(reportContestation.situacao));

  if (shouldShowSuccessMessage) {
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
            <p className="text-gray-600">Contestação enviada com sucesso.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitReportContestation = async () => {
    try {
      if (files.length === 0) {
        customToast.error("Adicione pelo menos um arquivo!");
        return;
      }

      if (!technicalResponsible?.id) {
        customToast.error("Responsável técnico não encontrado!");
        return;
      }

      const stripExtension = (filename: string) =>
        filename.replace(/\.[^/.]+$/, "");

      const parametros = JSON.stringify(
        files.map((file) => {
          const originalName =
            "name" in file ? file.name : file.nomeArquivoOriginal;
          return {
            nome: originalName,
            tipo: stripExtension(originalName).toLocaleUpperCase(),
          };
        })
      );

      await createReportContestation(
        {
          parametros,
          arquivos: files.filter((file): file is File => file instanceof File),
          motivo: motivo || "",
          idResponsavelTecnico: parseInt(technicalResponsible.id),
        },
        {
          onSuccess: () => {
            customToast.success("Contestação por laudo enviada com sucesso!");
            setFiles([]);
            setSent(true);
          },
          onError: (error) => {
            console.error("Erro ao enviar contestação por laudo:", error);
            customToast.error(
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
              <DocumentsTechnical files={files} setFiles={setFiles} />
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
