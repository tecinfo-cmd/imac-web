"use client";
import {
  PiFarmLight,
  PiSealCheckLight,
  PiUserCircleThin,
} from "react-icons/pi";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";

import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { DownloadIcon } from "@/icons/Download";

const arquivos = [
  {
    id: 1,
    dataUpload: "12/09/2025",
    nome: "documento_car_1.pdf",
    url: "https://exemplo.com/documento_car_1.pdf",
  },
  {
    id: 2,
    dataUpload: "10/09/2025",
    nome: "documento_car_2.pdf",
    url: "https://exemplo.com/documento_car_2.pdf",
  },
];

const menuItems = [
  {
    label: "Home",
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
  /*
    {
      label: "Multas",
      href: "/multas",
      icon: <Taxa />,
    },
    */
  {
    label: "Frigorificos",
    href: "/dashboard/abattoir-industry",
    icon: <Abattoir size={44} />,
  },
];

export const CarReviewLayout = () => {
  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <LayoutContainer title="Revisão de Car" menuItems={menuItems}>
      <h1 className="text-center text-[#21801A] font-bold mb-4">
        Revisão de car
      </h1>
      <div className="bg-[#21801A] text-white px-4 py-2 font-semibold mt-1">
        Proprietário Principal
      </div>
      <Table.Container className="!pt-0">
        <Table.Header>
          <Table.Cell>Data de upload</Table.Cell>
          <Table.Cell colspan={2}>Nome do arquivo</Table.Cell>
        </Table.Header>
        <Table.Body>
          {arquivos.map((arquivo) => (
            <Table.Row key={arquivo.id}>
              <Table.Cell>{arquivo.dataUpload}</Table.Cell>
              <Table.Cell>{arquivo.nome}</Table.Cell>
              <Table.Cell>
                <button onClick={() => handleDownload(arquivo.url)}>
                  <DownloadIcon />
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>
    </LayoutContainer>
  );
};
