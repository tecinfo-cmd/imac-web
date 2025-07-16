import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";

import { Table } from "@/components/Table";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";

interface CommercializationAuthorizationProps {
  farmId: number;
}

export const CommercializationAuthorization = ({
  farmId,
}: CommercializationAuthorizationProps) => {
  const { data: farm } = useGetFarmById(farmId);
  return (
    <>
      <div className="w-fit mx-auto flex justify-center items-center gap-3 border border-[#CAC4D0] p-4 rounded">
        <GoAlertFill size={35} color="#F12929" />
        <p className="text-[#0A3503]">
          Para ter acesso a Autorização de Comercialização, a vistoria de
          qualificação <br /> deve ser realizada. Baixe o App GIX, e utilize o
          mesmo e-mail e senha para fazer login.
        </p>
      </div>
      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Vistoria
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
      <h1 className="bg-[#1A6415] p-4 text-white font-semibold">
        Autorização de Comercialização
      </h1>
      <Table.Container>
        <Table.Header>
          <Table.Title className="text-[#21801A] font-semibold">
            Nº da AC
          </Table.Title>
          <Table.Title className="text-[#21801A] font-semibold">
            Data de emissão
          </Table.Title>
          <Table.Title className="text-[#21801A] font-semibold">
            Data de Expiração
          </Table.Title>
          <Table.Title className="text-[#21801A] font-semibold">
            Status
          </Table.Title>
          <Table.Title className="text-[#21801A] font-semibold">
            Ações
          </Table.Title>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="border-none text-gray-900">1º</Table.Cell>
            <Table.Cell className="border-none text-gray-900">
              20/05/2025
            </Table.Cell>
            <Table.Cell className="border-none text-gray-900">
              20/07/2025
            </Table.Cell>
            <Table.Cell className="border-none text-gray-900">
              Vigente
            </Table.Cell>
            <Table.Cell className="border-none text-gray-900">
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                title="Visualizar documento"
              >
                <FiEye size={20} />
              </Link>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Container>
    </>
  );
};
