"use client";

import Link from "next/link";
import { FaDollarSign } from "react-icons/fa";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { useGetFarms } from "@/hooks/useFarms/useGetFarms";
import { Eye } from "@/icons/Eye";
import { VoucherIcon } from "@/icons/Voucher";
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
      <span>Total de propriedades: {data?.length || 0}</span>
      <Table.Container>
        <Table.Header>
          <Table.Title>Nome da Propriedade</Table.Title>
          <Table.Title>Município</Table.Title>
          <Table.Title>CAR Federal</Table.Title>
          <Table.Title>CAR Estadual</Table.Title>
          <Table.Title>Voucher</Table.Title>
          <Table.Title>Ações</Table.Title>
        </Table.Header>
        <Table.Body>
          {data?.map((farm) => (
            <Table.Row key={farm.id}>
              <Table.Cell>{farm.nomePropriedade}</Table.Cell>
              <Table.Cell>{farm.cidade.nome || "N/A"}</Table.Cell>
              <Table.Cell>{farm.carFederal}</Table.Cell>
              <Table.Cell>{farm.carEstadual}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: farm.statusVoucher
                        ? "#21801A"
                        : "#F44336",
                    }}
                  />
                  <span
                    style={{
                      color: farm.statusVoucher ? "#21801A" : "#F44336",
                    }}
                  >
                    {farm.statusVoucher ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </Table.Cell>

              <Table.Cell>
                <div className="flex items-center gap-3">
                  {farm.statusVoucher === false ? (
                    <Tooltip
                      message="Validar voucher"
                      id={`Validar voucher ${farm.id}`}
                    >
                      <Link href={"/validVoucher"}>
                        <VoucherIcon />
                      </Link>
                    </Tooltip>
                  ) : (
                    <Tooltip message="" id={`Voucher ativo ${farm.id}`}>
                      <div className="opacity-40 cursor-not-allowed">
                        <VoucherIcon />
                      </div>
                    </Tooltip>
                  )}
                  {farm.statusVoucher === false ? (
                    <Tooltip
                      message="Comprar voucher"
                      id={`Comprar voucher ${farm.id}`}
                    >
                      <Link href={"/enrollmentFee"}>
                        <FaDollarSign size={20} color="#21801A" />
                      </Link>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      message="Voucher já ativo"
                      id={`Voucher ativo ${farm.id}`}
                    >
                      <div className="opacity-40 cursor-not-allowed">
                        <FaDollarSign size={20} color="#21801A" />
                      </div>
                    </Tooltip>
                  )}
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
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>
    </LayoutContainer>
  );
};
