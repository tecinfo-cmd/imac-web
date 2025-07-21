"use client";

import Link from "next/link";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useGetFarms } from "@/hooks/useFarms/useGetFarms";
import { Eye } from "@/icons/Eye";
import { Monitor } from "@/icons/Monitor";
import { X } from "@/icons/X";
import { useFarmFilterStore } from "@/store/useFarmFilterStore";
import { useFarmStore } from "@/store/useFarmStore";

import { FilterFarm } from "./FilterFarm";

export const FarmLayout = () => {
  const { farmFilterValues } = useFarmFilterStore();
  const { data } = useGetFarms(farmFilterValues);
  const { setFarm } = useFarmStore();

  return (
    <LayoutContainer title="Minhas Propriedades">
      <FilterFarm />
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
              <Table.Cell>{farm.cidade.nome || "N/A"}</Table.Cell>
              <Table.Cell>{farm.carFederal}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: farm.voucher ? "#21801A" : "#F44336",
                    }}
                  />
                  <span style={{ color: farm.voucher ? "#21801A" : "#F44336" }}>
                    {farm.voucher ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </Table.Cell>

              <Table.Cell>
                <div className="flex items-center gap-3">
                  <Tooltip
                    message="Visualizar ou editar dados"
                    id={`Visualizar ou editar dados ${farm.id}`}
                  >
                    <Link
                      href={`/propriedade/${farm.id}`}
                      onClick={() => {
                        setFarm({
                          id: farm.id,
                          carFederal: farm.carFederal,
                          voucher: farm.voucher,
                          cidade: farm.cidade.nome,
                          nomePropriedade: farm.nomePropriedade,
                          moduloFiscal: farm.moduloFiscal,
                        });
                      }}
                    >
                      <Eye />
                    </Link>
                  </Tooltip>
                  <Tooltip message="Análise ambiental" id={`Análise ambiental ${farm.id}`}>
                    <Link href={`/analise-ambiental/${farm.id}`}>
                      <Monitor />
                    </Link>
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
