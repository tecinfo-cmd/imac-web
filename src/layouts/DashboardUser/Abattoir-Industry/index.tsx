"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PiFarmLight, PiSealCheckLight, PiUser } from "react-icons/pi";

import { ConfirmBox } from "@/components/ConfirmBox";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import {
  useAbattoir,
  useInvalidateAbattoir,
} from "@/hooks/useAbattoir/useAbattoir";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { Eye } from "@/icons/Eye";

import { FilterAbattoir } from "./FilterAbattoir";

type AbattoirFilters = {
  nome?: string;
  cnpj?: string;
  status?: string;
};

export const AbattoirLayout = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filters, setFilters] = useState<AbattoirFilters>({});
  const { data, isLoading, error } = useAbattoir(filters, page);
  const invalidateAbattoir = useInvalidateAbattoir();

  const abattoir = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const router = useRouter();

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

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
      href: "dashboard/abattoir-industry",
      icon: <Abattoir size={44} />,
    },
  ];

  return (
    <LayoutContainer
      title="Frigorifico / Industria"
      menuItems={customMenuItems}
    >
      <FilterAbattoir
        onFilter={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />
      <span>Total de frigorificos: {totalItems || 0}</span>

      {isLoading && (
        <p className="text-gray-600 mt-4">Carregando frigoríficos...</p>
      )}

      {error && (
        <p className="text-red-500 mt-4">Erro ao carregar frigoríficos.</p>
      )}

      {!isLoading && abattoir.length === 0 && (
        <p className="text-gray-600 mt-4">
          Nenhum frigorifico encontrado com os filtros aplicados.
        </p>
      )}

      {!isLoading && abattoir.length > 0 && (
        <>
          <Table.Container>
            <Table.Header>
              <Table.Title>Nome</Table.Title>
              <Table.Title>Telefone</Table.Title>
              <Table.Title>CNPJ</Table.Title>
              <Table.Title>Status</Table.Title>
              <Table.Title>Ações</Table.Title>
            </Table.Header>

            <Table.Body>
              {abattoir.map((abattoir: any) => (
                <Table.Row key={abattoir.id}>
                  <Table.Cell>{abattoir.nomeFantasia}</Table.Cell>
                  <Table.Cell>{abattoir.telefone}</Table.Cell>
                  <Table.Cell>{abattoir.cnpj}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            abattoir.status === "INATIVO"
                              ? "#F44336"
                              : "#21801A",
                        }}
                      />
                      <span
                        style={{
                          color:
                            abattoir.status === "INATIVO"
                              ? "#F44336"
                              : "#21801A",
                        }}
                      >
                        {abattoir.status === "ATIVO" || abattoir.status === null
                          ? "Ativo"
                          : "Inativo"}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Tooltip message="Visualizar" id={`view-${abattoir.id}`}>
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/abattoir-industry/${abattoir.id}`
                            )
                          }
                        >
                          <Eye />
                        </button>
                      </Tooltip>
                      <Tooltip message="Inativar" id={`delete-${abattoir.id}`}>
                        <ConfirmBox
                          onConfirm={() =>
                            invalidateAbattoir.mutate(abattoir.id)
                          }
                          status={abattoir.status}
                        />
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
    </LayoutContainer>
  );
};
