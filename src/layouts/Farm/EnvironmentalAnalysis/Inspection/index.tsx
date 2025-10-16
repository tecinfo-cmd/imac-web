import Image from "next/image";
import { GoAlertFill } from "react-icons/go";
import { LuFileSearch } from "react-icons/lu";

import { Button } from "@/components/ui/button";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { useGetAutoInspection } from "@/hooks/useGetElegibilities/useGetAutoVistoria";
import { formatDate } from "@/utils/formatters/formatDate";

interface InspectionProps {
  farmId: number;
}

export const Inspection = ({ farmId }: InspectionProps) => {
  const { data: farm } = useGetFarmById(farmId);
  const idPropriedade = farmId;
  const { data: autoInspection, isLoading } =
    useGetAutoInspection(idPropriedade);

    console.log("autoInspection", autoInspection);

  if (isLoading) return <p>Carregando dados da vistoria...</p>;

  const currentInspection = autoInspection?.[0];

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
      <div className="grid grid-cols-3 gap-8 p-6 border border-[#CAC4D0] rounded shadow">
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
              <p>{farm?.etapa || "-"}</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Status</h2>
              <p>{farm?.status || "-"}</p>
            </div>
          </div>
        </div>
      </div>
      <h1 className="bg-[#21801A] font-semibold uppercase p-4 text-center text-white mt-6">
        Vistoria de Qualificação
      </h1>
      <div className="grid grid-cols-3 gap-8 p-6 border border-[#CAC4D0] rounded shadow">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <h2 className="text-[#21801A]">Data final limite da vistoria:</h2>
            <p>
              {currentInspection
                ? formatDate(currentInspection.dataTermino)
                : "Não informado"}
            </p>
          </div>
          <div className="flex gap-2">
            <h2 className="text-[#21801A]">Status da vistoria:</h2>
            <p>
              {currentInspection?.statusVistoria.toLowerCase() ||
                "Não realizada"}
            </p>
          </div>
          <div className="flex gap-2">
            <h2 className="text-[#21801A]">Resultado da vistoria:</h2>
            <p>
              {currentInspection?.vistoria.toLowerCase() ||
                "Aguardando vistoria"}
            </p>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4 justify-center items-end">
          {currentInspection?.formularios?.reportUrl ? (
            <div className="mt-4 flex justify-start">
              <Button
                variant="outline"
                onClick={() => {
                  const reportUrl = currentInspection.formularios.reportUrl;
                  if (reportUrl) {
                    window.open(reportUrl, "_blank");
                  }
                }}
              >
                <LuFileSearch size={20} />
                Acessar Relatório
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex justify-start">
              <Button
                variant="outline"
                disabled
                className="opacity-50 cursor-not-allowed"
              >
                <LuFileSearch size={20} />
                Relatório não disponível
              </Button>
            </div>
          )}
        </div>
      </div>

      <span className="font-semibold mt-6 block">Baixe o GIX</span>
      <div className="flex gap-4">
        <Image
          src="/img/google-play-badge.png"
          alt="Google Play"
          width={200}
          height={69}
        />
        <Image
          src="/img/apple.png"
          alt="Apple"
          width={220}
          height={65}
          className="object-contain"
        />
      </div>
    </>
  );
};
