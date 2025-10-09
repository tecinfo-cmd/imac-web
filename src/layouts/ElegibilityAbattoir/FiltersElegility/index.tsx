import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoSearchSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";
import { Modal } from "@/layouts/DashboardUser/Properties/[id]/SelfInspection/components/Modal";

import { useCheckElegibility } from "@/hooks/useAbattoirElegibilities/useAbattoirElegibilities";
import { maskCAR } from "@/utils/formatters/maskCar";
import { toast } from "sonner";

type FilterUsersProps = {
  onFilter: (filters: any) => void;
};

export const unmaskCPFOrCNPJ = (value: string) => {
  return value.replace(/\D/g, "");
};

export const FilterElegibilityAbattoir = ({ onFilter }: FilterUsersProps) => {
  const { control, handleSubmit, reset } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control: modalControl,
    handleSubmit: handleModalSubmit,
    watch: watchModal,
    reset: resetModal,
  } = useForm({
    mode: "onChange",
    defaultValues: { numeroCar: "" },
  });

  const { mutate: checkElegibility, isPending } = useCheckElegibility({
    onSuccess: () => {
      toast.success("Consulta enviada com sucesso!");
      resetModal();
    },
    onError: () => {
      toast.error("Erro ao consultar elegibilidade, tente novamente.");
    },
  });

  const handleFilterFarm = (data: any) => {
    const formattedData = {
      ...data,
      status: data.status?.value,
      numeroCar: data.numeroCar?.toUpperCase().trim(),
    };

    onFilter(formattedData);
  };

  const clearFilter = () => {
    reset({
      numeroCar: "",
      status: null,
    });
    onFilter({});
  };

  const handleConsultaElegibilidade = ({ numeroCar }: any) => {
    checkElegibility(numeroCar);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetModal();
  };

  const numeroCarValue = watchModal("numeroCar");

  return (
    <>
      <form
  className="
    flex flex-col md:flex-row 
    md:items-center md:justify-between
    gap-4 py-6 px-4
  "
  onSubmit={handleSubmit(handleFilterFarm)}
>
  {/* Inputs */}
  <div className="flex flex-col md:flex-row gap-4 flex-1">
    <Input
      name="numeroCar"
      label="CAR"
      placeholder="Digite o Car"
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

  {/* Buttons */}
  <div className="flex gap-4 mt-4 md:mt-0 md:justify-end">
    <Button type="submit" variant="green">
      Buscar <IoSearchSharp size={20} />
    </Button>
    <Button type="button" variant="danger" onClick={clearFilter}>
      Limpar
    </Button>
    <Button
      type="button"
      variant="green"
      onClick={() => setIsModalOpen(true)}
    >
      Nova Consulta
    </Button>
  </div>
</form>

      <Modal.Container
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        className="border-2 border-green-700 rounded-lg"
      >
        <Modal.Header className="text-black">
          Consulta de Elegibilidade
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleModalSubmit(handleConsultaElegibilidade)}>
            <Input
              name="numeroCar"
              label="Informe o CAR Federal da propriedade que deseja consultar"
              placeholder="MT-xxxxxx-xxxxxxxxxxxxxxxxxx"
              control={modalControl}
              mask={maskCAR}
            />

            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                variant="green"
                disabled={!numeroCarValue || isPending}
              >
                {isPending ? "Consultando..." : "Consultar"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Container>
    </>
  );
};
