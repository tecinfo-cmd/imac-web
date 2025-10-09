"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Table } from "@/components/Table";

import { usePremCompliance } from "@/hooks/useTrackProducers/useTrackProducers";
import { Imac } from "@/icons/Imac";
import { LogoSideName } from "@/icons/LogoSideName";

function GetDcsStatusContent() {
  const searchParams = useSearchParams();
  const carFederal = searchParams.get("carFederal") || "";
  const idPropriedade = searchParams.get("idPropriedade") || "";

  const { data, isLoading } = usePremCompliance({
    carFederal: carFederal || undefined,
    idPropriedade: idPropriedade ? Number(idPropriedade) : undefined,
  });

  if (isLoading) return <div>Carregando...</div>;
  if (!data) return <div>Nenhum dado encontrado.</div>;

  return (
    <div className="max-w-[1000px] mx-auto border border-gray-300 rounded-lg bg-white p-8 mt-8">
      <div className="flex justify-between items-center mb-16 mt-6">
        <LogoSideName width={250} height={90} />
        <Imac width={180} height={100} />
      </div>
      <h2 className="text-center text-base md:text-2xl mb-4 md:mb-6 leading-tight md:leading-normal">
        DEMONSTRATIVO DE CONFORMIDADE
        <br />
        SOCIOAMBIENTAL
      </h2>
      <div className="bg-[#f8d7da] text-[#721c24] px-2 py-2 md:px-4 md:py-2 font-bold mb-6 rounded text-center text-sm md:text-base">
        SITUAÇÃO: {data.status}
      </div>
      <Table.Container className="!pt-0">
        <Table.Header>
          <Table.Title>Cadastro Ambiental Rural (CAR)</Table.Title>
          <Table.Title colspan={2}>Nome da Propriedade </Table.Title>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{data.carFederal}</Table.Cell>
            <Table.Cell>{data.nomePropriedade}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Container>
      <Table.Container className="!pt-0">
        <Table.Header>
          <Table.Title>CPF/CNPJ</Table.Title>
          <Table.Title>Data Adesão ao PREM</Table.Title>
          <Table.Title>Código DCS</Table.Title>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{data.cpfCnpj}</Table.Cell>
            <Table.Cell>{data.dataAdesaoPrem}</Table.Cell>
            <Table.Cell>{data.id}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Container>
      <Table.Container className="!pt-0">
        <Table.Header>
          <Table.Title colspan={3}>
            as seguintes detecções de desmatamento do território em questão:
          </Table.Title>
        </Table.Header>
        <Table.Body>
          {Array.isArray(data.deteccoes) && data.deteccoes.length > 0 ? (
            data.deteccoes.map((item: any, idx: number) => (
              <Table.Row key={idx}>
              <Table.Cell colspan={3}>
                {typeof item === "string" ? item : JSON.stringify(item)}
              </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colspan={3}>Nenhuma detecção encontrada</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Container>
    </div>
  );
}

export default function GetDcsStatus() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <GetDcsStatusContent />
    </Suspense>
  );
}
