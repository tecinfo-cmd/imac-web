"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import { IoTrashSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { Table } from "@/components/Table";
import { TableInformation } from "@/components/TableInformation";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import { useCreateSuppressionAuthorization } from "@/hooks/useEnvironmentalAnalysis/useCreateSuppressionContestation";
import { useGetIssuingBodies } from "@/hooks/useEnvironmentalAnalysis/useGetIssuingBodies";
import { useGetSuppressionTypes } from "@/hooks/useEnvironmentalAnalysis/useGetSuppressionTypes";
import { useTechnicalResponsibleContestationStore } from "@/store/useTechnicalResponsibleContestationStore";
import { maskDate } from "@/utils/maskDate";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import { Document, DOCUMENT_LABEL_MAP, INITIAL_DOCUMENTS } from "../types";
import { DocumentTable } from "./DocumentTable";

interface SuppressionData {
  dataEmissao: string;
  dataValidade: string;
  tipo: { value: number; label: string } | null;
  orgaoEmissor: { value: number; label: string } | null;
  areaAutorizada: number;
  motivo: string;
  arquivos: File[];
  nomeArquivos: string[];
}

const convertToISO8601 = (date: string | null) => {
  if (!date) return "";
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

const suppressionSchema = yup.object({
  dataEmissao: yup.string().required("Data de emissão é obrigatória"),
  dataValidade: yup
    .string()
    .required("Data de validade é obrigatória")
    .test(
      "is-after-emission",
      "Data de validade deve ser posterior à data de emissão",
      function (value) {
        const { dataEmissao } = this.parent;
        if (!dataEmissao || !value) return true;

        const issueDate = new Date(dataEmissao.split("/").reverse().join("-"));
        const expirationDate = new Date(value.split("/").reverse().join("-"));

        return expirationDate > issueDate;
      }
    ),
  tipo: yup.object().nullable().required("Tipo é obrigatório"),
  orgaoEmissor: yup.object().nullable().required("Órgão emissor é obrigatório"),
  areaAutorizada: yup.number().required("Área autorizada é obrigatória"),
  arquivos: yup.array().min(1, "Pelo menos um arquivo é obrigatório"),
  motivo: yup.string().optional(),
});

type SuppressionFormData = yup.InferType<typeof suppressionSchema>;

interface SuppressionAuthorizationSectionProps {
  farmId: number;
  analysisId: number;
  disabled?: boolean;
}

export const SuppressionAuthorizationSection = ({
  farmId,
  analysisId,
  disabled = false,
}: SuppressionAuthorizationSectionProps) => {
  const [suppressionDataList, setSuppressionDataList] = useState<
    SuppressionData[]
  >([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [sent, setSent] = useState(false);
  const { data: suppressionTypes } = useGetSuppressionTypes();
  const { data: issuingBodies } = useGetIssuingBodies();
  const { mutateAsync: createSuppressionAuthorization, isPending } =
    useCreateSuppressionAuthorization(farmId, analysisId);
  const { technicalResponsible } = useTechnicalResponsibleContestationStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, reset, setValue } =
    useForm<SuppressionFormData>({
      resolver: yupResolver(suppressionSchema),
    });

  const [justification, setJustification] = useState<string>("");

  if (sent ||disabled) {
    return (
      <div className="bg-white border border-[#CAC4D0] shadow">
        <div className="bg-[#1A6415] text-white p-4">
          <h2 className="font-semibold text-lg">Autorização de Supressão</h2>
        </div>
        <div className="bg-[#E8F5E8] p-4 border-b border-[#CAC4D0]">
          <p className="text-[#0A3503] text-sm">
            Dados da autorização de supressão
          </p>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-600">
              Autorização enviada com sucesso.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
    setValue("arquivos", [...uploadedFiles, ...files]);
  };

  const handleAddSuppressionData = (data: SuppressionFormData) => {
    const newSuppressionData: SuppressionData = {
      dataEmissao: data.dataEmissao,
      dataValidade: data.dataValidade,
      tipo: data.tipo as { value: number; label: string } | null,
      orgaoEmissor: data.orgaoEmissor as {
        value: number;
        label: string;
      } | null,
      areaAutorizada: data.areaAutorizada,
      motivo: "",
      arquivos: data.arquivos as File[],
      nomeArquivos: (data.arquivos as File[]).map((file) => file.name),
    };

    setSuppressionDataList((prev) => [...prev, newSuppressionData]);

    setUploadedFiles([]);
    setValue("arquivos", []);
    reset();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveSuppressionData = (index: number) => {
    setSuppressionDataList((prev) => prev.filter((_, i) => i !== index));
    toast.success("Dados removidos com sucesso!");
  };

  const handleSubmitSuppressionAuthorization = async () => {
    if (suppressionDataList.length === 0) {
      toast.error(
        "Preencha o formulário acima e clique em 'Adicionar' para incluir pelo menos uma autorização de supressão!"
      );
      return;
    }

    if (!justification || !justification.trim()) {
      toast.error("A justificativa é obrigatória!");
      return;
    }

    try {
      const documentsWithFiles = documents.filter((doc) => doc.file);

      if (documentsWithFiles.length === 0) {
        toast.error(
          "Adicione pelo menos um arquivo na Anotação de responsabilidade técnica!"
        );
        return;
      }

      const allFileParams: Array<{ nome: string; tipo: string }> = [];

      documentsWithFiles.forEach((doc) => {
        if (doc.file) {
          allFileParams.push({
            nome: doc.file.name,
            tipo: doc.type,
          });
        }
      });

      suppressionDataList.forEach((suppression) => {
        suppression.arquivos.forEach((file) => {
          allFileParams.push({
            nome: file.name,
            tipo: "AUTORIZACAO_SUPRESSAO",
          });
        });
      });

      const parametros = JSON.stringify(allFileParams);

      const autorizacoesSupressoes = JSON.stringify(
        suppressionDataList.map((suppression) => ({
          dataEmissao: convertToISO8601(suppression.dataEmissao),
          dataValidade: convertToISO8601(suppression.dataValidade),
          idTipo: suppression.tipo?.value || 0,
          idOrgaoEmissor: suppression.orgaoEmissor?.value || 0,
          areaAutorizadaParaSupressaoHa: suppression.areaAutorizada,
          nomeArquivo: suppression.nomeArquivos.join(", "),
        }))
      );

      const allFiles: File[] = [];

      documentsWithFiles.forEach((doc) => {
        if (doc.file) {
          allFiles.push(doc.file);
        }
      });

      suppressionDataList.forEach((suppression) => {
        suppression.arquivos.forEach((file) => {
          allFiles.push(file);
        });
      });

      await createSuppressionAuthorization(
        {
          parametros,
          arquivos: allFiles,
          motivo: justification,
          idResponsavelTecnico: technicalResponsible?.id
            ? parseInt(technicalResponsible.id)
            : 0,
          autorizacoesSupressoes,
        },
        {
          onSuccess: () => {
            toast.success(
              "Contestação de autorização de supressão enviada com sucesso!"
            );

            setSuppressionDataList([]);
            setUploadedFiles([]);
            setDocuments(INITIAL_DOCUMENTS);
            setJustification("");
            setSent(true);
          },
          onError: (error) => {
            console.error("Erro ao enviar contestação:", error);
            toast.error("Erro ao enviar contestação. Tente novamente.");
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

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

  const suppressionTypeOptions =
    suppressionTypes?.map((type) => ({
      value: Number(type.id),
      label: type.nome,
    })) || [];

  const issuingBodyOptions =
    issuingBodies?.map((body) => ({
      value: Number(body.id),
      label: body.nome,
    })) || [];

  return (
    <TableInformation.Section
      title="Autorização de Supressão"
      showArrow
      defaultOpen={false}
    >
      <TableInformation.Row columnsPerRow={1}>
        <TableInformation.Column>
          <TableInformation.Title>
            Autorização de Supressão: O desmatamento ocorreu por Autorização de
            Supressão.
          </TableInformation.Title>
          <TableInformation.Value>
            <form onSubmit={handleSubmit(handleAddSuppressionData)}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  name="dataEmissao"
                  label="Data de Emissão"
                  placeholder="dd/mm/aaaa"
                  control={control}
                  mask={maskDate}
                />

                <Input
                  name="dataValidade"
                  label="Data de Validade"
                  placeholder="dd/mm/aaaa"
                  control={control}
                  mask={maskDate}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputSelect
                  name="tipo"
                  label="Tipo:"
                  placeholder="Selecione o tipo"
                  control={control}
                  options={suppressionTypeOptions}
                />

                <InputSelect
                  name="orgaoEmissor"
                  label="Orgão Emissor:"
                  placeholder="Selecione o órgão"
                  control={control}
                  options={issuingBodyOptions}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  name="areaAutorizada"
                  label="Área autorizada para supressão (ha)"
                  placeholder="Digite a área"
                  type="number"
                  control={control}
                />

                <div className="flex flex-col">
                  <label className="block text-[#21801A] font-medium mb-2">
                    Arquivo:
                  </label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-[48px] p-4 rounded focus:outline-none border border-[#CAC4D0] shadow-[0px_1px_3px_rgba(0,0,0,0.3)] bg-white text-left flex items-center justify-between hover:border-[#21801A] transition-colors"
                    >
                      <span className="text-gray-600">
                        {uploadedFiles.length > 0
                          ? `${uploadedFiles.length} arquivo selecionado`
                          : "Selecione o arquivo"}
                      </span>
                      <FiUpload className="text-gray-400" size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" variant="green" className="w-[253px]">
                  Adicionar
                </Button>
              </div>
              {suppressionDataList.length > 0 && (
                <div className="mb-6">
                  <Table.Container>
                    <Table.Header>
                      <Table.Title>N°</Table.Title>
                      <Table.Title>Data de Emissão</Table.Title>
                      <Table.Title>Data de Validade</Table.Title>
                      <Table.Title>Tipo de Supressao</Table.Title>
                      <Table.Title>Orgão Emissor</Table.Title>
                      <Table.Title>Área Autorizada (ha)</Table.Title>
                      <Table.Title>Nome Documento</Table.Title>
                      <Table.Title>Ações</Table.Title>
                    </Table.Header>
                    <Table.Body>
                      {suppressionDataList.map((doc, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>{index + 1}</Table.Cell>
                          <Table.Cell>{doc.dataEmissao}</Table.Cell>
                          <Table.Cell>{doc.dataValidade}</Table.Cell>
                          <Table.Cell>{doc.tipo?.label || "-"}</Table.Cell>
                          <Table.Cell>
                            {doc.orgaoEmissor?.label || "-"}
                          </Table.Cell>
                          <Table.Cell>{doc.areaAutorizada}</Table.Cell>
                          <Table.Cell>
                            {doc.nomeArquivos.join(", ") || "-"}
                          </Table.Cell>
                          <Table.Cell className="border-none flex gap-2 items-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveSuppressionData(index)}
                              className="text-red-600"
                            >
                              <IoTrashSharp size={18} />
                            </button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Container>
                </div>
              )}
            </form>
            <div className="mt-6">
              <p className="text-[#0A3503] mb-4">
                Justificativa: Explique de forma breve o objetivo do laudo,
                indicando o que se pretende comprovar.
              </p>
              <div className="flex flex-col">
                <label className="block text-[#21801A] font-medium mb-2">
                  Justificativa
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Digite a justificativa..."
                  className="w-full min-h-[130px] p-4 rounded focus:outline-none border border-[#CAC4D0] shadow-[0px_1px_3px_rgba(0,0,0,0.3)] placeholder:text-[#D7D6D7] resize-none"
                />
              </div>
            </div>

            <DocumentTable
              documents={documents}
              onCheckboxChange={handleToggleDocument}
              onFileChange={handleUploadDocument}
              onRemoveFile={handleRemoveDocument}
              labelMap={DOCUMENT_LABEL_MAP}
            />

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSubmitSuppressionAuthorization}
                variant="green"
                className="w-[253px]"
                disabled={isPending}
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
