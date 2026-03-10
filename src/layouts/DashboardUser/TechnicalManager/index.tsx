"use client";

import { useState } from "react";
import { MdEngineering } from "react-icons/md";
import { PiSealCheckLight, PiUser, PiFarmLight } from "react-icons/pi";

import { TechnicalDetail } from "./components/TechnicalManeger";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useTechnicalManager } from "@/hooks/useTechnicalManager/useTechnicalManeger";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { Eye } from "@/icons/Eye";

import { FilterTechnicalManager } from "./FilterTechnicalMeneger";
export const TechnicalManagerLayout = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useTechnicalManager({
    ...filters,
    page,
    size: limit,
  });

  const technicalManagers = data?.data ?? [];
  const totalItems = data?.total ?? 0;

  

  const [selectedData, setSelectedData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = (data: any) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  const customMenuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Analityc />,
    },
    {
      label: "Usuários",
      href: "/dashboard/users",
      icon: <PiUser size={44} />,
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
    /*{
      label: "Multas",
      href: "/dashboard/multas",
      icon: <Taxa className="text-current" />,
    },
    */
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

  return (
    <LayoutContainer
      title="Acompanhamento de Responsável Técnico"
      menuItems={customMenuItems}
    >
      <FilterTechnicalManager
        onFilter={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />
      <span>Total de solicitações: {totalItems || 0}</span>

      {isLoading && <p>Carregando solicitações...</p>}

      {error && (
        <p className="text-red-600 mt-4">
          Erro ao carregar solicitações. Por favor, tente novamente.
        </p>
      )}

      {!isLoading &&
        !error &&
        technicalManagers &&
        technicalManagers.length === 0 && (
          <p className="text-gray-600 mt-4">
            Nenhuma solicitação encontrada com os filtros aplicados.
          </p>
        )}

      {!isLoading &&
        !error &&
        technicalManagers &&
        technicalManagers.length > 0 && (
          <>
            <Table.Container>
              <Table.Header>
                <Table.Title>Nome </Table.Title>
                <Table.Title>Email</Table.Title>
                <Table.Title>Profissão</Table.Title>
                <Table.Title>Ações</Table.Title>
              </Table.Header>

              <Table.Body>
                {technicalManagers?.map((technicalManager: any) => (
                  <Table.Row key={technicalManager.id}>
                    <Table.Cell>{technicalManager.nome}</Table.Cell>
                    <Table.Cell>{technicalManager.email}</Table.Cell>
                    <Table.Cell>
                      {technicalManager.profissao.toLowerCase()}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <Tooltip
                          message="Visualizar"
                          id={`view-${technicalManager.id}`}
                        >
                          <button
                            onClick={() => handleViewClick(technicalManager)}
                          >
                            <Eye />
                          </button>
                        </Tooltip>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Container>
            <Pagination
              totalItems={totalItems}
              pageSize={limit}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}

      <TechnicalDetail
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
      />
    </LayoutContainer>
  );
};
