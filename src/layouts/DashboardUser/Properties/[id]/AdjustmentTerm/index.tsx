"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  PiFarmLight,
  PiSealCheckLight,
  PiUserCircleThin,
  PiWarningFill,
} from "react-icons/pi";

import { InfoGrid } from "@/components/InfoGrid";
import { LayoutContainer } from "@/components/LayoutContainer";
//import { Table } from "@/components/Table";

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
  //const router = useRouter();
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
      <div className="flex items-center justify-center">
        <div className="border-[#CAC4D0] border-[1px] p-4 rounded-md flex justify-center items-center space-x-3 text-sm text-gray-800 w-fit">
          <PiWarningFill
            size={36}
            className="text-red-500 mt-1 text-xl flex-shrink-0"
          />
          <p>
            Para fazer o Aceite da Analise Sócioambiental, é necessário
            solicitar o Termo de Adequação.
          </p>
        </div>
      </div>
      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Termo de Adequação
      </h1>
      <InfoGrid rows={farmInfoRows} data={[]} />
      <section className="border rounded-md shadow bg-white mt-4">
        <div className="flex justify-center py-4">
          {imagemBase64 && (
            <Image
              src={`${imagemBase64}`}
              alt="Área destinada à Regeneração"
              width={900}
              height={700}
              className="max-w-full rounded-[20px] shadow"
            />
          )}
        </div>
      </section>
    </LayoutContainer>
  );
};
