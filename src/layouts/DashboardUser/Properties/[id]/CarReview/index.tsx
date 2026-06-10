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

import { Modal } from "../SelfInspection/components/Modal";
import { Input } from "@/components/Input";
import { InputFileUpload } from "@/components/InputFile";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";

import { api } from "@/api";
import { useObjectionData } from "@/hooks/useGetProperties/useObjectionData";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { Eye } from "@/icons/Eye";
import { customToast } from "@/utils/customToast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: <Analityc /> },
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

export const CarReviewLayout = () => {
  const params = useParams();
  const router = useRouter();
  const propriedadeId = params?.id as string;
  const [openModal, setOpenModal] = useState(false);
  const schema = yup.object().shape({
    nomeArquivo: yup.string().required("Nome do arquivo é obrigatório"),
    descricaoArquivo: yup.string().nullable(),
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

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: objectionData, refetch: refetchObjection } = useObjectionData();
  const documents =
    objectionData?.documentosPropriedade?.filter((d: any) => !!d.enviadoPorAnalista) || [];

  const onSubmit = async (values: any) => {
    const { nomeArquivo, descricaoArquivo, file } = values || {};
    let arquivo: File | null = null;
    if (file instanceof File) {
      arquivo = file;
    } else if (file && file.length > 0 && file[0] instanceof File) {
      arquivo = file[0];
    }

    if (!arquivo) {
      customToast.error("Selecione um arquivo antes de enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("arquivos", arquivo);

    const parametros = [
      {
        nome: arquivo.name,
        tipo: arquivo.name.split(".").slice(0, -1).join(".").toUpperCase(),
        descricao: descricaoArquivo || "",
        titulo: nomeArquivo || "",
      },
    ];

    formData.append("parametros", JSON.stringify(parametros));

    try {
      setIsSubmitting(true);
      await api.post(
        `/propriedade-prem/${propriedadeId}/upload-documentos`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      customToast.success("Documento enviado com sucesso!");
      reset();
      setOpenModal(false);
      await refetchObjection();
    } catch (err) {
      console.error(err);
      customToast.error("Erro ao enviar o documento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateOnly = (iso?: string) => {
    if (!iso) return "-";
    const datePart = iso.split("T")[0] || iso;
    const parts = datePart.split("-");
    if (parts.length < 3) return "-";
    const [year, month, day] = parts;
    if (!year || !month || !day) return "-";
    return `${day}/${month}/${year}`;
  };

  return (
    <LayoutContainer
      title="Revisão do Car e Outros documentos"
      menuItems={menuItems}
    >
      <div className="max-w-6xl mx-auto my-8">
        <button
          onClick={() => router.push(`/dashboard/properties/${propriedadeId}`)}
          className="text-[#21801A] flex items-center gap-3"
        >
          <GoArrowLeft size={28} />
        </button>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-[#21801A] text-center w-full">
          Revisão do Car e Outros documentos
        </h2>
        <Button variant="green" onClick={() => setOpenModal(true)}>
          Novo
        </Button>
      </div>
      <Table.Container>
        <Table.Header>
          <Table.Title
            colspan={3}
            className="bg-[#21801A] text-white text-base"
          >
            Revisão do Car e outros documentos
          </Table.Title>
        </Table.Header>
        <Table.Header>
          <Table.Title className="bg-[#D6EAD3] text-[#21801A] font-bold">
            Data de upload
          </Table.Title>
          <Table.Title
            className="bg-[#D6EAD3] text-[#21801A] font-bold"
            colspan={2}
          >
            Nome do arquivo
          </Table.Title>
        </Table.Header>
          <Table.Body>
            {documents.length === 0 ? (
              <Table.Row>
                <Table.Cell colspan={3}>Nenhum documento enviado por analista.</Table.Cell>
              </Table.Row>
            ) : (
              documents.map((doc: any, i: number) => (
                <Table.Row key={doc.id || doc.nomeArquivo + i}>
                  <Table.Cell>{formatDateOnly(doc.dataUpload)}</Table.Cell>
                  <Table.Cell>{doc.nomeArquivoOriginal}</Table.Cell>
                  <Table.Cell>
                    <Tooltip message="Visualizar documento" id={`view-${doc.id || i}`}>
                      <a href={doc.urlArquivo} target="_blank" rel="noreferrer">
                        <Eye size={30} />
                      </a>
                    </Tooltip>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
      </Table.Container>
      <div className="mt-10">
        <a href="#" className="text-[#21801A] underline text-sm">
          Voltar
        </a>
      </div>

      <Modal.Container
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        className="border-1 rounded-lg shadow-sm"
      >
        <Modal.Header>
          Revisão do Car e Outros documentos
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
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </Modal.Body>
      </Modal.Container>
    </LayoutContainer>
  );
};
