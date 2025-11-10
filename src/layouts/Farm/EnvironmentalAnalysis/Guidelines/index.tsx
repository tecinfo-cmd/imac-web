/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { FilterGuidelines } from "./FiltersGuidelines";

type Guideline = {
  id: number;
  titulo: string;
  data: string;
  descricao: string;
  tipo: "PDF" | "VIDEO";
  imagem?: string;
};

const mockGuidelines: Guideline[] = [
  {
    id: 1,
    titulo: "Protocolo PREM",
    data: "10/10/2025",
    descricao: "Protocolo de Cadastro no programa PREM",
    tipo: "PDF",
  },
  {
    id: 2,
    titulo: "Protocolo PREM",
    data: "10/10/2025",
    descricao: "Protocolo de Cadastro no programa PREM",
    tipo: "PDF",
  },
  {
    id: 3,
    titulo: "Protocolo PREM",
    data: "10/10/2025",
    descricao: "Protocolo de Cadastro no programa PREM",
    tipo: "PDF",
  },
  {
    id: 4,
    titulo: "Protocolo PREM",
    data: "10/10/2025",
    descricao: "Protocolo de Cadastro no programa PREM",
    tipo: "PDF",
  },
  {
    id: 5,
    titulo: "Protocolo PREM",
    data: "10/10/2025",
    descricao: "Protocolo de Cadastro no programa PREM",
    tipo: "PDF",
  },
  {
    id: 6,
    titulo: "Vídeo App Campo",
    data: "10/10/2025",
    descricao: "Veja o passo a passo para utilizar o app autodeclaração PREM",
    tipo: "VIDEO",
  },
  {
    id: 7,
    titulo: "Vídeo App Campo",
    data: "10/10/2025",
    descricao: "Veja o passo a passo para utilizar o app autodeclaração PREM",
    tipo: "VIDEO",
  },
  {
    id: 8,
    titulo: "Vídeo App Campo",
    data: "10/10/2025",
    descricao: "Veja o passo a passo para utilizar o app autodeclaração PREM",
    tipo: "VIDEO",
  },
];
interface GuidelinesProps {
  farmId?: number;
  onGoBack?: () => void;
}

interface FilterProps {
  nome?: string;
  tipo?: "PDF" | "VIDEO" | "" | undefined;
  date?: string;
}

const GuidelinesContent = () => {
  const userRole = "PRODUTOR";
  const [guidelines, setGuidelines] = useState<Guideline[]>(mockGuidelines);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterProps>({}); // Tipagem correta para filtros

  const pageSize = 8;

  useEffect(() => {
    // Exemplo:
    // fetch('/api/guidelines')
    //   .then(res => res.json())
    //   .then(data => setGuidelines(data))
  }, []);

  const getFilteredGuidelines = () => {
    let filtered = guidelines;

    if (filters.nome) {
      filtered = filtered.filter((item) =>
        item.titulo.toLowerCase().includes(filters.nome!.toLowerCase())
      );
    }

    if (filters.tipo === "PDF" || filters.tipo === "VIDEO") {
      filtered = filtered.filter((item) => item.tipo === filters.tipo);
    }

    if (filters.date) {
      filtered = filtered.filter((item) => item.data === filters.date);
    }

    return filtered;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const filteredGuidelines = getFilteredGuidelines();

  const startIndex = (currentPage - 1) * pageSize;
  const currentGuidelines = filteredGuidelines.slice(
    startIndex,
    startIndex + pageSize
  );

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {currentGuidelines.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden shadow-sm border border-gray-200 rounded-lg"
          >
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              <Image
                src="/placeholder-image.png"
                alt={item.titulo}
                width={120}
                height={120}
                className="opacity-60"
              />
            </div>

            <div className="p-4">
              <h3 className="text-[#0A3503] font-semibold text-base mb-1">
                {item.titulo}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{item.data}</p>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                {item.descricao}
              </p>

              <div className="w-full">
                {item.tipo === "PDF" ? (
                  <Button
                    variant="green"
                    className="w-full rounded-full py-2 text-sm font-medium"
                  >
                    Baixar
                  </Button>
                ) : (
                  <Button
                    variant="dark"
                    className="w-full rounded-full py-2 text-sm font-medium"
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
        totalItems={filteredGuidelines.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export const Guidelines = () => {
  const userRole = "PRODUTOR";

  if (userRole === "PRODUTOR") {
    return <GuidelinesContent />;
  }

  return (
    <LayoutContainer title="Acompanhamento da Propriedade">
      <h2 className="text-center text-2xl font-semibold mb-8 text-[#21801A]">
        Roteiros Orientativos
      </h2>
      <GuidelinesContent />
    </LayoutContainer>
  );
};
