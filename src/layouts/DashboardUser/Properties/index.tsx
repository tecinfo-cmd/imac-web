"use client";

import { useState } from "react";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  PiFarmLight,
} from "react-icons/pi";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useGetPropriedades } from "@/hooks/useGetProperties/userGetProperties";
import { Analityc } from "@/icons/Analityc";
import { Monitor } from "@/icons/Monitor";
import { Taxa } from "@/icons/Taxa";
import { X } from "@/icons/X";

import { FilterProperties } from "./FilterProperties";

export const PropertiesLayout = () => {
  const [filters, setFilters] = useState({});
  const { data: properties = [], isLoading } = useGetPropriedades(filters);

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
      icon: <Taxa className="currentcolor" />,
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
      <FilterProperties onFilter={setFilters} />
      <span>Total de propriedades: {properties?.length || 0}</span>

      {isLoading ? (
        <p>Carregando usuários...</p>
      ) : (
        <Table.Container>
          <Table.Header>
            <Table.Title>Nome da Propriedade </Table.Title>
            <Table.Title>Produtor</Table.Title>
            <Table.Title>CAR Federal</Table.Title>
            <Table.Title>Status</Table.Title>
            <Table.Title>Ações</Table.Title>
          </Table.Header>

          <Table.Body>
            {properties?.map((properties: any) => (
              <Table.Row key={properties.id}>
                <Table.Cell>{properties.nomePropriedade}</Table.Cell>
                <Table.Cell>{properties.telefone}</Table.Cell>
                <Table.Cell>{properties.email}</Table.Cell>
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
                  <div className="flex items-center gap-2">
                    <Tooltip
                      message="Visualizar ou editar dados"
                      id={`view-${properties.id}`}
                    >
                      <Monitor />
                    </Tooltip>
                    <Tooltip
                      message="Inativar propriedade"
                      id={`view-${properties.id}`}
                    >
                      <X />
                    </Tooltip>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Container>
      )}
    </LayoutContainer>
  );
};
