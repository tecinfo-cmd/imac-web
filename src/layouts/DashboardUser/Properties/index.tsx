"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PiFarmLight, PiSealCheckLight, PiUser } from "react-icons/pi";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useGetPropriedades } from "@/hooks/useGetProperties/userGetProperties";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { Monitor } from "@/icons/Monitor";
import { X } from "@/icons/X";

import { FilterProperties } from "./FilterProperties";

export const PropertiesLayout = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filters, setFilters] = useState({});

  const { data, isLoading } = useGetPropriedades({
    ...filters,
    page,
    size: limit,
  });

  const properties = data?.data ?? [];
  const totalItems = data?.total ?? 0;
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
      href: "/dashboard/abattoir-industry",
      icon: <Abattoir size={44} />,
    },
  ];

  const statusOptions = [
    { label: "Ativo", value: "ATIVO", color: "#21801A" },
    { label: "Inativo", value: "INATIVO", color: "#F44336" },
    {
      label: "Voucher Adquirido",
      value: "VOUCHER_ADQUIRIDO",
      color: "#21801A",
    },
    {
      label: "Análise Solicitada",
      value: "ANALISE_SOLICITADA",
      color: "#F3BF45",
    },
    { label: "Desistiu do PREM", value: "DESISTIU_PREM", color: "#F44336" },
    {
      label: "Análise Socioambiental Solicitada",
      value: "ANALISE_SOCIOAMBIENTAL_SOLICITADA",
      color: "#F3BF45",
    },
    {
      label: "Contestação Solicitada",
      value: "CONTESTACAO_SOLICITADA",
      color: "#F3BF45",
    },
    {
      label: "Contestação Pendente",
      value: "CONTESTACAO_PENDENTE",
      color: "#F44336",
    },
    {
      label: "Contestação Analisada",
      value: "CONTESTACAO_ANALISADA",
      color: "#21801A",
    },
    {
      label: "Estratégia de Adequação Solicitado",
      value: "ESTRATEGIA_ADEQUACAO_SOLICITADO",
      color: "#F3BF45",
    },
    {
      label: "Estratégia de Adequação Pendente",
      value: "ESTRATEGIA_ADEQUACAO_PENDENTE",
      color: "#F44336",
    },
    {
      label: "Estratégia de Adequação Analisada",
      value: "ESTRATEGIA_ADEQUACAO_ANALISADA",
      color: "#21801A",
    },
    {
      label: "Plano de Adequação Solicitado",
      value: "PLANO_ADEQUACAO_SOLICITADO",
      color: "#F3BF45",
    },
    {
      label: "Plano de Adequação Aceito",
      value: "PLANO_ADEQUACAO_ACEITO",
      color: "#21801A",
    },
    {
      label: "Termo de Adequação Assinado",
      value: "TERMO_ADEQUACAO_ASSINADO",
      color: "#21801A",
    },
    {
      label: "Valores da multa aceitado",
      value: "VALORES_MULTA_ACEITO",
      color: "#21801A",
    },
    {
      label: "Autovistoria Realizada",
      value: "AUTOVISTORIA_REALIZADA",
      color: "#21801A",
    },
    {
      label: "Autovistoria Não Realizada",
      value: "AUTOVISTORIA_NAO_REALIZADA",
      color: "#F44336",
    },
    {
      label: "Autorização de Comercialização Ativo (AC Ativa)",
      value: "AC_ATIVA",
      color: "#21801A",
    },
    {
      label: "Autorização de Comercialização Bloqueado (AC Bloqueada)",
      value: "AC_BLOQUEADA",
      color: "#F44336",
    },
  ];

  return (
    <LayoutContainer title="Propriedades" menuItems={customMenuItems}>
      <FilterProperties
        onFilter={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />
      <span>Total de propriedades: {totalItems || 0}</span>

      {isLoading ? (
        <p>Carregando usuários...</p>
      ) : (
        <>
          <Table.Container>
            <Table.Header>
              <Table.Title>Nome da Propriedade </Table.Title>
              <Table.Title>Município</Table.Title>
              <Table.Title>CAR Federal</Table.Title>
              <Table.Title>Status</Table.Title>
              <Table.Title>Ações</Table.Title>
            </Table.Header>

            <Table.Body>
              {properties?.map((properties: any) => (
                <Table.Row key={properties.id}>
                  <Table.Cell>{properties.nomePropriedade}</Table.Cell>
                  <Table.Cell>{properties.cidade?.nome || "-"}</Table.Cell>
                  <Table.Cell>{properties.carFederal}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const statusObj = statusOptions.find(
                          (opt) => opt.value === properties.status
                        );
                        return (
                          <>
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: statusObj?.color,
                              }}
                            />
                            <span style={{ color: statusObj?.color }}>
                              {statusObj?.label || properties.status}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-center items-center gap-2">
                      <Tooltip
                        message="Visualizar ou editar dados"
                        id={`view-${properties.id}`}
                      >
                        <button
                          className="flex items-center justify-center p-1 rounded hover:bg-gray-100"
                          onClick={() =>
                            router.push(
                              `/dashboard/properties/${properties.id}`
                            )
                          }
                        >
                          <Monitor />
                        </button>
                      </Tooltip>
                      <Tooltip
                        message="Inativar propriedade"
                        id={`delete-${properties.id}`}
                      >
                        <X />
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
