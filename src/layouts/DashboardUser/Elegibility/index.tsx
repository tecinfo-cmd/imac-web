"use client";

import { useState } from "react";
import { PiSealCheckLight, PiUser, PiFarmLight } from "react-icons/pi";

import { ElegibilityDetail } from "@/components/ElegibilityDetail";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useGetElegibilities } from "@/hooks/useGetElegibilities/useGetElegibilities";
import { Analityc } from "@/icons/Analityc";
import { Eye } from "@/icons/Eye";
import { maskCPFOrCNPJ } from "@/utils/maskCPFOrCNPJ";

import { FilterElegibility } from "./FilterElegibility";

export const ElegibilityLayout = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useGetElegibilities({
    ...filters,
    page,
    size: limit,
  });

  const elegibilities = data?.data ?? [];
  const totalItems = data?.total ?? 0;

  const [selectedData, setSelectedData] = useState<{
    id: number;
    cpfCnpj: string;
    carFederal: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = (data: any) => {
    setSelectedData({
      id: data.id,
      cpfCnpj: data.cpfCnpj,
      carFederal: data.carFederal,
    });
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
  ];

  return (
    <LayoutContainer
      title="Acompanhamento de Elegibilidade"
      menuItems={customMenuItems}
    >
      <FilterElegibility onFilter={setFilters} />
      <span>Total de solicitações: {totalItems || 0}</span>

      {isLoading && <p>Carregando solicitações...</p>}

      {error && (
        <p className="text-red-600 mt-4">
          Erro ao carregar solicitações. Por favor, tente novamente.
        </p>
      )}

      {!isLoading && !error && elegibilities && elegibilities.length === 0 && (
        <p className="text-gray-600 mt-4">
          Nenhuma solicitação encontrada com os filtros aplicados.
        </p>
      )}

      {!isLoading && !error && elegibilities && elegibilities.length > 0 && (
        <>
          <Table.Container>
            <Table.Header>
              <Table.Title>Nome da Propriedade </Table.Title>
              <Table.Title>CPF/CNPJ</Table.Title>
              <Table.Title>Email</Table.Title>
              <Table.Title>CAR Federal</Table.Title>
              <Table.Title>Status</Table.Title>
              <Table.Title>Ações</Table.Title>
            </Table.Header>

            <Table.Body>
              {elegibilities?.map((elegibilities: any) => (
                <Table.Row key={elegibilities.id}>
                  <Table.Cell>{elegibilities.nomePropriedade}</Table.Cell>
                  <Table.Cell>
                    {elegibilities.cpfCnpj
                      ? maskCPFOrCNPJ(elegibilities.cpfCnpj)
                      : "-"}
                  </Table.Cell>
                  <Table.Cell>{elegibilities.email}</Table.Cell>
                  <Table.Cell>{elegibilities.carFederal}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            elegibilities.status === "APROVADO"
                              ? "#21801A"
                              : elegibilities.status === "REPROVADO"
                              ? "#F44336"
                              : "#F3BF45",
                        }}
                      />
                      <span
                        style={{
                          color:
                            elegibilities.status === "APROVADO"
                              ? "#21801A"
                              : elegibilities.status === "REPROVADO"
                              ? "#F44336"
                              : "#F3BF45",
                        }}
                      >
                        {elegibilities.status === "APROVADO"
                          ? "Aprovado"
                          : elegibilities.status === "REPROVADO"
                          ? "Reprovado"
                          : "Pendente"}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Tooltip
                        message="Visualizar"
                        id={`view-${elegibilities.id}`}
                      >
                        <button onClick={() => handleViewClick(elegibilities)}>
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

      <ElegibilityDetail
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={selectedData?.id || null}
        cpfCnpj={selectedData?.cpfCnpj}
        carFederal={selectedData?.carFederal}
      />
    </LayoutContainer>
  );
};
