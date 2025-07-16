import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiUpload } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";
import { IoTrashSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { Table } from "@/components/Table";
import { TableInformation } from "@/components/TableInformation";
import { TextArea } from "@/components/TextArea";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { maskCep } from "@/utils/maskCEP";
import { maskCPF } from "@/utils/maskCPF";
import { maskPhone } from "@/utils/maskPhone";

interface SuitabilityPlanProps {
  farmId: number;
}

interface Document {
  type: string;
  checked: boolean;
  file?: File;
  uploadDate?: string;
  nomeArquivo?: string;
  urlArquivo?: string;
}

const initialDocuments: Document[] = [
  {
    type: "LAUDO",
    checked: false,
    file: undefined,
    uploadDate: undefined,
  },
  {
    type: "ART",
    checked: false,
    file: undefined,
    uploadDate: undefined,
  },
  {
    type: "RECIBO CAR",
    checked: false,
    file: undefined,
    uploadDate: undefined,
  },
  {
    type: "ARQUIVO KML",
    checked: false,
    file: undefined,
    uploadDate: undefined,
  },
];

const labelMap: Record<string, string> = {
  LAUDO: "Laudo Técnico",
  ART: "ART",
  "RECIBO CAR": "Recibo CAR",
  "ARQUIVO KML": "Arquivo kml/shape",
};

export const SuitabilityPlan = ({ farmId }: SuitabilityPlanProps) => {
  const { data: farm } = useGetFarmById(farmId);
  const { control } = useForm();

  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  const handleCheckboxChange = (index: number) => {
    setDocuments((prevDocuments) => {
      const updatedDocuments = prevDocuments.map((doc, i) => {
        if (i === index) {
          return { ...doc, checked: !doc.checked };
        }
        return doc;
      });

      return updatedDocuments;
    });
  };

  const handleFileChange = (index: number, file: File) => {
    setDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments];
      updatedDocuments[index].file = file;
      updatedDocuments[index].uploadDate = new Date().toLocaleDateString(
        "pt-BR"
      );
      return updatedDocuments;
    });
  };

  const handleRemoveFile = (index: number) => {
    setDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments];
      updatedDocuments[index].file = undefined;
      updatedDocuments[index].uploadDate = undefined;
      return updatedDocuments;
    });
  };

  return (
    <>
      <div className="w-fit mx-auto flex justify-center items-center gap-3 border border-[#CAC4D0] p-4 rounded">
        <GoAlertFill size={35} color="#F12929" />
        <p className="text-[#0A3503]">
          Para fazer o Aceite da Analise Sócioambiental, é necessário solicitar
          o Plano <br /> de Adequação.
        </p>
      </div>
      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Plano de Adequação
      </h1>
      <div className="grid grid-cols-3 gap-8 p-6 border border-[#CAC4D0] rounded shadow mb-6">
        <div>
          <h2 className="text-[#21801A]">Cadastro Ambiental Rural (CAR)</h2>
          <p>{farm?.carFederal}</p>
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
              <p>{farm?.cidade?.nome}</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Estado</h2>
              <p>MT</p>
            </div>
          </div>
        </div>
        <div className="col-span-2 mt-4">
          <div className="grid grid-cols-2">
            <div>
              <h2 className="text-[#21801A]">Etapa Atual</h2>
              <p>-</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Status</h2>
              <p>-</p>
            </div>
          </div>
        </div>
      </div>

      <TableInformation>
        <TableInformation.Section title="Deseja propor uma nova área para regeneração?">
          <TableInformation.Row columnsPerRow={2}>
            <TableInformation.Column>
              <TableInformation.Value>
                <input
                  type="checkbox"
                  id="propor-sim"
                  name="proporNovaArea"
                  value="sim"
                />
                <label htmlFor="propor-sim" className="ml-2 cursor-pointer">
                  Sim
                </label>
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Value>
                <input
                  type="checkbox"
                  id="propor-nao"
                  name="proporNovaArea"
                  value="nao"
                />
                <label htmlFor="propor-nao" className="ml-2 cursor-pointer">
                  Não
                </label>
              </TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>
        </TableInformation.Section>

        <TableInformation.Section title="Estratégia de Adequação" showArrow>
          <TableInformation.Row columnsPerRow={1}>
            <TableInformation.Column>
              <TableInformation.Title>
                Disponibilize o projeto da proposta de Estratégia de Adequação
                na nova área para regeneração
              </TableInformation.Title>
              <TableInformation.Value>
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      name="nome"
                      label="Nome"
                      placeholder="Digite o seu Nome ou Razão Social"
                      control={control}
                    />
                    <Input
                      name="cpf"
                      label="CPF"
                      placeholder="_ _ _ . _ _ _ . _ _ _ - _ _"
                      control={control}
                      mask={maskCPF}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      name="profissao"
                      label="Profissão"
                      placeholder="Digite sua profissão"
                      control={control}
                    />
                    <Input
                      name="registroCREA"
                      label="Registro CREA"
                      placeholder="Digite o registro CREA"
                      control={control}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      name="telefone"
                      label="Telefone"
                      placeholder="(00) 0 0000-0000"
                      control={control}
                      mask={maskPhone}
                    />
                    <Input
                      name="email"
                      label="E-mail"
                      placeholder="Digite o e-mail"
                      control={control}
                      type="email"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      name="cep"
                      label="CEP"
                      placeholder="_ _ - _ _ _"
                      control={control}
                      mask={maskCep}
                    />
                    <Input
                      name="logradouro"
                      label="Logradouro*"
                      placeholder="Digite o Logradouro"
                      control={control}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <Input
                      name="uf"
                      label="UF"
                      placeholder="Digite a UF"
                      control={control}
                    />
                    <Input
                      name="municipio"
                      label="Município"
                      placeholder="Digite o município"
                      control={control}
                    />
                    <Input
                      name="complemento"
                      label="Complemento (Opcional)"
                      placeholder="Digite complemento"
                      control={control}
                    />
                  </div>
                </div>
              </TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>
        </TableInformation.Section>

        <TableInformation.Section
          title="Motivo da Estratégia de Adequação"
          showArrow
        >
          <TableInformation.Row columnsPerRow={1}>
            <TableInformation.Column>
              <TableInformation.Title>
                Justificativa: Explique de forma breve o objetivo do laudo,
                indicando o que se pretende comprovar.
              </TableInformation.Title>
              <TableInformation.Value>
                <TextArea
                  control={control}
                  name="justify"
                  placeholder="Justifique aqui."
                />
              </TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>
        </TableInformation.Section>
        <TableInformation.Section title="Anotação de responsabilidade técnica">
          <TableInformation.Row columnsPerRow={1}>
            <TableInformation.Column>
              <TableInformation.Title>
                Anexe o Laudo Técnico e ART devidamente assinados e Recibo do
                CAR da propriedade.
              </TableInformation.Title>
              <TableInformation.Value>
                <Table.Container>
                  <Table.Header noBackground>
                    <Table.Title className="text-[#21801A] font-semibold">
                      Descrição do arquivo
                    </Table.Title>
                    <Table.Title className="text-[#21801A] font-semibold">
                      Nome do arquivo
                    </Table.Title>
                    <Table.Title className="text-[#21801A] font-semibold">
                      Data de upload
                    </Table.Title>
                    <Table.Title className="text-[#21801A] font-semibold">
                      {""}
                    </Table.Title>
                  </Table.Header>
                  <Table.Body>
                    {documents.map((doc, index) => (
                      <Table.Row key={index}>
                        <Table.Cell className="border-none text-gray-900">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="accent-[#21801A]"
                              checked={doc.checked}
                              onChange={() => handleCheckboxChange(index)}
                            />
                            {labelMap[doc.type] || "Documento"}
                          </label>
                        </Table.Cell>
                        <Table.Cell className="border-none">
                          {doc.nomeArquivo || doc.file?.name || "-"}
                        </Table.Cell>
                        <Table.Cell className="border-none">
                          {doc.uploadDate || "-"}
                        </Table.Cell>
                        <Table.Cell className="border-none flex gap-2 items-center">
                          {doc.urlArquivo ? (
                            <Link
                              href={doc.urlArquivo}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Visualizar documento"
                            >
                              <FiEye size={18} />
                            </Link>
                          ) : doc.checked && !doc.file ? (
                            <label className="cursor-pointer">
                              <FiUpload size={18} />
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  e.target.files &&
                                  handleFileChange(index, e.target.files[0])
                                }
                              />
                            </label>
                          ) : null}

                          {doc.file && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="text-red-600"
                            >
                              <IoTrashSharp size={18} />
                            </button>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Container>
              </TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>
        </TableInformation.Section>
        <TableInformation.Section title="Deseja solicitar o Plano de Adequação?">
          <TableInformation.Row columnsPerRow={2}>
            <TableInformation.Column>
              <TableInformation.Value>
                <input
                  type="checkbox"
                  id="propor-sim"
                  name="proporNovaArea"
                  value="sim"
                />
                <label htmlFor="propor-sim" className="ml-2 cursor-pointer">
                  Sim
                </label>
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Value>
                <input
                  type="checkbox"
                  id="propor-nao"
                  name="proporNovaArea"
                  value="nao"
                />
                <label htmlFor="propor-nao" className="ml-2 cursor-pointer">
                  Não
                </label>
              </TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>
        </TableInformation.Section>
      </TableInformation>
    </>
  );
};
