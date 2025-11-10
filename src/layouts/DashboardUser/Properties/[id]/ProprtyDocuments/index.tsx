"use client";

import { useParams, useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { MdEngineering } from "react-icons/md";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  PiFarmLight,
} from "react-icons/pi";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { DownloadIcon } from "@/icons/Download";
import { useUserRoleStore } from "@/store/useUserRoleStore";

const mockDocuments = [
  {
    section: "Documentos da propriedade",
    items: [
      { date: "06/06/2025", name: "matricula_fazendaValeSO1.pdf" },
      { date: "06/06/2025", name: "matricula_fazendaValeSO1.pdf" },
      { date: "06/06/2025", name: "procuracao.pdf" },
      { date: "06/06/2025", name: "cnh_proprietario1.pdf" },
      { date: "06/06/2025", name: "rg_proprietario2.pdf" },
    ],
  },
  {
    section: "Documentos fornecidos para analises da propriedade",
    items: [
      { date: "06/06/2025", name: "car.pdf" },
      { date: "06/06/2025", name: "autorizacaodesupressao.pdf" },
      { date: "06/06/2025", name: "art.pdf" },
      { date: "06/06/2025", name: "laudocontestacao.pdf" },
      { date: "06/06/2025", name: "estrategiadegerenegacao.pdf" },
    ],
  },
  {
    section: "Parecer e relatórios da propriedade",
    items: [
      { date: "06/06/2025", name: "car.pdf" },
      { date: "06/06/2025", name: "autorizacaodesupressao.pdf" },
      { date: "06/06/2025", name: "art.pdf" },
      { date: "06/06/2025", name: "laudocontestacao.pdf" },
      { date: "06/06/2025", name: "estrategiadegerenegacao.pdf" },
    ],
  },
  {
    section: "Revisão do Car e outros documentos",
    items: [
      { date: "06/06/2025", name: "car.pdf" },
      { date: "06/06/2025", name: "autorizacaodesupressao.pdf" },
      { date: "06/06/2025", name: "art.pdf" },
      { date: "06/06/2025", name: "laudocontestacao.pdf" },
    ],
  },
];

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

export default function PropertyDocumentsLayout({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  farmId,
  onGoBack,
}: PropertyDocumentsLayoutProps) {
  const params = useParams();
  const router = useRouter();
  const propriedadeId = params?.id as string;

  const { role } = useUserRoleStore();

  const menuItems = role === "ANALISTA" ? customMenuItems : undefined;
  const handleGoBack = () => {
    if (role === "PRODUTOR" && onGoBack) {
      onGoBack();
    } else if (role === "ANALISTA") {
      router.push(`/dashboard/properties/${propriedadeId}`);
    }
  };

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
      <h2 className="text-center text-2xl font-semibold mb-8 text-[#21801A]">
        Documentos da Propriedade
      </h2>
      {mockDocuments.map((section) => (
        <div key={section.section} className="mb-8">
          <Table.Container>
            <Table.Header>
              <Table.Title
                colspan={3}
                className="bg-[#21801A] text-white text-base"
              >
                {section.section}
              </Table.Title>
            </Table.Header>
            <Table.Header>
              <Table.Title>Data de upload</Table.Title>
              <Table.Title>Nome do arquivo</Table.Title>
              <Table.Title> </Table.Title>
            </Table.Header>
            <Table.Body>
              {section.items.map((doc, i) => (
                <Table.Row key={doc.name + i}>
                  <Table.Cell>{doc.date}</Table.Cell>
                  <Table.Cell>{doc.name}</Table.Cell>
                  <Table.Cell>
                    <Tooltip
                      message="Baixar documento"
                      id={`download-${section.section}-${i}`}
                    >
                      <button
                        type="button"
                        className="hover:bg-[#DFEEE5] p-2 rounded transition"
                      >
                        <DownloadIcon />
                      </button>
                    </Tooltip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Container>
        </div>
      ))}
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
    </LayoutContainer>
  );
}
