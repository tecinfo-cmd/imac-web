"use client";

import { useParams, useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { PiFarmLight, PiSealCheckLight, PiUser } from "react-icons/pi";

import { InfoGrid } from "@/components/InfoGrid";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";

import { useGetFine } from "@/hooks/useFine/useFine";
import { useObjectionData } from "@/hooks/useGetProperties/useObjectionData";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import Barcode from "@/icons/BarCode";

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
  {
    label: "Frigorificos",
    href: "/dashboard/abattoir-industry",
    icon: <Abattoir size={44} />,
  },
];

export const FinesLayout = () => {
  const router = useRouter();
  const params = useParams();
  const propriedadeId = params?.id as string;
  const { data } = useObjectionData();
  const { data: fineResponse, isLoading: isLoadingFines } =
    useGetFine(propriedadeId);

  if (!data) return <p> Dados não encontrados</p>;

  const fineData = fineResponse;

  const { farmData } = data;
  console.log("Dados da id:", data);
  const analiseData = (data as any)?.retornoAnalises?.[0];
  const areaTotalDegradada = analiseData?.areaARegenerar || 0;

  const valorMulta = analiseData?.valorMulta || 0;
  const descontoPercentual = analiseData?.descontoPercentual || 0;
  const isencao = analiseData?.descontoPercentual === 100 ? "Sim" : "Não";

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return "-";
    }
  };
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  if (isLoadingFines) {
    return (
      <LayoutContainer
        title="Análise Socioambiental"
        menuItems={customMenuItems}
      >
        <p className="text-center mt-8">Carregando dados das multas...</p>
      </LayoutContainer>
    );
  }

  const farmInfoRows = [
    [
      { label: "Cadastro Ambiental Rural (CAR)", value: farmData.car },
      { label: "Código Voucher PREM", value: farmData.vouches },
    ],
    [
      { label: "Nome da propriedade", value: farmData.nome },
      { label: "Município*", value: farmData.municipio },
      { label: "Estado", value: farmData.estado },
    ],
    [
      { label: "Etapa Atual:", value: farmData.etapa },
      { label: "Status", value: farmData.status },
    ],
  ];

  const multaInfo = [
    {
      label: "Área degradada consolidada(ha):",
      value: `${areaTotalDegradada}`,
    },
    { label: "Valor multa:", value: `${formatCurrency(valorMulta)}` },
    { label: "Possui isenção?", value: `${isencao}` },
    { label: "Desconto:", value: `${descontoPercentual}%` },
  ];

  return (
    <LayoutContainer title="Análise Socioambiental" menuItems={customMenuItems}>
      <button
        onClick={() => router.push(`/dashboard/properties/${propriedadeId}`)}
        className="text-[#21801A] flex items-center gap-3"
      >
        <GoArrowLeft size={28} />
      </button>
      <div className="flex items-center justify-center"></div>
      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Multas
      </h1>
      <InfoGrid rows={farmInfoRows} data={[]} />
      <section className="border-grey-300">
        <div className="flex justify-center items-center bg-[#21801A] font-bold text-white px-4 py-2 text-sm">
          MULTAS
        </div>
        <div className="p-6 space-y-4 border border-b-1 border-gray-300 rounded-b-md">
          {multaInfo.map((item, index) => (
            <div key={index} className="flex items-center py-1 gap-4">
              <span className="text-[#21801A] flex-shrink-0">{item.label}</span>
              <span className="text-[#0A3503]">{item.value}</span>
            </div>
          ))}
        </div>
      </section>
      <div className="flex justify-center items-center bg-[#21801A] font-bold text-white px-4 py-2 text-sm">
        Status do pagamento
      </div>
      <Table.Container className="mt-4">
        <Table.Header>
          <Table.Title>Parcela</Table.Title>
          <Table.Title>Data de vencimento</Table.Title>
          <Table.Title>Data de pagamento</Table.Title>
          <Table.Title>Valor da parcela</Table.Title>
          <Table.Title>Status</Table.Title>
          <Table.Title>Imprimir</Table.Title>
        </Table.Header>
        <Table.Body>
          {fineData.length > 0 ? (
            fineData.map((boleto: any) => (
              <Table.Row key={boleto.id}>
                <Table.Cell>{boleto.parcela}</Table.Cell>
                <Table.Cell>{formatDate(boleto.dataVencimento)}</Table.Cell>
                <Table.Cell>{formatDate(boleto.dataPagamento)}</Table.Cell>
                <Table.Cell>{formatCurrency(boleto.valor)}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          boleto.status === "PENDENTE" ? "#F44336" : "#21801A",
                      }}
                    />
                    <span
                      style={{
                        color:
                          boleto.status === "PENDENTE" ? "#F44336" : "#21801A",
                      }}
                    >
                      {boleto.status === "LIQUIDADO" ? "Pago" : "Pendente"}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <button
                    onClick={() => {
                      console.log("Imprimir boleto:", boleto.linhaDigitavel);
                    }}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <Barcode />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell
                colspan={6}
                className="text-center py-8 text-gray-500"
              >
                Nenhum boleto encontrado
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Container>
    </LayoutContainer>
  );
};
