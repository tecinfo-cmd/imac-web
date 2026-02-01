import { GoAlertFill } from "react-icons/go";
import { MdOutlineFileDownload, MdOutlineFileUpload } from "react-icons/md";

import { Tooltip } from "@/components/Tooltip";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";

interface SuitabilityTermProps {
  farmId: number;
}

export const SuitabilityTerm = ({ farmId }: SuitabilityTermProps) => {
  const { data: farm } = useGetFarmById(farmId);
  return (
    <>
      <div className="w-fit mx-auto flex justify-center items-center gap-3 border border-[#CAC4D0] p-4 rounded">
        <GoAlertFill size={35} color="#F12929" />
        <p className="text-[#0A3503]">
          O Plano de adequação deve ser assinado. Os tipos de assinaturas
          aceitas são certificados digitais <br /> (Ex. Gov.br , E-notoriado ou
          Certificado Digital) ou ter firma reconhecida em cartório.
        </p>
      </div>
      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Plano de Adequação
      </h1>
      <div className="grid grid-cols-3 gap-8 p-6 border border-[#CAC4D0] rounded shadow">
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
      <div className="bg-[#D7EADD] p-4 font-semibold text-[#21801A] mt-4">
        <span>Faça o download do Termo de adequação para assinatura</span>
      </div>
      <div className="flex gap-4 justify-between p-4">
        <span>06/06/2025</span>
        <span>Termo de adequação</span>
        <button>
          <Tooltip id="Download do termo" message="Download do termo">
            <MdOutlineFileDownload size={24} />
          </Tooltip>
        </button>
      </div>
      <div className="bg-[#D7EADD] p-4 font-semibold text-[#21801A] mt-4">
        <span>Faça o upload do Termo de adequação assinado</span>
      </div>
      <div className="flex gap-4 justify-between p-4">
        <span>06/06/2025</span>
        <span>Termo de adequação</span>
        <button>
          <MdOutlineFileUpload size={24} />
        </button>
      </div>
    </>
  );
};
