import Link from "next/link";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoSearchSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";

type FilterUsersProps = {
  onFilter: (filters: any) => void;
};

export const FilterUsers = ({ onFilter }: FilterUsersProps) => {
  const { control, handleSubmit, reset } = useForm();

  const handleFilterFarm = (data: any) => {
    const formattedData = {
      ...data,
      perfil: data.perfil?.value,
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
        name="email"
        label="Email"
        placeholder="Digite o Email"
        control={control}
      />
      <InputSelect
        name="perfil"
        label="Perfil"
        placeholder="Administrador"
        control={control}
        options={[{ label: "Administrativo", value: "ADMINISTRATIVO" },
          { label: "Analista", value: "ANALISTA" },
          { label: "Produtor", value: "PRODUTOR", color: "#F44336" },
        ]}
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
        <Link href={"users/usersRegister"}>
          <Button type="button" variant="dark" className="mt-4">
            <FiPlus size={20} /> Novo
          </Button>
        </Link>
      </div>
    </form>
  );
};
