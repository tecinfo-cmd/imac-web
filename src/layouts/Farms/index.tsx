"use client";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useGetFarms } from "@/hooks/useFarms/useGetFarms";
import { Eye } from "@/icons/Eye";
import { Monitor } from "@/icons/Monitor";
import { X } from "@/icons/X";

export const FarmsLayout = () => {
  const { data } = useGetFarms();

  return (
    <LayoutContainer title="Minhas Propriedades">
      <span>Total de propriedades: {data?.length}</span>
      <Table.Container>
        <Table.Header>
          <Table.Title>Nome da Propriedade</Table.Title>
          <Table.Title>Município</Table.Title>
          <Table.Title>CAR Federal</Table.Title>
          <Table.Title>Voucher</Table.Title>
          <Table.Title>Ações</Table.Title>
        </Table.Header>
        <Table.Body>
          {data?.map((farm) => (
            <Table.Row key={farm.id}>
              <Table.Cell>{farm.nomePropriedade}</Table.Cell>
              <Table.Cell>{farm.endereco.municipio}</Table.Cell>
              <Table.Cell>{farm.carFederal}</Table.Cell>
              <Table.Cell>{farm.voucher}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <Tooltip
                    message="Visualizar ou editar dados"
                    id="Visualizar ou editar dados"
                  >
                    <Eye />
                  </Tooltip>
                  <Tooltip message="Análise ambiental" id="Análise ambiental">
                    <Monitor />
                  </Tooltip>
                  <Tooltip
                    message="Inativar propriedade"
                    id="Inativar propriedade"
                  >
                    <X />
                  </Tooltip>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>
    </LayoutContainer>
  );
};
