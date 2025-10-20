"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Table } from "@/components/Table";
import { Button } from "@/components/ui/button";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { usePremCompliance } from "@/hooks/useTrackProducers/useTrackProducers";
import { Imac } from "@/icons/Imac";
import { LogoSideName } from "@/icons/LogoSideName";
import { toast } from "sonner";

function GetDcsStatusContent() {
  const searchParams = useSearchParams();
  const carFederal = searchParams.get("carFederal") || "";
  const idPropriedade = searchParams.get("idPropriedade") || "";

  const { data: farmData } = useGetFarmById(Number(idPropriedade));

  const [dataHoraAbertura, setDataHoraAbertura] = useState<string>("");
  const [showPdfViewer, setShowPdfViewer] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const { data, isLoading } = usePremCompliance({
    carFederal: carFederal || undefined,
    idPropriedade: idPropriedade ? Number(idPropriedade) : undefined,
  });

  const handleViewDCS = () => {
    const primeiraUrl =
      farmData?.documentos?.find((doc) => doc.tipo === "DCS")?.urlArquivo || "";

    if (primeiraUrl) {
      setPdfUrl(primeiraUrl);
      setShowPdfViewer(true);
    } else {
      toast.error("Nenhum documento encontrado, por favor assine o termo de adequação e compromisso.");
    }
  };

  const closePdfViewer = () => {
    setShowPdfViewer(false);
    setPdfUrl("");
  };

  function maskCpf(cpf: string) {
    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11) return cpf;
    return `${digits.slice(0, 3)}.***.***-${digits.slice(9, 11)}`;
  }

  useEffect(() => {
    const agora = new Date();
    const dataFormatada = agora.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setDataHoraAbertura(dataFormatada);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <div>Carregando...</div>;
  if (!data) return <div>Nenhum dado encontrado.</div>;

  return (
    <>
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
          SITUAÇÃO: {data.status} - Data/Hora da consulta: {dataHoraAbertura}
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
              <Table.Cell>{maskCpf(data.cpfCnpj)}</Table.Cell>
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
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button className="mt-4" onClick={handlePrint}>
            Imprimir situação DCS
          </Button>
          <Button variant="dark" className="mt-4" onClick={handleViewDCS}>
            Imprimir demonstração DCS
          </Button>
        </div>
      </div>

      {showPdfViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] h-[90%] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Demonstração DCS</h3>
              <Button onClick={closePdfViewer} variant="outline">
                Fechar
              </Button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={pdfUrl}
                className="w-full h-full border rounded"
                title="Visualizador de PDF"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function GetDcsStatus() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <GetDcsStatusContent />
    </Suspense>
  );
}
