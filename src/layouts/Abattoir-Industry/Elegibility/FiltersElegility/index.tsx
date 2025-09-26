import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoSearchSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";
import { Modal } from "@/layouts/DashboardUser/Properties/[id]/SelfInspection/components/Modal";

import { useCheckElegibility } from "@/hooks/useAbattoirElegibilities/useAbattoirElegibilities";
import { maskCAR } from "@/utils/formatters/maskCar";
import { maskCPFOrCNPJ } from "@/utils/maskCPFOrCNPJ";
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
      nomePropriedade: data.nomePropriedade?.toUpperCase().trim(),
      status: data.status?.value,
      cpfCnpj: data.cpfCnpj ? unmaskCPFOrCNPJ(data.cpfCnpj) : undefined,
      carFederal: data.carFederal?.toUpperCase().trim(),
    };

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
        className="flex flex-col md:flex-row gap-6 py-6 px-4"
        onSubmit={handleSubmit(handleFilterFarm)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-3/4 md:pr-4">
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
            label="CAR"
            placeholder="Digite o Car"
            control={control}
            mask={maskCAR}
          />
        </div>

        <div className="w-full md:w-auto">
          <div className="hidden md:flex flex-col gap-14">
            <div className="flex gap-6 items-end">
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
              <Button
                type="button"
                variant="green"
                onClick={() => setIsModalOpen(true)}
              >
                Nova Consulta
              </Button>
            </div>

            <div className="flex gap-6">
              <Button type="submit" variant="green">
                Buscar <IoSearchSharp size={20} />
              </Button>
              <Button type="button" variant="danger" onClick={clearFilter}>
                Limpar
              </Button>
            </div>
          </div>

          <div className="flex md:hidden flex-wrap gap-6 mt-6 items-center">
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

            <div className="flex mt-6 gap-6 flex-wrap">
              <Button type="submit" variant="green" className="h-auto">
                Buscar <IoSearchSharp size={20} />
              </Button>
              <Button
                type="button"
                variant="danger"
                className="h-auto"
                onClick={clearFilter}
              >
                Limpar
              </Button>
              <Button
                type="button"
                variant="green"
                className="h-auto"
                onClick={() => setIsModalOpen(true)}
              >
                Nova Consulta
              </Button>
            </div>
          </div>
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
