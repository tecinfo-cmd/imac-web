"use client";

import { useState } from "react";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  PiFarmLight,
} from "react-icons/pi";

import { ElegibilityDetail } from "@/components/ElegibilityDetail";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useGetElegibilities } from "@/hooks/useGetElegibilities/useGetElegibilities";
import { Analityc } from "@/icons/Analityc";
import { Eye } from "@/icons/Eye";
import { Taxa } from "@/icons/Taxa";

import { FilterElegibility } from "./FilterElegibility";

export const ElegibilityLayout = () => {
  const [filters, setFilters] = useState({});
  const {
    data: elegibilities,
    isLoading,
    error,
  } = useGetElegibilities(filters);

  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = (car: string) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };
  const customMenuItems = [
    {
      label: "Home",
      href: "/dashboardUser",
      icon: <Analityc />,
    },
    {
      label: "Usuários",
      href: "/dashboardUser/users",
      icon: <PiUserCircleThin size={44} />,
    },
    {
      label: "Elegibilidade",
      href: "/dashboardUser/elegibility",
      icon: <PiSealCheckLight size={44} />,
    },
    {
      label: "Propriedades",
      href: "/dashboardUser/properties",
      icon: <PiFarmLight size={44} />,
    },
    {
      label: "Multas",
      href: "/multas",
      icon: <Taxa className="text-current" />,
    },
  ];

  return (
    <LayoutContainer
      title="Solicitação de Elegibilidade"
      menuItems={customMenuItems}
    >
      <FilterElegibility onFilter={setFilters} />
      <span>Total de solicitações: {elegibilities?.length || 0}</span>

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
        <Table.Container>
          <Table.Header>
            <Table.Title>Nome da Propriedade </Table.Title>
            <Table.Title>Telefone</Table.Title>
            <Table.Title>Email</Table.Title>
            <Table.Title>CAR Federal</Table.Title>
            <Table.Title>Status</Table.Title>
            <Table.Title>Ações</Table.Title>
          </Table.Header>

          <Table.Body>
            {elegibilities?.map((elegibilities: any) => (
              <Table.Row key={elegibilities.id}>
                <Table.Cell>{elegibilities.nomePropriedade}</Table.Cell>
                <Table.Cell>{elegibilities.telefone}</Table.Cell>
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
                      <button
                        onClick={() =>
                          handleViewClick(elegibilities.carFederal)
                        }
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
      )}

      <ElegibilityDetail
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onClose={() => setIsModalOpen(false)}
        car={selectedCar}
      />
    </LayoutContainer>
  );
};
