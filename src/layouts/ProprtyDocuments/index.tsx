"use client";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { DownloadIcon } from "@/icons/Download";

const mockDocuments = [
  {
    section: "Documentos da propriedade",
    items: [
      { date: "06/06/2025", name: "matricula_fazendaValeSO1.pdf" },
      { date: "06/06/2025", name: "matricula_fazendaValeSO1.pdf" },
      { date: "06/06/2025", name: "procuracao.pdf" },
      { date: "06/06/2025", name: "cnh_proprietario1.pdf" },
      { date: "06/06/2025", name: "rg_proprietario2.pdf" },
    ],
  },
  {
    section: "Documentos fornecidos para analises da propriedade",
    items: [
      { date: "06/06/2025", name: "car.pdf" },
      { date: "06/06/2025", name: "autorizacaodesupressao.pdf" },
      { date: "06/06/2025", name: "art.pdf" },
      { date: "06/06/2025", name: "laudocontestacao.pdf" },
      { date: "06/06/2025", name: "estrategiadegerenegacao.pdf" },
    ],
  },
  {
    section: "Parecer e relatórios da propriedade",
    items: [
      { date: "06/06/2025", name: "car.pdf" },
      { date: "06/06/2025", name: "autorizacaodesupressao.pdf" },
      { date: "06/06/2025", name: "art.pdf" },
      { date: "06/06/2025", name: "laudocontestacao.pdf" },
      { date: "06/06/2025", name: "estrategiadegerenegacao.pdf" },
    ],
  },
  {
    section: "Revisão do Car e outros documentos",
    items: [
      { date: "06/06/2025", name: "car.pdf" },
      { date: "06/06/2025", name: "autorizacaodesupressao.pdf" },
      { date: "06/06/2025", name: "art.pdf" },
      { date: "06/06/2025", name: "laudocontestacao.pdf" },
    ],
  },
];

export default function PropertyDocumentsLayout() {
  return (
    <LayoutContainer title="Acompanhamento da Propriedade">
      <h2 className="text-center text-2xl font-semibold mb-8 text-[#21801A]">
        Documentos da Propriedade
      </h2>
      {mockDocuments.map((section) => (
        <>
          <Table.Container>
            <Table.Header>
              <Table.Title
                colspan={3}
                className="bg-[#21801A] text-white text-base"
              >
                {section.section}
              </Table.Title>
            </Table.Header>
            <Table.Header>
              <Table.Title>Data de upload</Table.Title>
              <Table.Title>Nome do arquivo</Table.Title>
              <Table.Title> </Table.Title>
            </Table.Header>
            <Table.Body>
              {section.items.map((doc, i) => (
                <Table.Row key={doc.name + i}>
                  <Table.Cell>{doc.date}</Table.Cell>
                  <Table.Cell>{doc.name}</Table.Cell>
                  <Table.Cell>
                    <Tooltip
                      message="Baixar documento"
                      id={`download-${section.section}-${i}`}
                    >
                      <button
                        type="button"
                        className="hover:bg-[#DFEEE5] p-2 rounded transition"
                      >
                        <DownloadIcon />
                      </button>
                    </Tooltip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Container>
        </>
      ))}
      <div className="mt-10">
        <a href="#" className="text-[#21801A] underline text-sm">
          Voltar
        </a>
      </div>
    </LayoutContainer>
  );
}
