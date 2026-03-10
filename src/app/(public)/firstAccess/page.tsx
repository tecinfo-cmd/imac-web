"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { FiLoader } from "react-icons/fi";

import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import { useFirstAccess } from "@/hooks/useFirstAccess/useFirstAccess";
import { Logo } from "@/icons/Logo";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

const schema = yup.object({
  senha: yup
    .string()
    .required()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{11,}$/,
      "Senha com mínimo 11 caracteres, incluindo 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial."
    ),
  confirmarSenha: yup
    .string()
    .required()
    .oneOf([yup.ref("senha")], "As senhas não coincidem"),
});

function FirstAccessInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const { firstAccess } = useFirstAccess();

  const handleSubmitReset = async (data: any) => {
    const result = await firstAccess(data.senha, data.confirmarSenha, token);
    reset();
    toast(result.message);
    if (result.success) {
      router.push("/auth");
    }
  };

  return (
    <div className="bg-[#DFEEE5] min-h-screen flex flex-col md:grid md:grid-cols-[60%_40%] items-center justify-center place-items-center">
      <div className="bg-[#1A6415] bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_44%,_rgba(0,0,0,0.38)_100%)] w-full h-full rounded-r-full flex flex-col items-center justify-center p-4">
        <div className="bg-[#DFEEE5] w-full max-w-[400px] rounded-xl shadow-lg p-5 flex flex-col justify-center items-center">
          <Logo width={135} height={150} />

          <form
            className="flex flex-col gap-3 w-full"
            onSubmit={handleSubmit(handleSubmitReset)}
          >
            <Input
              name="senha"
              label="Senha"
              type="password"
              placeholder="Insira senha"
              control={control}
            />
            <Input
              name="confirmarSenha"
              label="Confirmar senha"
              type="password"
              placeholder="Confirme senha"
              control={control}
            />

            <Button type="submit" className="w-full md:w-[130px] self-center">
              {isSubmitting ? <FiLoader className="animate-spin" /> : "Salvar"}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center flex-col gap-4 text-[#175912] h-auto md:h-[50vh] p-6">
        <h1 className="text-4xl md:text-5xl font-bold">PREM</h1>
        <Logo />
        <h1 className="text-2xl md:text-3xl text-center leading-snug">
          Programa de Reinserção <br />e Monitoramento
        </h1>
      </div>
    </div>
  );
}

export default function FirstAccess() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <FirstAccessInner />
    </Suspense>
  );
}
