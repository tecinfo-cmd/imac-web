"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { MdEngineering } from "react-icons/md";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  PiFarmLight,
} from "react-icons/pi";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { CheckboxComponent } from "@/components/ui/checkbox";

import { usePropertySummary } from "@/hooks/useGetProperties/usePropertySummary";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { Eye } from "@/icons/Eye";
//import { Taxa } from "@/icons/Taxa";

export const PropertySummaryLayout = () => {
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const { data, isLoading, error } = usePropertySummary();
  const params = useParams();
  const router = useRouter();
  const propriedadeId = params?.id as string;

  const handleCheckboxChange = (index: number) => {
    setSelectedDocs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleDownloadSelected = () => {
    if (selectedDocs.length === 0) {
      alert("Selecione ao menos um documento para abrir.");
      return;
    }

    const docsToOpen = data?.documentos.filter((_, idx) =>
      selectedDocs.includes(idx)
    );

    docsToOpen?.forEach((doc) => {
      if (doc.url) {
        window.open(doc.url, "_blank");
      }
    });
  };

  const customMenuItems = [
    { label: "Dashboard", href: "/dashboard", icon: <Analityc /> },
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
    /*
    { label: "Multas", href: "/dashboard/multas", icon: <Taxa /> },
     */
    {
      label: "Frigorificos",
      href: "/dashboard/abattoir-industry",
      icon: <Abattoir size={44} />,
    },
    {
      label: "Responsável Técnico",
      href: "/dashboard/technical-manager",
      icon: <MdEngineering size={44} />,
    },
  ];

  if (isLoading)
    return <p className="p-4">Carregando dados da propriedade...</p>;
  if (error)
    return <p className="p-4 text-red-500">Erro ao carregar os dados.</p>;

  return (
    <LayoutContainer title="Análise Socioambiental" menuItems={customMenuItems}>
      <div className="max-w-6xl mx-auto my-8">
        <button
          onClick={() => router.push(`/dashboard/properties/${propriedadeId}`)}
          className="text-[#21801A] flex items-center gap-3"
        >
          <GoArrowLeft size={28} />
        </button>
      </div>
      <div className="flex flex-col gap-6">
        <div className="bg-[#21801A] text-white rounded-t-md px-4 py-2 font-bold text-center">
          Resumo da propriedade
        </div>

        <div className="bg-white rounded-b-md p-0">
          <div className="bg-[#21801A] text-white px-4 py-2 font-semibold rounded-t-md mb-1">
            Informações Propriedades
          </div>

          <Table.Container className="!pt-0">
            <Table.Header className="bg-[#D7EADD]">
              <Table.Title>Nome da Propriedade</Table.Title>
              <Table.Title>Município</Table.Title>
              <Table.Title>UF</Table.Title>
              <Table.Title>CEP</Table.Title>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{data?.nomePropriedade}</Table.Cell>
                <Table.Cell>{data?.municipio}</Table.Cell>
                <Table.Cell>{data?.uf}</Table.Cell>
                <Table.Cell>{data?.cep}</Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Header className="bg-[#D7EADD]">
              <Table.Title>Logradouro</Table.Title>
              <Table.Title colspan={3}>Complemento</Table.Title>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{data?.logradouro}</Table.Cell>
                <Table.Cell colspan={3}>{data?.complemento}</Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Header className="bg-[#D7EADD]">
              <Table.Title>Longitude</Table.Title>
              <Table.Title>Latitude</Table.Title>
              <Table.Title colspan={2}>Caixa Postal</Table.Title>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{data?.longitude}</Table.Cell>
                <Table.Cell>{data?.latitude}</Table.Cell>
                <Table.Cell colspan={2}>{data?.caixaPostal}</Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Header className="bg-[#D7EADD]">
              <Table.Title>Módulo Fiscal</Table.Title>
              <Table.Title colspan={3}>Tamanho da Propriedade</Table.Title>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{data?.moduloFiscal}</Table.Cell>
                <Table.Cell colspan={3}>{data?.tamanhoPropriedade}</Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Header className="bg-[#D7EADD]">
              <Table.Title>Atividade Principal</Table.Title>
              <Table.Title>Ciclo de Produção</Table.Title>
              <Table.Title colspan={2}>Número de Proprietários</Table.Title>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{data?.atividadePrincipal}</Table.Cell>
                <Table.Cell>{data?.cicloProducao}</Table.Cell>
                <Table.Cell colspan={2}>{data?.numeroProprietarios}</Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Header className="bg-[#D7EADD]">
              <Table.Title>Cadastro Ambiental Rural (CAR)</Table.Title>
              <Table.Title colspan={3}>Código voucher PREM</Table.Title>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{data?.cadastroAmbientalRural}</Table.Cell>
                <Table.Cell colspan={3}>{data?.codigoVoucherPrem}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Container>

          <div className="bg-[#21801A] text-white px-4 py-2 font-semibold mt-1">
            Proprietário Principal
          </div>
          <Table.Container className="!pt-0">
            <Table.Header className="bg-[#D7EADD]">
              <Table.Title>Nome/Razão Social</Table.Title>
              <Table.Title>CPF/CNPJ</Table.Title>
              <Table.Title>RG/Inscrição Social</Table.Title>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{data?.proprietarioPrincipal.nome}</Table.Cell>
                <Table.Cell>{data?.proprietarioPrincipal.cpfCnpj}</Table.Cell>
                <Table.Cell>
                  {data?.proprietarioPrincipal.rgInscricaoSocial}
                </Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Header className="bg-[#D7EADD]">
              <Table.Title>Data de Nascimento</Table.Title>
              <Table.Title>Telefone</Table.Title>
              <Table.Title>E-mail</Table.Title>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  {data?.proprietarioPrincipal.dataNascimento}
                </Table.Cell>
                <Table.Cell>{data?.proprietarioPrincipal.telefone}</Table.Cell>
                <Table.Cell>{data?.proprietarioPrincipal.email}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Container>

          {Array.isArray(data?.coproprietarios) &&
            data.coproprietarios.length > 0 &&
            data.coproprietarios.map((copro, index) => (
              <div key={index}>
                <div className="bg-[#21801A] text-white px-4 py-2 font-semibold mt-1">
                  Coproprietário {index + 1}
                </div>
                <Table.Container className="!pt-0">
                  <Table.Header className="bg-[#D7EADD]">
                    <Table.Title>Nome/Razão Social</Table.Title>
                    <Table.Title>CPF/CNPJ</Table.Title>
                    <Table.Title>RG/Inscrição Social</Table.Title>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{copro.nome}</Table.Cell>
                      <Table.Cell>{copro.cpfCnpj}</Table.Cell>
                      <Table.Cell>{copro.rgInscricaoSocial}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                  <Table.Header className="bg-[#D7EADD]">
                    <Table.Title>Data de Nascimento</Table.Title>
                    <Table.Title>Telefone</Table.Title>
                    <Table.Title>Email</Table.Title>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{copro.dataNascimento}</Table.Cell>
                      <Table.Cell>{copro.telefone}</Table.Cell>
                      <Table.Cell>{copro.email}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Container>
              </div>
            ))}

          {Array.isArray(data?.documentos) && data.documentos.length > 0 && (
            <>
              <div className="bg-[#21801A] text-white px-4 py-2 font-semibold mt-4">
                Documentos fornecidos
              </div>
              <Table.Container className="!pt-0">
                <Table.Header className="bg-[#D7EADD]">
                  <Table.Title>Descrição</Table.Title>
                  <Table.Title>Ações</Table.Title>
                </Table.Header>
                <Table.Body>
                  {data.documentos.map((doc, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <label className="flex items-center gap-2">
                          <CheckboxComponent
                            checked={selectedDocs.includes(index)}
                            onCheckedChange={() => handleCheckboxChange(index)}
                          />
                          {doc.descricao}
                        </label>
                      </Table.Cell>
                      <Table.Cell>
                        <Tooltip message="Visualizar" id={`view-doc-${index}`}>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye />
                          </a>
                        </Tooltip>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Container>

              <div className="flex justify-end mt-4">
                <Button
                  variant="green"
                  className="w-96"
                  onClick={handleDownloadSelected}
                >
                  Baixar Selecionados
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </LayoutContainer>
  );
};
