"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TbFileOrientation } from "react-icons/tb";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useGuidelines } from "@/hooks/useGuidelines/useGuidelines";
import { useUpdateGuideline } from "@/hooks/useGuidelines/useGuidelines";
import { useUserRoleStore } from "@/store/useUserRoleStore";
import { toast } from "sonner";

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
  const [confirmInactiveId, setConfirmInactiveId] = useState<number | null>(
    null
  );
  const updateGuidelineMutation = useUpdateGuideline();

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


  const handleConfirmInactive = async () => {
    if (confirmInactiveId) {
      const guideline = guidelines.find(
        (g: Guideline) => g.id === confirmInactiveId
      );
      if (!guideline) {
        setConfirmInactiveId(null);
        return;
      }
      if (!guideline.ativo) {
        toast.warning("Documento já está inativo");
        setConfirmInactiveId(null);
        return;
      }
      try {
        await updateGuidelineMutation.mutateAsync({
          id: String(confirmInactiveId),
          ativo: false,
        });
        toast.success("Documento inativado com sucesso");
      } catch {
        toast.error("Erro ao inativar documento");
      }
      setConfirmInactiveId(null);
    }
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
                      confirmInactiveId === item.id ? (
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-white border border-gray-300 rounded shadow-lg p-4 text-center z-50">
                          <p className="text-[#21801A] mb-4">
                            Tem certeza que deseja inativar?
                          </p>
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={handleConfirmInactive}
                              className="bg-[#21801A] hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                              Sim
                            </button>
                            <button
                              onClick={() => setConfirmInactiveId(null)}
                              className="bg-[#F44336] hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="green"
                          className="w-full rounded-full py-2 text-sm font-medium "
                          onClick={() => setConfirmInactiveId(item.id)}
                        >
                          Inativar
                        </Button>
                      )
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
