import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiLoader } from "react-icons/fi";

import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";

import {
  QUERY_KEY_GET_FARM_BY_ID,
  useGetFarmById,
} from "@/hooks/useFarms/useGetFarmById";
import { useLinkOwnerToFarm } from "@/hooks/useFarms/useLinkOwnerToFarm";
import { maskCPFOrCNPJ } from "@/utils/maskCPFOrCNPJ";
import { maskDate } from "@/utils/maskDate";
import { maskPhone } from "@/utils/maskPhone";
import { maskRG } from "@/utils/maskRG";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateOwnerFormProps {
  farmId: number | undefined;
  idProprietario: number | undefined;
}

export const UpdateOwnerForm = ({
  farmId,
  idProprietario,
}: UpdateOwnerFormProps) => {
  const queryClient = useQueryClient();
  const { data: farmData, isLoading } = useGetFarmById(farmId);
  const { mutateAsync: linkOwner, isPending } = useLinkOwnerToFarm(farmId!);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      nome: "",
      cpfCnpj: "",
      rgInscricaoSocial: "",
      dataNascimento: "",
      telefone: "",
      email: "",
    },
  });

  const owner = farmData?.proprietarios.find(
    (owner) => owner.id === idProprietario
  );

  useEffect(() => {
    if (owner) {
      reset({
        nome: owner.pessoa.nome,
        cpfCnpj: owner.pessoa.cpfCnpj,
        rgInscricaoSocial: owner.pessoa.rgInscricaoSocial || "",
        dataNascimento: owner.pessoa.dataNascimento || "",
        telefone: owner.pessoa.telefone || "",
        email: owner.pessoa.email || "",
      });
    }
  }, [owner, reset]);

  const handleUpdateCoOwner = async (formValues: any) => {
    const { ...ownerData } = formValues;

    const payload = [
      {
        ...ownerData,
        idProprietario: owner?.id,
        tipoProprietario: "PROPRIETARIO",
      },
    ];

    await linkOwner(payload, {
      onSuccess: () => {
        toast.success("Proprietário atualizado com sucesso!");
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_GET_FARM_BY_ID],
        });
      },
      onError: () => {
        toast.error("Erro ao atualizar proprietário.");
      },
    });
  };

  if (isLoading || !owner) {
    return <div>Carregando informações do proprietário...</div>;
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(handleUpdateCoOwner)}
    >
      <div className="grid grid-cols-3 gap-4">
        <Input
          name="nome"
          label="Nome/Razão Social"
          placeholder="Digite o Nome ou Razão Social"
          control={control}
        />
        <Input
          name="cpfCnpj"
          label="CPF/CNPJ"
          placeholder="Digite o CPF ou CNPJ"
          control={control}
          mask={maskCPFOrCNPJ}
        />
        <Input
          name="rgInscricaoSocial"
          label="RG/Inscrição Social"
          placeholder="Digite o RG ou Inscrição Social"
          control={control}
          mask={maskRG}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          name="dataNascimento"
          label="Data de Nascimento"
          placeholder="Digite a data de nascimento"
          control={control}
          mask={maskDate}
        />
        <Input
          name="telefone"
          label="Telefone"
          placeholder="Digite o telefone"
          control={control}
          mask={maskPhone}
        />
        <Input
          name="email"
          label="E-mail"
          placeholder="Digite o E-mail"
          control={control}
          type="email"
        />
      </div>

      <div className="flex items-center gap-2 justify-end pt-4">
        <Button className="w-[253px]" variant="green" type="submit">
          {isPending ? <FiLoader /> : "Atualizar"}
        </Button>
      </div>
    </form>
  );
};
