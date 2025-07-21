import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiLoader } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";

import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import {
  QUERY_KEY_GET_FARM_BY_ID,
  useGetFarmById,
} from "@/hooks/useFarms/useGetFarmById";
import { useLinkOwnerToFarm } from "@/hooks/useFarms/useLinkOwnerToFarm";
import { maskCPFOrCNPJ } from "@/utils/maskCPFOrCNPJ";
import { maskDate } from "@/utils/maskDate";
import { maskPhone } from "@/utils/maskPhone";
import { maskRG } from "@/utils/maskRG";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface RegisterCoOwnerFormProps {
  farmId: number | undefined;
}

const coOwnerSchema = yup.object().shape({
  coOwners: yup.array().of(
    yup.object().shape({
      nome: yup.string().required("Nome é obrigatório"),
      cpfCnpj: yup.string().required("CPF/CNPJ é obrigatório"),
      rgInscricaoSocial: yup
        .string()
        .required("RG/Inscrição Social é obrigatório"),
      dataNascimento: yup.string().required("Data de nascimento é obrigatória"),
      telefone: yup.string().required("Telefone é obrigatório"),
      email: yup.string().email().required("E-mail é obrigatório"),
      setAsMainOwner: yup.boolean(),
    })
  ),
});

 const convertToAmericanDate = (date: string | null) => {
  if (!date) return "";
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

export const RegisterCoOwnerForm = ({ farmId }: RegisterCoOwnerFormProps) => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, register } = useForm({
    resolver: yupResolver(coOwnerSchema),
    defaultValues: {
      coOwners: [{ setAsMainOwner: false }],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "coOwners",
  });

  const { data: farmData } = useGetFarmById(farmId);
  const { mutateAsync: linkOwner, isPending } = useLinkOwnerToFarm(farmId!);

  const handleLinkCoOwner = async (data: any) => {
    const coOwners = data.coOwners.map(({ setAsMainOwner, ...owner }: any) => ({
      ...owner,
      dataNascimento: convertToAmericanDate(owner.dataNascimento),
      tipoProprietario: setAsMainOwner ? "PROPRIETARIO" : "COPROPRIETARIO",
    }));

    const isSettingNewMainOwner = coOwners.some(
      (owner: any) => owner.tipoProprietario === "PROPRIETARIO"
    );

    const existingMainOwner = farmData?.proprietarios?.find(
      (owner: any) => owner.tipoProprietario === "PROPRIETARIO"
    );

    const payload = [...coOwners];

    if (isSettingNewMainOwner && existingMainOwner) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = existingMainOwner;

      payload.push({
        ...rest,
        dataNascimento: convertToAmericanDate(rest.pessoa.dataNascimento),
        idProprietario: existingMainOwner.id,
        tipoProprietario: "COPROPRIETARIO",
      });
    }

    await linkOwner(payload, {
      onSuccess: () => {
        toast.success("Co-proprietário(s) vinculado(s) com sucesso!");
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_GET_FARM_BY_ID],
        });
      },
      onError: () => {
        toast.error("Erro ao vincular co-proprietário(s).");
      },
    });
  };

  useEffect(() => {
    if (farmData?.numeroProprietarios) {
      const count = farmData.numeroProprietarios;
      const initialFields = Array.from({ length: count }, () => ({
        setAsMainOwner: false,
        nome: "",
        cpfCnpj: "",
        rgInscricaoSocial: "",
        dataNascimento: "",
        telefone: "",
        email: "",
      }));

      replace(initialFields);
    }
  }, [farmData?.numeroProprietarios, replace]);

  return (
    <form
      className="flex flex-col gap-4 p-4"
      onSubmit={handleSubmit(handleLinkCoOwner)}
    >
      <div className="flex flex-col items-start gap-2 pt-4">
        <h2 className="text-[#1A6415] text-xl font-bold">
          Cadastro de Co-proprietários
        </h2>
        <div className="bg-[#FFFBE6] text-[#1F1F1C] border border-[#FFE58F] rounded-md p-3 flex gap-2 text-sm">
          <GoAlertFill size={16} color="#ffbc42" />A quantidade de formulários
          exibidos corresponde ao número de proprietários informados, e todos
          devem ser preenchidos antes de continuar.
        </div>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 border-b pb-4 rounded-md">
          <h3 className="text-[#1A6415] font-semibold text-base">
            Co-proprietário {index + 1}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <Input
              name={`coOwners.${index}.nome`}
              label="Nome/Razão Social"
              placeholder="Digite o Nome ou Razão Social"
              control={control}
              className="w-[537px]"
            />
            <Input
              name={`coOwners.${index}.cpfCnpj`}
              label="CPF/CNPJ"
              placeholder="Digite o CPF ou CNPJ"
              control={control}
              mask={maskCPFOrCNPJ}
            />
            <Input
              name={`coOwners.${index}.rgInscricaoSocial`}
              label="RG/Inscrição Social"
              placeholder="Digite o RG ou Inscrição Social"
              control={control}
              mask={maskRG}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              name={`coOwners.${index}.dataNascimento`}
              label="Data de Nascimento"
              placeholder="Digite a data de nascimento"
              control={control}
              mask={maskDate}
            />
            <Input
              name={`coOwners.${index}.telefone`}
              label="Telefone"
              placeholder="Digite o telefone"
              control={control}
              mask={maskPhone}
            />
            <Input
              name={`coOwners.${index}.email`}
              label="E-mail"
              placeholder="Digite o E-mail"
              control={control}
              type="email"
            />
            <div className="col-span-3">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-[#21801A]"
                  {...register(`coOwners.${index}.setAsMainOwner`)}
                />
                <span>Definir como Proprietário Principal</span>
              </label>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2 justify-end pt-4">
        <Button className="w-[253px]" variant="green" type="submit">
          {isPending ? <FiLoader /> : "Vincular"}
        </Button>
      </div>
    </form>
  );
};
