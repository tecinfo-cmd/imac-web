import Link from "next/link";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoSearchSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";

type FilterAbattoirProps = {
  onFilter: (filters: any) => void;
};

export const FilterAbattoir = ({ onFilter }: FilterAbattoirProps) => {
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
      <Input
        name="nome"
        label="Nome"
        placeholder="Digite o nome"
        control={control}
      />

      <Input
        name="cnpj"
        label="CNPJ"
        placeholder="Digite o CNPJ"
        control={control}
      />

      <Input
        name="email"
        label="Email"
        placeholder="Digite o Email"
        control={control}
      />

      <InputSelect
        name="status"
        label="Status"
        placeholder="Selecione"
        control={control}
        options={[
          { label: "Ativo", value: "ATIVO", color: "#21801A" },
          { label: "Inativo", value: "INATIVO", color: "#F44336" },
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
        <Link href={"abattoir-industry/abattoirRegister"}>
          <Button type="button" variant="dark" className="mt-4">
            <FiPlus size={20} /> Novo
          </Button>
        </Link>
      </div>
    </form>
  );
};
