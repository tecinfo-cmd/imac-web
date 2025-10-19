"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PiSealCheckLight } from "react-icons/pi";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useTrackProducers } from "@/hooks/useTrackProducers/useTrackProducers";
import { Eye } from "@/icons/Eye";
import { RuralProperty } from "@/icons/RuralProperty";
import { maskCPFOrCNPJ } from "@/utils/maskCPFOrCNPJ";

import { FilterTrackProducers } from "./FiltersTrackProducers";

export const TrackProducersLayout = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filters, setFilters] = useState({});
  const router = useRouter();

  const { data, isLoading, error } = useTrackProducers(filters, page);

  const vouchers = data?.data ?? [];
  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const customMenuItems = [
    {
      label: "Elegibilidade",
      href: "/dashboard",
      icon: <PiSealCheckLight size={44} />,
    },
    {
      label: "Acompanhamento de Produtores",
      href: "/dashboard/elegibilityAbattoir/trackProducers",
      icon: <RuralProperty size={44} />,
    },
  ];

  return (
    <LayoutContainer
      title="Acompanhamento de Produtores"
      menuItems={customMenuItems}
    >
      <FilterTrackProducers
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

      {!isLoading && !error && vouchers && vouchers.length === 0 && (
        <p className="text-gray-600 mt-4">
          Nenhuma solicitação encontrada com os filtros aplicados.
        </p>
      )}

      {!isLoading && !error && vouchers && vouchers.length > 0 && (
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
              {vouchers?.map((voucher: any) => (
                <Table.Row key={voucher.id}>
                  <Table.Cell>{voucher.propriedade.nomePropriedade}</Table.Cell>
                  <Table.Cell>
                    {voucher.propriedade.proprietarios?.[0]?.pessoa?.cpfCnpj ? maskCPFOrCNPJ(voucher.propriedade.proprietarios[0].pessoa.cpfCnpj) : "-"}
                  </Table.Cell>
                  <Table.Cell>{voucher.propriedade.proprietarios?.[0]?.pessoa?.email}</Table.Cell>
                  <Table.Cell>{voucher.propriedade.carFederal}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            voucher.status === "ATIVO"
                              ? "#21801A"
                              : voucher.status === "INATIVO"
                              ? "#F44336"
                              : "#F3BF45",
                        }}
                      />
                      <span
                        style={{
                          color:
                            voucher.status === "ATIVO"
                              ? "#21801A"
                              : voucher.status === "INATIVO"
                              ? "#F44336"
                              : "#F3BF45",
                        }}
                      >
                        {voucher.status === "ATIVO"
                          ? "Ativado"
                          : voucher.status === "INATIVO"
                          ? "Inativo"
                          : "Pendente"}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Tooltip message="Visualizar" id={`view-${voucher.id}`}>
                        <button
                          onClick={() => {
                            router.push(
                              `/getDcsStatus?carFederal=${encodeURIComponent(
                                voucher.propriedade.carFederal ?? ""
                              )}&idPropriedade=${encodeURIComponent(
                                voucher.idPropriedade ?? ""
                              )}`
                            );
                          }}
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
    </LayoutContainer>
  );
};
