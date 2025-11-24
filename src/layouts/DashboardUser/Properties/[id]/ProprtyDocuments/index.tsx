"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoArrowLeft } from "react-icons/go";
import { MdEngineering } from "react-icons/md";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  PiFarmLight,
} from "react-icons/pi";
import { TbDownload, TbLoaderQuarter } from "react-icons/tb";

import { Modal } from "../SelfInspection/components/Modal";
import { Input } from "@/components/Input";
import { InputFileUpload } from "@/components/InputFile";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";

import { api } from "@/api";
import { yup } from "@/config/yup";
import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { useUserRoleStore } from "@/store/useUserRoleStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

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

interface PropertyDocumentsLayoutProps {
  farmId?: number;
  onGoBack?: () => void;
}

const handleDownload = (documentUrl: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = documentUrl;
  link.download = fileName;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("pt-BR");
  } catch {
    return "N/A";
  }
};

export default function PropertyDocumentsLayout({
  farmId,
  onGoBack,
}: PropertyDocumentsLayoutProps) {
  const params = useParams();
  const router = useRouter();
  const propriedadeId = params?.id as string;

  const { role } = useUserRoleStore();

  const routeId = propriedadeId;

  const routeIdNumber = routeId ? Number(routeId) : undefined;

  const idToUse = farmId ?? routeIdNumber;

  const [openModal, setOpenModal] = useState(false);
  const schema = yup.object().shape({
    nomeArquivo: yup.string().required("!"),
    file: yup.mixed().test("required", "Arquivo é obrigatório", (value) => {
      if (!value) return false;
      if (value instanceof File) return true;
      if (Array.isArray(value) && value.length > 0)
        return value[0] instanceof File;
      if (
        typeof FileList !== "undefined" &&
        value instanceof FileList &&
        value.length > 0
      )
        return true;
      return false;
    }),
  });

  const {
    data: farmData,
    isLoading: isLoadingFarm,
    error: errorFarm,
    refetch,
  } = useGetFarmById(idToUse || 0);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: any) => {
    const { nomeArquivo, file } = values || {};
    let arquivo: File | null = null;
    if (file instanceof File) {
      arquivo = file;
    } else if (file && file.length > 0 && file[0] instanceof File) {
      arquivo = file[0];
    }

    if (!arquivo) {
      toast.error("Selecione um arquivo antes de enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("arquivos", arquivo);

    const parametros = [
      {
        nome: arquivo.name,
        tipo: nomeArquivo.toUpperCase(),
      },
    ];

    formData.append("parametros", JSON.stringify(parametros));

    try {
      setIsSubmitting(true);
      await api.post(
        `/propriedade-prem/${idToUse}/upload-documentos`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Documento enviado com sucesso!");
      reset();
      setOpenModal(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar o documento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems = role === "ANALISTA" ? customMenuItems : undefined;
  const handleGoBack = () => {
    if (role === "PRODUTOR" && onGoBack) {
      onGoBack();
    } else if (role === "ANALISTA") {
      router.push(`/dashboard/properties/${propriedadeId}`);
    }
  };

  const isLoading = isLoadingFarm;
  const error = errorFarm;

  if (isLoading) {
    return (
      <LayoutContainer
        title="Acompanhamento da Propriedade"
        menuItems={menuItems}
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-[#21801A] text-lg">Carregando documentos...</p>
        </div>
      </LayoutContainer>
    );
  }

  const documents = (farmData?.documentos || []).map((doc: any) => ({
    id: doc.id,
    dataUpload: doc.dataUpload,
    nomeArquivoOriginal: doc.nomeArquivoOriginal || doc.nomeArquivo,
    tipo: doc.tipo,
    urlArquivo: doc.urlArquivo,
  }));

  const documentAnalises = (farmData?.retornoAnalises || [])
    .flatMap((analise: any) => [
      ...(analise.documentos || []),
      ...(analise.contestacaoAutorizacaoSupressao?.documentos || []),
      ...(analise.contestacaoLaudo?.documentos || []),
      ...(analise.planoAdequacao?.documentos || []),
    ])
    .map((doc: any) => ({
      id: doc.id,
      dataUpload: doc.dataUpload,
      nomeArquivoOriginal: doc.nomeArquivoOriginal || doc.nomeArquivo,
      tipo: doc.tipo,
      urlArquivo: doc.urlArquivo,
    }));

  if (error) {
    return (
      <LayoutContainer
        title="Acompanhamento da Propriedade"
        menuItems={menuItems}
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-red-500 text-lg">Erro ao carregar documentos</p>
        </div>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer
      title="Acompanhamento da Propriedade"
      menuItems={menuItems}
    >
      <div className="max-w-6xl mx-auto my-8">
        <button
          onClick={handleGoBack}
          className="text-[#21801A] flex items-center gap-3"
        >
          <GoArrowLeft size={28} />
        </button>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-[#21801A] text-center w-full">
          Documentos da Propriedade
        </h2>
        {role === "PRODUTOR" && (
          <Button variant="green" onClick={() => setOpenModal(true)}>
            Novo
          </Button>
        )}
      </div>
      {documents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            Nenhum documento encontrado para esta propriedade.
          </p>
        </div>
      ) : (
        <div className="mb-8">
          <Table.Container>
            <Table.Header>
              <Table.Title
                colspan={4}
                className="bg-[#21801A] text-white text-base"
              >
                Documentos da propriedade
              </Table.Title>
            </Table.Header>
            <Table.Header>
              <Table.Title>Data de upload</Table.Title>
              <Table.Title>Nome do arquivo</Table.Title>
              <Table.Title> </Table.Title>
            </Table.Header>
            <Table.Body>
              {documents.map((doc, i) => (
                <Table.Row key={doc.id || `${doc.nomeArquivoOriginal}-${i}`}>
                  <Table.Cell>{formatDate(doc.dataUpload)}</Table.Cell>
                  <Table.Cell>{doc.tipo || "-"}</Table.Cell>
                  <Table.Cell>
                    <Tooltip
                      message="Baixar documento"
                      id={`download-document-${i}`}
                    >
                      <button
                        type="button"
                        className="hover:bg-[#DFEEE5] p-2 rounded transition"
                        onClick={() =>
                          handleDownload(
                            doc.urlArquivo,
                            doc.nomeArquivoOriginal || "documento"
                          )
                        }
                        disabled={!doc.urlArquivo}
                      >
                        <TbDownload />
                      </button>
                    </Tooltip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Header>
              <Table.Title
                colspan={4}
                className="bg-[#21801A] text-white text-base"
              >
                Parecer e relatórios da propriedade
              </Table.Title>
            </Table.Header>
            <Table.Header>
              <Table.Title>Data de upload</Table.Title>
              <Table.Title>Nome do arquivo</Table.Title>
              <Table.Title> </Table.Title>
            </Table.Header>
            <Table.Body>
              {documentAnalises.length === 0 ? (
                <Table.Row>
                  <Table.Cell colspan={3} className="text-center text-gray-500">
                    Nenhum documento de análise encontrado
                  </Table.Cell>
                </Table.Row>
              ) : (
                documentAnalises.map((doc, i) => (
                  <Table.Row key={doc.id || `analise-${i}`}>
                    <Table.Cell>{formatDate(doc.dataUpload) || "-"}</Table.Cell>
                    <Table.Cell>{doc.tipo || "N/A"}</Table.Cell>
                    <Table.Cell>
                      <Tooltip
                        message="Baixar documento"
                        id={`download-analise-${i}`}
                      >
                        <button
                          type="button"
                          className="hover:bg-[#DFEEE5] p-2 rounded transition"
                          onClick={() =>
                            handleDownload(
                              doc.urlArquivo,
                              doc.nomeArquivoOriginal || "documento"
                            )
                          }
                          disabled={!doc.urlArquivo}
                        >
                          <TbDownload />
                        </button>
                      </Tooltip>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Container>
        </div>
      )}
      <div className="mt-10">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleGoBack();
          }}
          className="text-[#21801A] underline text-sm"
        >
          Voltar
        </a>
      </div>

      <Modal.Container
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        className="border-1 rounded-lg shadow-sm"
      >
        <Modal.Header className="text-center">
          Documentos da propriedade
          <div className="text-sm font-normal">
            (Matricula do imóvel, recibo CAR, contrato de compra e venda /
            locação, documentos de identificação e comprovante de endereço)
          </div>
          <Modal.CloseButton onClose={() => setOpenModal(false)} />
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              name="nomeArquivo"
              label="Nome do Arquivo"
              placeholder="Digite o título do arquivo"
              control={control}
            />

            <InputFileUpload
              name="file"
              label="Insira o Arquivo"
              control={control}
              accept="application/pdf,image/*"
            />

            <Button
              type="submit"
              variant="green"
              className="mt-4 w-40 mx-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <TbLoaderQuarter className="animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </form>
        </Modal.Body>
      </Modal.Container>
    </LayoutContainer>
  );
}
