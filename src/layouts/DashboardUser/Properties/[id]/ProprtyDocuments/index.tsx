"use client";

import { useParams, useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { MdEngineering } from "react-icons/md";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  PiFarmLight,
} from "react-icons/pi";
import { TbDownload } from "react-icons/tb";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { usePropertySummary } from "@/hooks/useGetProperties/usePropertySummary";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { useUserRoleStore } from "@/store/useUserRoleStore";

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
  const {
    data: propertySummary,
    isLoading: isLoadingSummary,
    error: errorSummary,
  } = usePropertySummary();
  const {
    data: farmData,
    isLoading: isLoadingFarm,
    error: errorFarm,
  } = useGetFarmById(farmId || 0);

  const menuItems = role === "ANALISTA" ? customMenuItems : undefined;
  const handleGoBack = () => {
    if (role === "PRODUTOR" && onGoBack) {
      onGoBack();
    } else if (role === "ANALISTA") {
      router.push(`/dashboard/properties/${propriedadeId}`);
    }
  };

  const isFromFarm = !!farmId;
  const isLoading = isFromFarm ? isLoadingFarm : isLoadingSummary;
  const error = isFromFarm ? errorFarm : errorSummary;

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

  const documents = isFromFarm
    ? (farmData?.documentos || []).map((doc: any) => ({
        id: doc.id,
        dataUpload: doc.dataUpload,
        nomeArquivoOriginal: doc.nomeArquivoOriginal || doc.nomeArquivo,
        tipo: doc.tipo,
        urlArquivo: doc.urlArquivo,
      }))
    : propertySummary?.documentos || [];

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
      <h2 className="text-center text-2xl font-semibold mb-8 text-[#21801A]">
        Documentos da Propriedade
      </h2>
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
              <Table.Title>Tipo</Table.Title>
              <Table.Title> </Table.Title>
            </Table.Header>
            <Table.Body>
              {documents.map((doc, i) => (
                <Table.Row key={doc.id || `${doc.nomeArquivoOriginal}-${i}`}>
                  <Table.Cell>{formatDate(doc.dataUpload)}</Table.Cell>
                  <Table.Cell>
                    {doc.nomeArquivoOriginal || "Documento sem nome"}
                  </Table.Cell>
                  <Table.Cell>{doc.tipo || "N/A"}</Table.Cell>
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
    </LayoutContainer>
  );
}
