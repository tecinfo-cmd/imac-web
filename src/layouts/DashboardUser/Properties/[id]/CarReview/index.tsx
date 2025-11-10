"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoArrowLeft } from "react-icons/go";
import { MdEngineering, MdOutlineEdit } from "react-icons/md";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  PiFarmLight,
} from "react-icons/pi";

import { Modal } from "../SelfInspection/components/Modal";
import { Input } from "@/components/Input";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";

import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { maskDate } from "@/utils/maskDate";

const mockDocuments = [
  { date: "06/06/2025", name: "car.pdf" },
  { date: "06/06/2025", name: "autorizacaodesupressao.pdf" },
  { date: "06/06/2025", name: "art.pdf" },
  { date: "06/06/2025", name: "laudocontestacao.pdf" },
];

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
  const { control, handleSubmit, reset } = useForm();

  const onSubmit = () => {
    setOpenModal(false);
    reset();
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
          {mockDocuments.map((doc, i) => (
            <Table.Row key={doc.name + i}>
              <Table.Cell>{doc.date}</Table.Cell>
              <Table.Cell>{doc.name}</Table.Cell>
              <Table.Cell>
                <Tooltip message="Editar documento" id={`edit-${i}`}>
                  <button
                    className="border-2 border-[#CAC4D0] p-1 rounded"
                    type="button"
                  >
                    <MdOutlineEdit size={20} color="#CAC4D0" />
                  </button>
                </Tooltip>
              </Table.Cell>
            </Table.Row>
          ))}
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
            <Input
              name="descricaoArquivo"
              label="Descrição do Arquivo"
              placeholder="Digite o título do arquivo"
              control={control}
            />
            <Input
              placeholder="arraste / selecione o arquivo aqui"
              name="file"
              label="Insira o Arquivo"
              control={control}
            />

            <Input
              name="dataUpload"
              label="Data de Upload"
              placeholder="00/00/0000"
              control={control}
              mask={maskDate}
            />
            <Button type="submit" variant="green" className="mt-4 w-40 mx-auto">
              Salvar
            </Button>
          </form>
        </Modal.Body>
      </Modal.Container>
    </LayoutContainer>
  );
};
