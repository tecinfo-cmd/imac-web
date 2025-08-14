"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiLoader } from "react-icons/fi";

import { Input } from "@/components/Input";
import { TableInformation } from "@/components/TableInformation";
import { TechnicalResponsibleDisplay } from "@/components/TechnicalResponsibleDisplay";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import { useCreateTechnicalResponsible } from "@/hooks/useEnvironmentalAnalysis/useCreateTechnicalResponsible";
import { useGetTechnicalResponsible } from "@/hooks/useEnvironmentalAnalysis/useGetTechnicalResponsible";
import { useTechnicalResponsibleContestationStore } from "@/store/useTechnicalResponsibleContestationStore";
import { maskCep } from "@/utils/maskCEP";
import { maskCPF } from "@/utils/maskCPF";
import { maskPhone } from "@/utils/maskPhone";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

const technicalResponsibleSchema = yup.object({
  cpf: yup.string().required("CPF é obrigatório"),
  nome: yup.string().required("Nome é obrigatório"),
  profissao: yup.string().required("Profissão é obrigatória"),
  registroCrea: yup.string().required("Registro CREA é obrigatório"),
  telefone: yup.string().required("Telefone é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  endereco: yup.object({
    cep: yup.string().required("CEP é obrigatório"),
    longitude: yup.number().default(0),
    latitude: yup.number().default(0),
    municipio: yup.string().required("Município é obrigatório"),
    estado: yup.string().required("Estado é obrigatório"),
    logradouro: yup.string().required("Logradouro é obrigatório"),
    complemento: yup.string().optional().default(""),
  }),
});

type TechnicalResponsibleFormData = yup.InferType<
  typeof technicalResponsibleSchema
>;

export const TechnicalResponsibleSection = () => {
  const [currentCpf, setCurrentCpf] = useState<string>("");

  const { mutateAsync: createTechnicalResponsible, isPending } =
    useCreateTechnicalResponsible();
  const { technicalResponsible, setTechnicalResponsible } =
    useTechnicalResponsibleContestationStore();

  const { data: existingTechnicalResponsible, isLoading: isLoadingExisting } =
    useGetTechnicalResponsible(currentCpf || undefined);

  const { control, handleSubmit, watch } =
    useForm<TechnicalResponsibleFormData>({
      resolver: yupResolver(technicalResponsibleSchema),
      defaultValues: {
        cpf: "",
        nome: "",
        profissao: "",
        registroCrea: "",
        telefone: "",
        email: "",
        endereco: {
          cep: "",
          longitude: 0,
          latitude: 0,
          municipio: "",
          estado: "",
          logradouro: "",
          complemento: "",
        },
      },
    });

  const watchedCpf = watch("cpf");

  useEffect(() => {
    if (watchedCpf && watchedCpf.length === 14) {
      setCurrentCpf(watchedCpf.replace(/\D/g, ""));
    }
  }, [watchedCpf]);

  useEffect(() => {
    if (existingTechnicalResponsible?.data?.[0] && !technicalResponsible) {
      const existingData = existingTechnicalResponsible.data[0];
      setTechnicalResponsible({
        id: existingData.id,
        cpf: existingData.cpf,
        nome: existingData.nome,
        profissao: existingData.profissao,
        registroCrea: existingData.registroCrea,
        telefone: existingData.telefone,
        email: existingData.email,
        endereco: {
          id: existingData.endereco.id,
          cep: existingData.endereco.cep,
          longitude: existingData.endereco.longitude,
          latitude: existingData.endereco.latitude,
          municipio: existingData.endereco.municipio,
          estado: existingData.endereco.estado,
          logradouro: existingData.endereco.logradouro,
          complemento: existingData.endereco.complemento,
        },
      });
    }
  }, [
    existingTechnicalResponsible,
    technicalResponsible,
    setTechnicalResponsible,
  ]);

  const onSubmit = async (data: TechnicalResponsibleFormData) => {
    await createTechnicalResponsible(data, {
      onSuccess: (response) => {
        setTechnicalResponsible(response);
        toast.success("Responsável técnico salvo com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao salvar responsável técnico. Tente novamente.");
      },
    });
  };

  if (technicalResponsible) {
    return (
      <TechnicalResponsibleDisplay
        technicalResponsible={technicalResponsible}
      />
    );
  }

  if (isLoadingExisting && currentCpf) {
    return (
      <TableInformation.Section
        title="Informações do Responsável Técnico"
        showArrow
        defaultOpen={false}
      >
        <TableInformation.Row columnsPerRow={1}>
          <TableInformation.Column>
            <div className="flex justify-center items-center py-8">
              <FiLoader className="animate-spin text-2xl text-green-600" />
              <span className="ml-2 text-gray-600">
                Carregando dados existentes...
              </span>
            </div>
          </TableInformation.Column>
        </TableInformation.Row>
      </TableInformation.Section>
    );
  }

  return (
    <TableInformation.Section
      title="Informações do Responsável Técnico"
      showArrow
      defaultOpen
    >
      <TableInformation.Row columnsPerRow={1}>
        <TableInformation.Column>
          <TableInformation.Title>
           Informe os dados do responsável técnico, exceto em casos de Autorização de Supressão.
          </TableInformation.Title>
          <TableInformation.Value>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="cpf"
                    label="CPF"
                    placeholder="___.___.___-__"
                    control={control}
                    mask={maskCPF}
                  />
                  <Input
                    name="nome"
                    label="Nome"
                    placeholder="Digite o seu Nome ou Razão Social"
                    control={control}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="profissao"
                    label="Profissão"
                    placeholder="Digite sua profissão"
                    control={control}
                  />
                  <Input
                    name="registroCrea"
                    label="Registro CREA"
                    placeholder="Digite o registro CREA"
                    control={control}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    name="telefone"
                    label="Telefone"
                    placeholder="(00) 0 0000-0000"
                    control={control}
                    mask={maskPhone}
                  />

                  <Input
                    name="email"
                    label="E-mail"
                    placeholder="Digite seu email"
                    control={control}
                  />

                  <Input
                    name="endereco.cep"
                    label="CEP"
                    placeholder="_____-___"
                    control={control}
                    mask={maskCep}
                  />
                </div>

                <Input
                  name="endereco.logradouro"
                  label="Logradouro*"
                  placeholder="Digite o Logradouro"
                  control={control}
                />

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    name="endereco.complemento"
                    label="Complemento (Opcional)"
                    placeholder="Digite o complemento"
                    control={control}
                  />

                  <Input
                    name="endereco.municipio"
                    label="Município"
                    placeholder="Digite o município"
                    control={control}
                  />

                  <Input
                    name="endereco.estado"
                    label="UF"
                    placeholder="Digite a UF"
                    control={control}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="submit"
                  disabled={isPending}
                  variant="green"
                  className="w-[253px]"
                >
                  {isPending ? (
                    <FiLoader className="animate-spin" />
                  ) : technicalResponsible ? (
                    "Atualizar"
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </div>
            </form>
          </TableInformation.Value>
        </TableInformation.Column>
      </TableInformation.Row>
    </TableInformation.Section>
  );
};
