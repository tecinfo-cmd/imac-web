import { useForm } from "react-hook-form";
import { IoSearchSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";

import { maskCPFOrCNPJ } from "@/utils/maskCPFOrCNPJ";

type FilterUsersProps = {
  onFilter: (filters: any) => void;
};

export const FilterElegibility = ({ onFilter }: FilterUsersProps) => {
  const { control, handleSubmit, reset } = useForm();

  const handleFilterFarm = (data: any) => {
    const formattedData = {
      ...data,
      status: data.status?.value,
    };
    onFilter(formattedData);
  };

  const clearFilter = () => {
    reset();
    onFilter({});
  };

  return (
    <form
      className="flex items-center gap-4 py-6 px-4"
      onSubmit={handleSubmit(handleFilterFarm)}
    >
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="nomePropriedade"
          label="Nome Produtor"
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
          name="numeroCar"
          label="CAR"
          placeholder="Digite o Car"
          control={control}
        />
      </div>
      <div className="ml-auto flex justify-end   items-end gap-4">
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

        <div className="pt-4 flex items-center gap-4">
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
