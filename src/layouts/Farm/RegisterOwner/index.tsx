"use client";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

import { LayoutContainer } from "@/components/LayoutContainer";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { useFarmStore } from "@/store/useFarmStore";

import { CoOwnerList } from "./CoOwnerList";
import { MainOwnerCard } from "./MainOwnerCard";
import { RegisterCoOwnerForm } from "./RegisterCoOwnerForm";

export const RegisterOwnerLayout = () => {
  const router = useRouter();
  const { farmStore } = useFarmStore();
  const { data: farm } = useGetFarmById(farmStore.id);

  return (
    <LayoutContainer title="Cadastrar Proprietário">
      <button
        onClick={() => router.back()}
        className="text-[#CAC4D0] border-2 border-[#CAC4D0] p-1 rounded flex gap-2 items-center mb-4"
      >
        <IoArrowBack size={24} />
      </button>

      <h2 className="text-[#1A6415] font-bold px-4">Propriedade</h2>
      <div className="flex items-center gap-8 p-4">
        <div>
          <h2 className="text-[#21801A]">Nome da Propriedade</h2>
          <p>{farmStore?.nomePropriedade}</p>
        </div>
        <div>
          <h2 className="text-[#21801A]">Município/UF</h2>
          <p>{farmStore?.cidade}/MT</p>
        </div>
      </div>

      <MainOwnerCard farm={farm} />
      {!farm?.proprietarios?.some(
        (p) => p.tipoProprietario === "COPROPRIETARIO"
      ) && <RegisterCoOwnerForm farmId={farmStore.id} />}
      {farm?.proprietarios?.some(
        (p) => p.tipoProprietario === "COPROPRIETARIO"
      ) && <CoOwnerList farm={farm} />}
    </LayoutContainer>
  );
};
