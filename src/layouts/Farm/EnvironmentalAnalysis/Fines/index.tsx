import { useForm } from "react-hook-form";
import { GoAlertFill } from "react-icons/go";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";

interface FinesProps {
  farmId: number;
}

export const Fines = ({ farmId }: FinesProps) => {
  const { data: farm } = useGetFarmById(farmId);
  const { register } = useForm();
  return (
    <>
      <div className="w-fit mx-auto flex justify-center items-center gap-3 border border-[#CAC4D0] p-4 rounded">
        <GoAlertFill size={35} color="#F12929" />
        <p className="text-[#0A3503]">
          Para ter acesso a Autorização de Comercialização, as multas devem ser{" "}
          <br /> quitadas.
        </p>
      </div>
      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Multas
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
              <p>-</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Status</h2>
              <p>-</p>
            </div>
          </div>
        </div>
      </div>
      <h1 className="bg-[#21801A] font-semibold uppercase p-4 text-center text-white mt-6">
        Multas
      </h1>
      <div className="grid grid-cols-3 gap-8 p-6 border border-[#CAC4D0] rounded shadow">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <h2 className="text-[#21801A]">Área degradada consolidada (ha):</h2>
            <p>1.43</p>
          </div>
          <div className="flex gap-2">
            <h2 className="text-[#21801A]">Valor multa:</h2>
            <p>R$1.500,00</p>
          </div>
          <div className="flex gap-2">
            <h2 className="text-[#21801A]">Possui isenção?</h2>
            <p>Não</p>
          </div>
          <div className="flex gap-2">
            <h2 className="text-[#21801A]">Desconto:</h2>
            <p>50%</p>
          </div>
          <div className="flex gap-2">
            <h2 className="text-[#21801A]">Valor total da multa:</h2>
            <p>R$750,00</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-6 px-6">
        <input
          id="accept"
          type="checkbox"
          className="accent-[#21801A]"
          {...register("accept")}
        />
        <label className="text-sm text-[#0A3503]" htmlFor="accept">
          Declaro, para todos os fins de direito, e sob penas de lei, que estou
          de acordo com os valores de multa e insenção informados.
        </label>
      </div>
    </>
  );
};
