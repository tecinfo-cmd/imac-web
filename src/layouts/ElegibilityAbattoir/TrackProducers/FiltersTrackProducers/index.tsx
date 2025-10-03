import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoSearchSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";
import { Modal } from "@/layouts/DashboardUser/Properties/[id]/SelfInspection/components/Modal";

import { yup } from "@/config/yup";
import { usePremCompliance } from "@/hooks/useTrackProducers/useTrackProducers";
import { maskCAR } from "@/utils/formatters/maskCar";
import { maskCPFOrCNPJ } from "@/utils/maskCPFOrCNPJ";
import { yupResolver } from "@hookform/resolvers/yup";

type FilterUsersProps = {
  onFilter: (filters: any) => void;
};

const modalSchema = yup
  .object()
  .shape({
    carFederal: yup.string(),
    idPropriedade: yup.string(),
  })
  .test(
    "at-least-one",
    "Informe o CAR Federal ou o número da DCS",
    (obj) => !!obj.carFederal || !!obj.idPropriedade
  );

export const unmaskCPFOrCNPJ = (value: string) => {
  return value.replace(/\D/g, "");
};

export const FilterTrackProducers = ({ onFilter }: FilterUsersProps) => {
  const { control, handleSubmit, reset } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryParams, setQueryParams] = useState<{
    idPropriedade?: number;
    carFederal?: string;
  }>({});
  const router = useRouter();
  const { data: conformidadeData, isLoading } = usePremCompliance(queryParams);

  const {
    control: modalControl,
    handleSubmit: handleModalSubmit,
    reset: resetModal,
    watch: watchModal,
  } = useForm({
    resolver: yupResolver(modalSchema),
    mode: "onChange",
    defaultValues: {
      carFederal: "",
      idPropriedade: "",
    },
  });

  const carFederalValue = watchModal("carFederal");
  const dcsValue = watchModal("idPropriedade");
  const isModalButtonDisabled = !carFederalValue && !dcsValue;

  const handleFilterFarm = (data: any) => {
    const formattedData = {
      ...data,
      nomeProdutor: data.nomeProdutor?.toUpperCase().trim(),
      status: data.status?.value,
      cpfCnpj: data.cpfCnpj ? unmaskCPFOrCNPJ(data.cpfCnpj) : undefined,
      carFederal: data.carFederal?.toUpperCase().trim(),
    };

    onFilter(formattedData);
  };

  const clearFilter = () => {
    reset({
      nomeProdutor: "",
      cpfCnpj: "",
      carFederal: "",
      status: null,
    });
    onFilter({});
  };

  useEffect(() => {
    if (conformidadeData && !isLoading) {
      router.push(
        `/getDcsStatus?carFederal=${encodeURIComponent(conformidadeData.carFederal ?? "")}` +
        `&idPropriedade=${encodeURIComponent(conformidadeData.id ?? "")}`
      );
    }
  }, [conformidadeData, isLoading, router]);

  return (
    <>
      <form
        className="flex items-center gap-4 py-6 px-4 z-0"
        onSubmit={handleSubmit(handleFilterFarm)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pr-4">
          <Input
            name="nomeProdutor"
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
            name="carFederal"
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
              { label: "Ativado", value: "ATIVADO", color: "#21801A" },
              { label: "Expirado", value: "EXPIRADO", color: "#F44336" },
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
          <Button
            type="button"
            variant="green"
            className="mt-4"
            onClick={() => setIsModalOpen(true)}
          >
            Consultar DCS
          </Button>

          <div className="pt-4 flex items-center gap-4 z-0">
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
          </div>
        </div>
      </form>

      <Modal.Container
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="rounded-md"
      >
        <Modal.Header>Consulta de DCS</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleModalSubmit((values) => {
              setQueryParams({
                idPropriedade: values.idPropriedade
                  ? Number(values.idPropriedade)
                  : undefined,
                carFederal: values.carFederal || undefined,
              });
              resetModal();
              setIsModalOpen(false);
            })}
          >
            <Input
              name="carFederal"
              label="Informe o CAR Federal da propriedade que deseja consultar"
              placeholder="MT-xxxxxx-xxxxxxxxxxxxxxxxxx"
              control={modalControl}
              mask={maskCAR}
            />
            <Input
              name="idPropriedade"
              label="Informe da DCS"
              placeholder="Digite o número da DCS"
              control={modalControl}
            />
            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                variant="green"
                className="mt-4"
                disabled={isModalButtonDisabled}
              >
                Consultar
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Container>
    </>
  );
};