"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PiFarmLight, PiSealCheckLight, PiUser } from "react-icons/pi";

import { ConfirmBox } from "@/components/ConfirmBox";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useDeleteUser } from "@/hooks/useGetUsers/useDeleteUser";
import { useGetUsers } from "@/hooks/useGetUsers/useGetUsers";
import { Analityc } from "@/icons/Analityc";
import { Eye } from "@/icons/Eye";

import { FilterUsers } from "./FilterUsers";

export const UsersLayout = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filters, setFilters] = useState({});
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
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const deleteUserMutation = useDeleteUser();

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
    <LayoutContainer title="Usuarios" menuItems={customMenuItems}>
      <FilterUsers
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
              <Table.Title>Telefone</Table.Title>
              <Table.Title>Email</Table.Title>
              <Table.Title>Perfil</Table.Title>
              <Table.Title>Status</Table.Title>
              <Table.Title>Ações</Table.Title>
            </Table.Header>

            <Table.Body>
              {users.map((user: any) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.pessoa?.nome}</Table.Cell>
                  <Table.Cell>{user.pessoa?.telefone}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.roles?.[0]?.nome}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            user.status === "ATIVO" ? "#21801A" : "#F44336",
                        }}
                      />
                      <span
                        style={{
                          color:
                            user.status === "ATIVO" ? "#21801A" : "#F44336",
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
                      <Tooltip message="Inativar" id={`delete-${user.id}`}>
                        <ConfirmBox
                          onConfirm={() => deleteUserMutation.mutate(user.id)}
                          status={user.status}
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
