import { useForm } from "react-hook-form";
import { IoSearchSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";

import { useGetCities } from "@/hooks/useAddress/useGetCities";
import { useFarmFilterStore } from "@/store/useFarmFilterStore";

export const FilterFarm = () => {
  const { control, handleSubmit, reset } = useForm();
  const { addFilterValues, clearFilterValues } = useFarmFilterStore();
  const { data: cities } = useGetCities();

  const handleFilterFarm = (data: any) => {
    const formattedData = {
      nomePropriedade: data.nomeFazenda,
      carFederal: data.carFederal,
      carEstadual: data.carEstadual,
      codigoMunicipio: data.codigoMunicipio?.value,
      statusVoucher:
        data.statusVoucher?.value === "active"
          ? true
          : data.statusVoucher?.value === "inactive"
            ? false
            : undefined,
    };
    addFilterValues(formattedData);
  };

  const clearFilter = () => {
    reset();
    clearFilterValues();
  };

  return (
    <form
      className="flex items-center gap-4 py-6 px-4"
      onSubmit={handleSubmit(handleFilterFarm)}
    >
      <Input
        name="nomeFazenda"
        label="Nome da Propriedade"
        placeholder="Digite o nome da propriedade"
        control={control}
      />

      <InputSelect
        name="codigoMunicipio"
        label="Município"
        placeholder="Digite o nome do município"
        control={control}
        options={
          cities?.map((city) => ({
            label: city.nome,
            value: city.codigo,
          })) || []
        }
      />
      <Input
        name="carFederal"
        label="CAR Federal"
        placeholder="Insira o seu CAR Federal"
        control={control}
      />

      <Input
        name="carEstadual"
        label="CAR Estadual"
        placeholder="Insira o seu CAR Estadual"
        control={control}
      />

      <InputSelect
        name="statusVoucher"
        label="Status do Voucher"
        placeholder="Selecione"
        control={control}
        options={[
          { label: "Ativo", value: "active" },
          { label: "Inativo", value: "inactive" },
        ]}
      />

      <div className="pt-4 flex items-center gap-4">
        <Button type="submit" variant="green" className="mt-4">
          Filtrar <IoSearchSharp size={20} />
        </Button>
        <Button
          type="button"
          variant="danger"
          className="mt-4"
          onClick={clearFilter}
        >
          Limpar
        </Button>
      </div>
    </form>
  );
};
