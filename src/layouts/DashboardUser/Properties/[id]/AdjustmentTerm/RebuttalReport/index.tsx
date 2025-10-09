"use client";

import Image from "next/image";
import { HiMiniExclamationCircle } from "react-icons/hi2";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  PiFarmLight,
} from "react-icons/pi";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Button } from "@/components/ui/button";

const customMenuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <PiUserCircleThin size={24} />,
  },
  {
    label: "Usuários",
    href: "/dashboard/users",
    icon: <PiUserCircleThin size={24} />,
  },
  {
    label: "Elegibilidade",
    href: "/dashboard/elegibility",
    icon: <PiSealCheckLight size={24} />,
  },
  {
    label: "Propriedades",
    href: "/dashboard/properties",
    icon: <PiFarmLight size={24} />,
  },
];

export const RebuttalReportLayout = () => {
  return (
    <LayoutContainer title="Análise Socioambiental" menuItems={customMenuItems}>
      <div className="bg-[#EEF7F0] shadow-md pt-4 rounded-md border-[1px] border-gray">
        <div className="h-32 flex justify-center items-center text-center text-xl font-semibold text-[#2D5B37] mb-4">
          PARECER DO LAUDO DE CONTESTAÇÃO
        </div>

        {/* Informações da Propriedade */}
        <section className="bg-white p-4 mb-6">
          <div className="bg-[#21801A] font-bold flex items-center text-white px-4 py-2 text-sm">
            <HiMiniExclamationCircle />
            Informações da Propriedade
          </div>
          <div className=" pt-6 flex ">
              {/* Coluna esquerda */}
              <div className="w-full pl-1 text-sm text-[#21801A]">
                <div className="gap-2 ">
                  <span className="font-semibold p-1 text-[#2D5B37]">Status:</span>
                  <span className="text-red-600 font-semibold">• Inapto</span>
                </div>

                <div className="bg-[#E7F3EA] p-1 px-2">
                  <strong className="text-[#2D5B37]">Nome:</strong> Vale do Sol 1
                </div>

                <div className="bg-white p-1 px-2">
                  <strong className="text-[#2D5B37]">Código:</strong> 569877259865347989
                </div>

                <div className="bg-[#E7F3EA] p-1 px-2">
                  <strong className="text-[#2D5B37]">Nível:</strong> N5
                </div>

                <div className="bg-white p-1 px-2">
                  <strong className="text-[#2D5B37]">Área Informada:</strong> Não Informado
                </div>

                <div className="bg-[#E7F3EA] p-1 px-2">
                  <strong className="text-[#2D5B37]">Área Calculada:</strong> 369.6379 ha
                </div>

                <div className="bg-white p-1 px-2">
                  <strong className="text-[#2D5B37]">Área Consolidada:</strong> Não Informado
                </div>
              </div>
              <div className="flex justify-end items-start">
                <Image
                  src="/mapa-exemplo.png"
                  alt="Mapa da propriedade"
                  width={362}
                  height={190}
                  className="rounded-md border shadow-md border-white-400 ml-4"
                />
              </div>
          </div>
        </section>

        {/* Agentes */}
        <section className="bg-white rounded-md p-4 border border-[#CAC4D0] mb-6">
          <h3 className="bg-green-700 text-white px-3 py-1 rounded text-sm inline-block mb-4">
            Agentes
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm text-zinc-700">
            <div>
              <strong>Nome:</strong> Ana Agente da Silva
            </div>
            <div>
              <strong>Documento:</strong> 135.139.934-98
            </div>
            <div>
              <strong>Tipo de Agente:</strong> Proprietário
            </div>
          </div>
        </section>

        {/* Detecções */}
        <section className="bg-white rounded-md p-4 border border-[#CAC4D0] mb-6">
          <h3 className="bg-green-700 text-white px-3 py-1 rounded text-sm inline-block mb-4">
            Detecções
          </h3>
          <div className="mb-4">
            <Image
              src="/detecao-satelite.png"
              alt="Imagem satélite"
              width={600}
              height={400}
              className="rounded border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-zinc-700">
            <div>
              <strong>Área de Sobreposição:</strong> 0.1 ha
            </div>
            <div>
              <strong>Percentual de sobreposição crítica:</strong> 0.03%
            </div>
            <div>
              <strong>Propriedade:</strong> Anderson Vieira do Sol
            </div>
            <div>
              <strong>Embargo:</strong> 397832949
            </div>
          </div>

          <p className="text-sm text-zinc-700 mt-4">
            <strong>Dados:</strong> Documento consta como área em consolidação
            agrícola de ocupação e remanejo.
          </p>
        </section>

        {/* Observação final e botões */}
        <div className="text-xs text-zinc-600 mb-4">
          Declaro, para todos os fins de direito, e sob pena de lei, que estou
          de acordo com o resultado da Contestação de Análise Socioambiental.
        </div>

        <div className="flex justify-between gap-4">
          <Button variant="danger">Solicitar laudo de Perito</Button>
          <Button variant="dark">Anexar modelos</Button>
        </div>
      </div>
    </LayoutContainer>
  );
};
