"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import {
  PiFarmLight,
  PiSealCheckLight,
  PiUserCircleThin,
} from "react-icons/pi";

import { InfoGrid } from "@/components/InfoGrid";
import { LayoutContainer } from "@/components/LayoutContainer";
//import { Table } from "@/components/Table";
import { TableInformation } from "@/components/TableInformation";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { usePropertyMonitoring } from "@/hooks/useGetProperties/usePropertMonitoring";
import { Analityc } from "@/icons/Analityc";
//import { Eye } from "@/icons/Eye";

const customMenuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Analityc />,
  },
  {
    label: "Usuários",
    href: "/dashboard/users",
    icon: <PiUserCircleThin size={44} />,
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
      href: "/multas",
      icon: <Taxa />,
    },*/
];

export const AdjustmentTermLayout = () => {
  const router = useRouter();
  const params = useParams();
  const propriedadeId = params?.id as string;
  const propriedadeIdNumber = propriedadeId ? Number(propriedadeId) : undefined;
  const { data: farm } = useGetFarmById(propriedadeIdNumber);

  const imagemBase64 = farm?.territorios?.[0]?.imagemAdequacao;

  const { data: propriedade, isLoading } = usePropertyMonitoring(propriedadeId);

  if (isLoading || !propriedade) {
    return (
      <LayoutContainer title="ACOMPANHAMENTO PREM" menuItems={customMenuItems}>
        <p className="text-center mt-8">Carregando dados da propriedade...</p>
      </LayoutContainer>
    );
  }

  const farmData = {
    car: propriedade.carFederal,
    voucher: propriedade.voucher,
    nome: propriedade.nomePropriedade,
    municipio: propriedade.cidade?.nome,
    estado: propriedade.cidade?.uf,
    etapa: propriedade.etapa,
    status: propriedade.status,
  };

  const farmInfoRows = [
    [
      { label: "Cadastro Ambiental Rural (CAR)", value: farmData.car },
      { label: "Código Voucher PREM", value: farmData.voucher },
    ],
    [
      { label: "Nome da propriedade*", value: farmData.nome },
      { label: "Município*", value: farmData.municipio },
      { label: "Estado*", value: farmData.estado },
    ],
    [
      { label: "Etapa Atual:", value: farmData.etapa },
      { label: "Status", value: farmData.status },
    ],
  ];
  return (
    <LayoutContainer title="Análise Socioambiental" menuItems={customMenuItems}>
      <button
        onClick={() => router.push(`/dashboard/properties/${propriedadeId}`)}
        className="text-[#21801A] flex items-center gap-3"
      >
        <GoArrowLeft size={28} />
      </button>
      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Termo de Adequação
      </h1>
      <InfoGrid rows={farmInfoRows} data={[]} />

      <TableInformation>
        <TableInformation.Section title="Termo de adequação">
          <>
            <TableInformation.Row columnsPerRow={1}>
              <TableInformation.Title>Objetivo</TableInformation.Title>
              <TableInformation.Column>
                <TableInformation.Value>
                  <p>
                    O presente Plano de Adequação visa estabelecer os critérios
                    e diretrizes para a regeneração natural da área identificada
                    com desmatamento ilegal na propriedade, garantindo a
                    conformidade com as exigências do Programa de Reinserção e
                    Monitoramento -PREM. O objetivo é assegurar a recomposição
                    da vegetação nativa por meio de isolamento da área ,
                    monitoramento contínuo e comprovação da regeneração
                  </p>
                </TableInformation.Value>
              </TableInformation.Column>
            </TableInformation.Row>
            <TableInformation className="mt-6">
              <TableInformation.Title>
                Área destinada à Regeneração
              </TableInformation.Title>
              {imagemBase64 && (
                <div className="flex justify-center py-4">
                  <Image
                    src={`${imagemBase64}`}
                    alt="Área destinada à Regeneração"
                    width={900}
                    height={700}
                    className="max-w-full rounded-[20px] shadow"
                  />
                </div>
              )}
            </TableInformation>
            <TableInformation className="border border-[#d2f3dc] shadow-sm">
              <TableInformation.Row columnsPerRow={1}>
                <TableInformation.Title>
                  Obrigações do Produtor
                </TableInformation.Title>
                <TableInformation.Column>
                  <TableInformation.Value>
                    <div className="p-4">
                      <p>
                        <strong>
                          O produtor rural compromete-se a adotar as seguintes
                          medidas:
                        </strong>
                      </p>
                      <div className="mt-2">
                        <p className="font-semibold">Isolamento da Área</p>
                        <ul className="list-disc ml-6">
                          <li>
                            Implementar cercamento da área conforme as
                            coordenadas geográficas estabelecidas, garantindo
                            sua proteção contra acesso indevido de animais e
                            atividades humanas.
                          </li>
                          <li>
                            Manter a cerca em boas condições, evitando falhas
                            que comprometam a regeneração.
                          </li>
                        </ul>
                      </div>
                      <div className="mt-2">
                        <p className="font-semibold">Proteção e Conservação</p>
                        <ul className="list-disc ml-6">
                          <li>
                            Garantir a manutenção da cobertura vegetal sem
                            interferências que prejudiquem o processo natural de
                            recomposição.
                          </li>
                          <li>
                            Proibir atividades degradantes, tais como:
                            <ul className="list-disc ml-6">
                              <li>
                                Desmatamento, corte seletivo de árvores ou
                                exploração da vegetação;
                              </li>
                              <li>
                                Queimadas, uso de fogo ou práticas que possam
                                comprometer a regeneração;
                              </li>
                              <li>
                                Exploração comercial na área isolada, incluindo
                                pastoreio e a presença de animais de criação.
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-2">
                        <p className="font-semibold">
                          Monitoramento e Relatórios
                        </p>
                        <ul className="list-disc ml-6">
                          <li>
                            Realizar as autovistorias nas datas estabelecidas
                            pelo PREM, utilizando o aplicativo indicado pelo
                            programa e nas datas estabelecidas pelo Instituto
                            Mato-grossense da Carne – IMAC.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TableInformation.Value>
                </TableInformation.Column>
              </TableInformation.Row>
            </TableInformation>
            <TableInformation className="border border-[#d2f3dc] shadow-sm mt-6">
              <TableInformation.Row columnsPerRow={1}>
                <TableInformation.Title>
                  Fundamentos legais
                </TableInformation.Title>
                <TableInformation.Column>
                  <TableInformation.Value>
                    <ul className="list-disc ml-6">
                      <li>
                        Lei 12.651 25 de maio de 2012-Código Florestal
                        Brasileiro - Art. 12, Art. 59, Art. 66, Art. 67 e Art.
                        68
                      </li>
                      <li>
                        Lei Complementar n° 592 de 26 de maio de 2017 - Art. 19
                      </li>
                      <li>
                        Decreto 1031 de 02 de junho de 2017 - Art. 3, Art. 19 e
                        Art. 49
                      </li>
                      <li>
                        Protocolo de Monitoramento de Fornecedores de Gado da
                        Amazônia Versão 2.0 “Boi na Linha” – Imaflora.
                      </li>
                      <li>
                        Protocolo de Monitoramento Voluntário de Fornecedores de
                        Gado do Cerrado – Proforest.
                      </li>
                    </ul>
                  </TableInformation.Value>
                </TableInformation.Column>
              </TableInformation.Row>
            </TableInformation>

            <TableInformation className="border border-[#d2f3dc] shadow-sm mt-6">
              <TableInformation.Row columnsPerRow={1}>
                <TableInformation.Title>Conformidade</TableInformation.Title>
                <TableInformation.Column>
                  <TableInformation.Value>
                    O não cumprimento das obrigações estabelecidas poderá
                    resultar em medidas administrativas e ambientais cabíveis,
                    conforme previsto na legislação vigente.
                  </TableInformation.Value>
                </TableInformation.Column>
              </TableInformation.Row>
            </TableInformation>

            <TableInformation className="border border-[#d2f3dc] shadow-sm mt-6">
              <TableInformation.Row columnsPerRow={1}>
                <TableInformation.Title>Declarações</TableInformation.Title>
                <TableInformation.Column>
                  <TableInformation.Value>
                    <p>Declaro estar ciente e de acordo que:</p>
                    <p className="mt-2">
                      a) O quantitativo da área a ser regenerada pode ser
                      alterado de acordo com a validação pela Secretaria de
                      Estado de Meio Ambiente – SEMA/MT do cadastro ambiental
                      rural – CAR; <br />
                      <br />
                      b) Com as condições estabelecidas neste Plano de
                      Adequação, comprometo-me a adotar todas as medidas
                      necessárias para a regeneração da área conforme os
                      critérios definidos pelo Programa de Reinserção e
                      Monitoramento – PREM.
                    </p>
                  </TableInformation.Value>
                </TableInformation.Column>
              </TableInformation.Row>
            </TableInformation>
          </>
        </TableInformation.Section>
      </TableInformation>
    </LayoutContainer>
  );
};
