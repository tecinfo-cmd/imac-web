import Image from "next/image";
import { useEffect, useState } from "react";
import { GoAlertFill } from "react-icons/go";
import { MdOutlineMarkEmailRead } from "react-icons/md";

import { TableInformation } from "@/components/TableInformation";
import { Button } from "@/components/ui/button";
import EmailModal from "@/components/ui/modals/emailModal";

import { useAdequancyTerm } from "@/hooks/useAdequancyTerm/useAdequancyTerm";
import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { customToast } from "@/utils/customToast";
interface AdequancyTermProps {
  farmId: number;
}

const termoStatuses = [
  "Termo Enviado",
  "Termo Assinado",
  "Multa disponível",
  "Autovistoria Disponível",
  "Autovistoria Realizado",
  "Autovistoria Não realizado",
  "Autorização de Comercialização Vigente",
  "Autorização de Comercialização Expirada",
];

export const AdequancyTerm = ({ farmId }: AdequancyTermProps) => {
  const { data: farm, refetch } = useGetFarmById(farmId);
  const imagemBase64 = farm?.territorios?.[0]?.imagemAnalise;

  const status = termoStatuses.includes(farm?.status ?? "");

  const [proposeNewArea, setProposeNewArea] = useState<"yes" | "no" | null>(
    null
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (status) {
      setProposeNewArea("yes");
    }
  }, [farm?.status, status]);

  const termoCompromissoAssinado = farm?.urlTermoCompromisso;

  const adequancyTermMutation = useAdequancyTerm({
    onSuccess: () => {
      setIsSuccessModalOpen(true);
      refetch();
    },
    onError: (error: any) => {
      customToast.error("Erro ao aceitar o termo de adequação");
      console.error("Erro:", error);
    },
  });

  const handleProposeNewAreaChange = (value: "yes" | "no") => {
    setProposeNewArea(proposeNewArea === value ? null : value);
  };

  const handleAcceptTerm = () => {
    if (farmId) {
      console.log("Chamando mutation com farmId:", farmId);
      adequancyTermMutation.mutate({ id: farmId });
    }
  };
  console.log("Farm data:", farm);

  return (
    <>
      <EmailModal
        isOpen={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      >
        <div className="flex justify-center items-center w-full h-full">
          <div className="w-[90%] max-w-[300px] h-auto max-h-[90%] flex flex-col justify-center items-center">
            <MdOutlineMarkEmailRead className="text-red-400 w-8 h-8 sm:w-9 sm:h-9 mb-2" />
            <h2 className="sm:text-lg text-red-400 font-bold mb-2">Atenção</h2>
            <p className="sm:text-sm text-center">
              O termo de compromisso será enviado ao seu email para assinatura.
            </p>
          </div>
        </div>
      </EmailModal>

      <div className="w-fit mx-auto flex justify-center items-center gap-3 border border-[#CAC4D0] p-4 rounded">
        <GoAlertFill size={35} color="#F12929" />
        <p className="text-[#0A3503]">
          O Plano de Adequação após ser solicitado não poderá solicitar
          contestação ou estratégia de adequação.
        </p>
      </div>
      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Plano de Adequação
      </h1>
      <div className="grid grid-cols-3 gap-8 p-6 border border-[#CAC4D0] rounded shadow  mb-6">
        <div>
          <h2 className="text-[#21801A]">Cadastro Ambiental Rural (CAR)</h2>
          <p>{farm?.carFederal}</p>
        </div>
        <div>
          <h2 className="text-[#21801A]">Car Estadual</h2>
          <p>{farm?.carEstadual || "-"}</p>
        </div>
        <div>
          <h2 className="text-[#21801A]">Código Voucher PREM</h2>
          <p>{farm?.voucher}</p>
        </div>

        <div className="col-span-3 mt-4">
          <div className="grid grid-cols-3">
            <div>
              <h2 className="text-[#21801A]">Nome da propriedade</h2>
              <p>{farm?.nomePropriedade}</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Município</h2>
              <p>{farm?.endereco?.municipio}</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Estado</h2>
              <p>{farm?.endereco?.estado}</p>
            </div>
          </div>
        </div>
        <div className="col-span-2 mt-4">
          <div className="grid grid-cols-2">
            <div>
              <h2 className="text-[#21801A]">Etapa Atual</h2>
              <p>{farm?.etapa}</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Status</h2>
              <p>{farm?.status}</p>
            </div>
          </div>
        </div>
      </div>
      {!status && (
        <TableInformation>
          <TableInformation.Section title="Deseja solicitar o Plano de Adequação?">
            <TableInformation.Row columnsPerRow={2}>
              <TableInformation.Column>
                <TableInformation.Value>
                  <input
                    type="checkbox"
                    id="propose-yes"
                    name="proposeNewArea"
                    value="yes"
                    checked={proposeNewArea === "yes"}
                    onChange={() => handleProposeNewAreaChange("yes")}
                    className="accent-[#21801A]"
                  />
                  <label htmlFor="propose-yes" className="ml-2 cursor-pointer">
                    Sim
                  </label>
                </TableInformation.Value>
              </TableInformation.Column>
            </TableInformation.Row>
          </TableInformation.Section>
        </TableInformation>
      )}
      <TableInformation>
        <TableInformation.Section
          title="Plano de Adequação"
          showArrow
          disabled={proposeNewArea !== "yes"}
          defaultOpen={status}
        >
          {proposeNewArea === "yes" && (
            <>
              <TableInformation.Row columnsPerRow={1}>
                <TableInformation.Title>Objetivo</TableInformation.Title>
                <TableInformation.Column>
                  <TableInformation.Value>
                    <p>
                      O presente Plano de Adequação visa estabelecer os
                      critérios e diretrizes para a regeneração natural da área
                      identificada com desmatamento ilegal na propriedade,
                      garantindo a conformidade com as exigências do Programa de
                      Reinserção e Monitoramento -PREM. O objetivo é assegurar a
                      recomposição da vegetação nativa por meio de isolamento da
                      área , monitoramento contínuo e comprovação da regeneração
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
                          <p className="font-semibold">
                            Proteção e Conservação
                          </p>
                          <ul className="list-disc ml-6">
                            <li>
                              Garantir a manutenção da cobertura vegetal sem
                              interferências que prejudiquem o processo natural
                              de recomposição.
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
                                  Exploração comercial na área isolada,
                                  incluindo pastoreio e a presença de animais de
                                  criação.
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
                          Lei Complementar n° 592 de 26 de maio de 2017 - Art.
                          19
                        </li>
                        <li>
                          Decreto 1031 de 02 de junho de 2017 - Art. 3, Art. 19
                          e Art. 49
                        </li>
                        <li>
                          Protocolo de Monitoramento de Fornecedores de Gado da
                          Amazônia Versão 2.0 “Boi na Linha” – Imaflora.
                        </li>
                        <li>
                          Protocolo de Monitoramento Voluntário de Fornecedores
                          de Gado do Cerrado – Proforest.
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
              <div className="flex justify-end mt-4 gap-4">
                {termoCompromissoAssinado !== null && (
                  <Button
                    onClick={() => {
                      window.open(termoCompromissoAssinado, "_blank");
                    }}
                  >
                    Baixar Termo de Compromisso
                  </Button>
                )}
                <Button
                  variant="green"
                  onClick={handleAcceptTerm}
                  disabled={adequancyTermMutation.isPending || status}
                >
                  {adequancyTermMutation.isPending
                    ? "Processando..."
                    : "Declaro que estou de acordo"}
                </Button>
              </div>
            </>
          )}
        </TableInformation.Section>
      </TableInformation>
    </>
  );
};
