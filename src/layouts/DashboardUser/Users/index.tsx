"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  PiFarmLight,
} from "react-icons/pi";

import { ConfirmBox } from "@/components/ConfirmBox";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useDeleteUser } from "@/hooks/useGetUsers/useDeleteUser";
import { useGetUsers } from "@/hooks/useGetUsers/useGetUsers";
import { Analityc } from "@/icons/Analityc";
import { Eye } from "@/icons/Eye";
import { Taxa } from "@/icons/Taxa";
//import { Trash } from "@/icons/Trash";

import { FilterUsers } from "./FilterUsers";

export const UsersLayout = () => {
  const [filters, setFilters] = useState({});
  const { data: users, isLoading, error } = useGetUsers(filters);
  const router = useRouter();

  const deleteUserMutation = useDeleteUser();

  const customMenuItems = [
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
    {
      label: "Home",
      href: "/dashboardUser",
      icon: <Analityc />,
    },
  ];

  return (
    <LayoutContainer title="Usuarios" menuItems={customMenuItems}>
      <FilterUsers onFilter={setFilters} />
      <span>Total de usuários: {users?.length || 0}</span>

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
                        color: user.status === "ATIVO" ? "#21801A" : "#F44336",
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
                          router.push(`/dashboardUser/users/${user.email}`)
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
      )}
    </LayoutContainer>
  );
};
