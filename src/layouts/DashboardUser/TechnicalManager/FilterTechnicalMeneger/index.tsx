import { useForm } from "react-hook-form";
import { IoSearchSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";


type FilterUsersProps = {
  onFilter: (filters: any) => void;
};

export const unmaskCPFOrCNPJ = (value: string) => {
  return value.replace(/\D/g, "");
};

export const FilterTechnicalManager = ({ onFilter }: FilterUsersProps) => {
  const { control, handleSubmit, reset } = useForm();

  const handleFilterFarm = (data: any) => {
    const formattedData = {
      ...data,
    };

    console.log("Filtro enviado:", formattedData);
    onFilter(formattedData);
  };

  const clearFilter = () => {
    reset();
    onFilter({});
  };

  return (
    <form
      className="flex items-center gap-4 py-6 px-4 z-0"
      onSubmit={handleSubmit(handleFilterFarm)}
    >
        <Input
          name="cpf"
          label="CPF"
          placeholder="Digite o CPF"
          control={control}
        />
        <Input
          name="profissao"
          label="Profissão"
          placeholder="Digite a profissão"
          control={control}
        />
        <Input
          name="email"
          label="Email"
          placeholder="Digite o Email"
          control={control}
        />
        <Input
          name="municipio"
          label="Municipio"
          placeholder="Digite o Municipio"
          control={control}
        />

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
    </form>
  );
};
