"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdEngineering } from "react-icons/md";
import { PiFarmLight, PiSealCheckLight, PiUser } from "react-icons/pi";

import { ConfirmBox } from "@/components/ConfirmBox";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useInvalidateProperties } from "@/hooks/useGetProperties/useInvalidateProperties";
import { useGetPropriedades } from "@/hooks/useGetProperties/userGetProperties";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { Monitor } from "@/icons/Monitor";
import { X } from "@/icons/X";
import { useAuthEmail } from "@/store/useAuthStore";

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
  const router = useRouter();
  const userEmail = useAuthEmail();
  const invalidatePropertyMutation = useInvalidateProperties();
  const getFirstAndLastName = (fullName: string) => {
    if (!fullName) return "-";
    const names = fullName.trim().split(" ");
    return names.length === 1
      ? names[0]
      : `${names[0]} ${names[names.length - 1]}`;
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

  const statusOptions = [
    { label: "Ativo", value: "ATIVO", color: "#21801A" },
    { label: "Inativo", value: "Inativa", color: "#F44336" },
    {
      label: "Voucher Crendenciamento pendente",
      value: "Voucher Crendenciamento pendente",
      color: "#F3BF45",
    },

    {
      label: "Cadastro incompleto",
      value: "Cadastro incompleto",
      color: "#F44336",
    },
    {
      label: "Cadastro completo",
      value: "Cadastro completo",
      color: "#21801A",
    },

    {
      label: "Análise solicitada",
      value: "Análise solicitada",
      color: "#F3BF45",
    },
    {
      label: "Análise disponível",
      value: "Análise disponível",
      color: "#21801A",
    },

    {
      label: "Contestação Solicitada",
      value: "Contestação Solicitada",
      color: "#F3BF45",
    },
    {
      label: "Contestação Pendente",
      value: "Contestação Pendente",
      color: "#F3BF45",
    },
    {
      label: "Contestação Analisada",
      value: "Contestação Analisada",
      color: "#21801A",
    },

    {
      label: "Estratégia Solicitada",
      value: "Estratégia Solicitada",
      color: "#F3BF45",
    },
    {
      label: "Estratégia Pendente",
      value: "Estratégia Pendente",
      color: "#F3BF45",
    },
    {
      label: "Estratégia Analisada",
      value: "Estratégia Analisada",
      color: "#21801A",
    },

    { label: "Plano Solicitado", value: "Plano Solicitado", color: "#F3BF45" },
    { label: "Plano Disponível", value: "Plano Disponível", color: "#21801A" },

    { label: "Termo Enviado", value: "Termo Enviado", color: "#F3BF45" },
    { label: "Termo Assinado", value: "Termo Assinado", color: "#21801A" },

    { label: "Multa disponível", value: "Multa disponível", color: "#21801A" },

    {
      label: "Autovistoria Disponível",
      value: "Autovistoria Disponível",
      color: "#F3BF45",
    },
    {
      label: "Autovistoria Realizado",
      value: "Autovistoria Realizado",
      color: "#21801A",
    },
    {
      label: "Autovistoria Não realizado",
      value: "Autovistoria Não realizado",
      color: "#F44336",
    },

    {
      label: "Autorização de Comercialização Vigente",
      value: "Autorização de Comercialização Vigente",
      color: "#21801A",
    },
    {
      label: "Autorização de Comercialização Expirada",
      value: "Autorização de Comercialização Expirada",
      color: "#F44336",
    },

    {
      label: "Voucher Frigorifico pendente",
      value: "Voucher Frigorifico pendente",
      color: "#F3BF45",
    },
    {
      label: "Ativado Frigorifico",
      value: "Ativado Frigorifico",
      color: "#21801A",
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
              <Table.Title>Analista</Table.Title>
              <Table.Title>Status</Table.Title>
              <Table.Title>Ações</Table.Title>
            </Table.Header>

            <Table.Body>
              {properties?.map((properties: any) => {
                const canEdit = properties.analista?.email === userEmail;
                return (
                  <Table.Row key={properties.id}>
                    <Table.Cell>{properties.nomePropriedade}</Table.Cell>
                    <Table.Cell>{properties.cidade?.nome || "-"}</Table.Cell>
                    <Table.Cell>{properties.carFederal}</Table.Cell>
                    <Table.Cell>
                      {getFirstAndLastName(properties.analista?.pessoa.nome) ||
                        "-"}
                    </Table.Cell>
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
                          message={
                            canEdit
                              ? "Visualizar ou editar dados"
                              : "Você não tem permissão para editar esta propriedade"
                          }
                          id={`view-${properties.id}`}
                        >
                          <button
                            className={`flex items-center justify-center p-1 rounded hover:bg-gray-100 ${
                              canEdit
                                ? "hover:bg-gray-100 cursor-pointer"
                                : "opacity-50 cursor-not-allowed"
                            }`}
                            onClick={() => {
                              if (canEdit) {
                                router.push(
                                  `/dashboard/properties/${properties.id}`
                                );
                              }
                            }}
                            disabled={!canEdit}
                          >
                            <Monitor />
                          </button>
                        </Tooltip>
                        <Tooltip
                          message="Inativar"
                          id={`delete-${properties.id}`}
                        >
                          <ConfirmBox
                            status={properties.status}
                            onConfirm={() =>
                              invalidatePropertyMutation.mutate(properties.id)
                            }
                            disabled={
                              !canEdit || invalidatePropertyMutation.isPending
                            }
                            className="p-1"
                            mode="simple"
                            icon={<X />}
                          />
                        </Tooltip>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
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
