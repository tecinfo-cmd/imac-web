import { useForm } from "react-hook-form";
import { IoSearchSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";

import { maskCAR } from "@/utils/formatters/maskCar";
import { maskCPFOrCNPJ } from "@/utils/maskCPFOrCNPJ";

type FilterUsersProps = {
  onFilter: (filters: any) => void;
};

export const unmaskCPFOrCNPJ = (value: string) => {
  return value.replace(/\D/g, "");
};

export const FilterElegibility = ({ onFilter }: FilterUsersProps) => {
  const { control, handleSubmit, reset } = useForm();

  const handleFilterFarm = (data: any) => {
    const formattedData = {
      ...data,
      nomePropriedade: data.nomePropriedade?.toUpperCase().trim(),
      status: data.status?.value,
      cpfCnpj: data.cpfCnpj ? unmaskCPFOrCNPJ(data.cpfCnpj) : undefined,
      carFederal: data.carFederal?.toUpperCase().trim(),
    };

    console.log("Filtro enviado:", formattedData);
    onFilter(formattedData);
  };

  const clearFilter = () => {
    reset({
      nomePropriedade: "",
      cpfCnpj: "",
      email: "",
      carFederal: "",
      status: null,
    });
    onFilter({});
  };

  return (
    <form
      className="flex items-center gap-4 py-6 px-4 z-0"
      onSubmit={handleSubmit(handleFilterFarm)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pr-4">
        <Input
          name="nomePropriedade"
          label="Nome Propriedade"
          placeholder="Digite o nome"
          control={control}
        />

        <Input
          name="cpfCnpj"
          label="CPF/CNPJ"
          placeholder="000.000.000-00 / 00.000.000/0000-00"
          control={control}
          mask={maskCPFOrCNPJ}
        />
        <Input
          name="email"
          label="Email"
          placeholder="Digite o Email"
          control={control}
        />
        <Input
          name="carFederal"
          label="CAR Federal"
          placeholder="Digite o Car Federal"
          control={control}
          mask={maskCAR}
        />
        <Input
          name="carEstadual"
          label="CAR Estadual"
          placeholder="Digite o Car Estadual"
          control={control}
          mask={maskCAR}
        />
        <InputSelect
          name="status"
          label="Status"
          placeholder="Selecione"
          control={control}
          options={[
            { label: "Aprovado", value: "APROVADO", color: "#21801A" },
            { label: "Reprovado", value: "REPROVADO", color: "#F44336" },
            { label: "Pendente", value: "PENDENTE", color: "#F3BF45" },
          ]}
          formatOptionLabel={(option: any) => (
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: option.color }}
              />
              <span>{option.label}</span>
            </div>
          )}
        />
      </div>
      <div className="flex flex-col gap-4 items-start z-10">
        <div className="pt-4 flex items-center gap-4 z-0">
          <Button type="submit" variant="green" className="mt-4">
            Buscar <IoSearchSharp size={20} />
          </Button>
          <Button
            type="submit"
            variant="danger"
            className="mt-4"
            onClick={clearFilter}
          >
            Limpar
          </Button>
        </div>
      </div>
    </form>
  );
};
