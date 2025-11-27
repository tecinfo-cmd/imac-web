"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LiaRandomSolid } from "react-icons/lia";
import { PiUser } from "react-icons/pi";
import { TbFileOrientation } from "react-icons/tb";

import { ConfirmBox } from "@/components/ConfirmBox";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useActivateUser } from "@/hooks/useGetUsers/useActiveUser";
import { useDeleteUser } from "@/hooks/useGetUsers/useDeleteUser";
import { useGetUsers } from "@/hooks/useGetUsers/useGetUsers";
import { Analityc } from "@/icons/Analityc";
import { Eye } from "@/icons/Eye";
import { useUserRoleStore } from "@/store/useUserRoleStore";

import { FilterUsersManeger } from "./FilterUsers";

export const UsersManegerLayout = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filters, setFilters] = useState({});
  const { role } = useUserRoleStore();
  const { data, isLoading, error } = useGetUsers({
    ...filters,
    page,
    size: limit,
  });
  const users = data?.data ?? [];
  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const router = useRouter();

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const deleteUserMutation = useDeleteUser();
  const activateUserMutation = useActivateUser();

  const customMenuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Analityc />,
    },
    {
      label: "Usuários",
      href: "/dashboard/maneger/users-maneger",
      icon: <PiUser size={44} />,
    },
    {
      label: "Roteiros Orientativos",
      href: "/dashboard/maneger/guidelines",
      icon: <TbFileOrientation size={44} />,
    },
  ];

  return (
    <LayoutContainer title="Usuarios" menuItems={customMenuItems}>
      <FilterUsersManeger
        onFilter={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />
      <span>Total de usuários: {totalItems || 0}</span>

      {isLoading && <p>Carregando usuários...</p>}

      {error && (
        <p className="text-red-600 mt-4">
          Erro ao carregar usuários. Por favor, tente novamente.
        </p>
      )}

      {!isLoading && !error && users && users.length === 0 && (
        <p className="text-gray-600 mt-4">
          Nenhum usuário encontrado com os filtros aplicados.
        </p>
      )}

      {!isLoading && !error && users && users.length > 0 && (
        <>
          <Table.Container>
            <Table.Header>
              <Table.Title>Nome</Table.Title>
              <Table.Title>Email</Table.Title>
              <Table.Title>Perfil</Table.Title>
              <Table.Title>Nº de Propriedades</Table.Title>
              <Table.Title>Status</Table.Title>
              <Table.Title>Ações</Table.Title>
            </Table.Header>

            <Table.Body>
              {users.map((user: any) => {
                const isAdmin = role === "ADMINISTRATIVO";
                const tooltipMsg = isAdmin
                  ? user.status === "INATIVO"
                    ? "Ativar"
                    : "pausar"
                  : "Inativar";
                return (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.pessoa?.nome}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.roles?.[0]?.nome}</Table.Cell>
                    <Table.Cell>{user.quantidadePropriedade || "-"}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor:
                              user.status === "INATIVO" || user.status === null
                                ? "#F44336"
                                : "#21801A",
                          }}
                        />
                        <span
                          style={{
                            color:
                              user.status === "INATIVO" || user.status === null
                                ? "#F44336"
                                : "#21801A",
                          }}
                        >
                          {user.status === "ATIVO" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <Tooltip message="Visualizar" id={`view-${user.id}`}>
                          <button
                            onClick={() =>
                              router.push(`/dashboard/users/${user.email}`)
                            }
                          >
                            <Eye />
                          </button>
                        </Tooltip>
                        <Tooltip message={tooltipMsg} id={`pause-${user.id}`}>
                          <ConfirmBox
                            onConfirm={() => deleteUserMutation.mutate(user.id)}
                            onActivate={() =>
                              activateUserMutation.mutate(user.id)
                            }
                            status={user.status}
                          />
                        </Tooltip>
                        <Tooltip message="Distribuir" id={`delete-${user.id}`}>
                          <button
                            disabled={true}
                            className="border border-[#21801A] opacity-50 cursor-not-allowed"
                          >
                            <LiaRandomSolid size={20} />
                          </button>
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
