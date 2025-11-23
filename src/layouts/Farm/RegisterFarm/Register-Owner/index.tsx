"use client";
import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/Input";

import { maskCPFOrCNPJ } from "@/utils/maskCPFOrCNPJ";
import { formatDateToISO } from "@/utils/maskDate";
import { maskPhone } from "@/utils/maskPhone";
import { maskRG } from "@/utils/maskRG";
import { yupResolver } from "@hookform/resolvers/yup";

import { ownerSchema } from "./schema";

export interface RegisterOwnerForm {
  nome: string;
  cpfCnpj: string;
  rgInscricaoSocial: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  setAsMainOwner?: boolean;
}

export type RegisterOwnerRef = {
  validate: () => Promise<{
    isValid: boolean;
    values: RegisterOwnerForm;
    errors: any;
  }>;
};

export interface RegisterOwnerProps {
  index: number;
  onOwnerChange: (data: RegisterOwnerForm) => void;
  disabled?: boolean;
  initialData?: RegisterOwnerForm;
}

const RegisterOwnerComponent = (
  { index, onOwnerChange, disabled, initialData }: RegisterOwnerProps,
  ref: React.ForwardedRef<RegisterOwnerRef>
) => {
  const {
    control,
    watch,
    register,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<RegisterOwnerForm>({
    resolver: yupResolver(ownerSchema),
    defaultValues: initialData,
  });

  useImperativeHandle(ref, () => ({
    validate: async () => {
      const isValid = await trigger();
      return {
        isValid,
        values: getValues(),
        errors,
      };
    },
  }));

  useEffect(() => {
    const subscription = watch((value) => {
      onOwnerChange({
        nome: value.nome ?? "",
        cpfCnpj: value.cpfCnpj ?? "",
        rgInscricaoSocial: value.rgInscricaoSocial ?? "",
        dataNascimento: value.dataNascimento ?? "",
        telefone: value.telefone ?? "",
        email: value.email ?? "",
        setAsMainOwner: value.setAsMainOwner,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onOwnerChange]);

  return (
    <form className="grid grid-cols-3 gap-6 p-4">
      <div className="col-span-3 mb-2">
        <span className="font-bold text-lg">Proprietário {index + 1}</span>
      </div>
      <Input
        name="nome"
        label="Nome completo"
        placeholder="Digite o seu Nome ou Razão Social"
        control={control}
        error={errors.nome?.message}
        disabled={disabled}
      />
      <Input
        name="cpfCnpj"
        label="CPF/CNPJ"
        placeholder="___.___.___-__"
        mask={maskCPFOrCNPJ}
        control={control}
        error={errors.cpfCnpj?.message}
        disabled={disabled}
      />
      <Input
        name="rgInscricaoSocial"
        label="RG/Inscrição Social"
        placeholder="00.000.000-0"
        mask={maskRG}
        control={control}
        error={errors.rgInscricaoSocial?.message}
        disabled={disabled}
      />
      <Input
        name="dataNascimento"
        label="Data de nascimento/Abertura"
        placeholder="dd/mm/aaaa"
        control={control}
        mask={formatDateToISO}
        error={errors.dataNascimento?.message}
        disabled={disabled}
      />
      <Input
        name="telefone"
        label="Telefone"
        placeholder="(00) 0 0000-0000"
        mask={maskPhone}
        control={control}
        error={errors.telefone?.message}
        disabled={disabled}
      />
      <Input
        name="email"
        label="E-mail"
        placeholder="Digite o seu E-mail"
        type="email"
        control={control}
        error={errors.email?.message}
        disabled={disabled}
      />
      <div className="col-span-3">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-[#21801A]"
            {...register("setAsMainOwner")}
            disabled={disabled}
          />
          <span>Definir como Proprietário Principal</span>
        </label>
      </div>
    </form>
  );
};

export const RegisterOwner = forwardRef(RegisterOwnerComponent);
