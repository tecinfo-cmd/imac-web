"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TbFileOrientation } from "react-icons/tb";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useGuidelines } from "@/hooks/useGuidelines/useGuidelines";
import { useUserRoleStore } from "@/store/useUserRoleStore";

import { FilterGuidelines } from "./FiltersGuidelines";

const menuItems = [
  {
    label: "Roteiros Orientativos",
    href: "/dashboard",
    icon: <TbFileOrientation size={44} />,
  },
];

type Guideline = {
  id: number;
  titulo: string;
  data: string;
  descricao: string;
  tipo: "pdf" | "video";
  urlArquivo: string;
  nomeArquivoOriginal: string;
  urlCapaArquivo?: string;
  dataCriacao: string;
  ativo: boolean;
};

interface FilterProps {
  farmId?: number;
  onGoBack?: () => void;
}

interface FilterProps {
  nome?: string;
  tipo?: "pdf" | "video" | "" | undefined;
  date?: string;
}

const GuidelinesContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterProps>({});
  const { role } = useUserRoleStore();
  const [editingGuideline, setEditingGuideline] = useState<Guideline | null>(
    null
  );

  const pageSize = 10;
  const isAdmin = role === "ADMINISTRATIVO";

  const {
    data: guidelinesData,
    isLoading,
    error,
  } = useGuidelines({
    ...filters,
    page: currentPage,
    size: pageSize,
  });

  const guidelines = guidelinesData?.data ?? [];
  const totalItems = guidelinesData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditGuideline = (guideline: Guideline) => {
    setEditingGuideline(guideline);
  };

  const handleDownloadPDF = (item: Guideline) => {
    if (item.urlArquivo && item.nomeArquivoOriginal) {
      const link = document.createElement("a");
      link.href = item.urlArquivo;
      link.download = item.nomeArquivoOriginal;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleWatchVideo = (item: Guideline) => {
    if (item.urlArquivo) {
      window.open(item.urlArquivo, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">
          Carregando roteiros orientativos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Erro ao carregar os roteiros orientativos
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-center text-2xl font-semibold mb-8 text-[#21801A]">
        Roteiros Orientativos
      </h2>
      <FilterGuidelines
        onFilter={(f) => {
          setFilters(f);
          setCurrentPage(1);
        }}
        editingGuideline={editingGuideline}
        onCloseEdit={() => setEditingGuideline(null)}
      />

      {guidelines.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">
            Nenhum roteiro orientativo encontrado
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {guidelines.map((item: Guideline) => (
              <Card
                key={item.id}
                className="overflow-hidden shadow-sm border border-gray-200 rounded-lg"
              >
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  {item.urlCapaArquivo ? (
                    <Image
                      src={item.urlCapaArquivo}
                      alt={item.titulo}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.png";
                      }}
                    />
                  ) : (
                    <Image
                      src="/placeholder-image.png"
                      alt={item.titulo}
                      width={120}
                      height={120}
                      className="opacity-60"
                    />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-[#0A3503] font-semibold text-base mb-1">
                    {item.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {new Date(item.dataCriacao).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    {item.descricao}
                  </p>

                  <div className="w-full">
                    {isAdmin ? (
                      <Button
                        variant="green"
                        className="w-full rounded-full py-2 text-sm font-medium "
                        onClick={() => handleEditGuideline(item)}
                      >
                        Editar
                      </Button>
                    ) : item.tipo === "pdf" ? (
                      <Button
                        variant="green"
                        className="w-full rounded-full py-2 text-sm font-medium"
                        onClick={() => handleDownloadPDF(item)}
                      >
                        Baixar
                      </Button>
                    ) : (
                      <Button
                        variant="dark"
                        className="w-full rounded-full py-2 text-sm font-medium"
                        onClick={() => handleWatchVideo(item)}
                      >
                        Assistir
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
};

export const Guidelines = () => {
  const { role } = useUserRoleStore();
  const isAdmin = role === "ADMINISTRATIVO";

  if (isAdmin) {
    return (
      <LayoutContainer
        title="Acompanhamento da Propriedade"
        menuItems={menuItems}
      >
        <GuidelinesContent />
      </LayoutContainer>
    );
  }

  return <GuidelinesContent />;
};
