import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoSearchSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";

import { maskDate } from "@/utils/maskDate";

type FilterProps = {
  onFilter: (filters: any) => void;
};

export const FilterGuidelines = ({ onFilter }: FilterProps) => {
  const { control, handleSubmit, reset } = useForm();

  const handleFilterFarm = (data: any) => {
    const formattedData = {
      ...data,
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
        label="Nome do arquivo"
        placeholder="Digite o nome do arquivo"
        control={control}
      />

      <InputSelect
        name="tipo"
        label="Tipo"
        placeholder="PDF"
        control={control}
        options={[
          { label: "Pdf", value: "PDF" },
          { label: "Video", value: "VIDEO" },
        ]}
      />

      <Input
        name="date"
        label="Data de upload"
        placeholder="Digite a data de upload"
        control={control}
        mask={maskDate}
      />

      <div className="pt-4 flex items-center gap-4">
        <Button type="submit" variant="green" className="mt-4">
          Buscar <IoSearchSharp size={20} />
        </Button>
        <Button
          type="button"
          variant="danger"
          className="mt-4"
          onClick={clearFilter}
        >
          Limpar
        </Button>
        <Button type="button" variant="dark" className="mt-4">
          <FiPlus size={20} /> Novo
        </Button>
      </div>
    </form>
  );
};
