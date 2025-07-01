"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { FiLoader } from "react-icons/fi";

import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import { useResetPassword } from "@/hooks/useResetPassword/useResetPassword";
import { Logo } from "@/icons/Logo";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

const schema = yup.object({
  email: yup.string().email().required(),
});

type FormValues = {
  email: string;
};

export default function ResetPassword() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { sendResetEmail } = useResetPassword();

  const handleSubmitReset = async (data: FormValues) => {
    const { message } = await sendResetEmail(data.email);
    toast(message);
    reset();
  };

  return (
    <div className="bg-[#DFEEE5] min-h-screen flex flex-col md:grid md:grid-cols-[60%_40%] items-center justify-center place-items-center">
      <div className="bg-[#1A6415] bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_44%,_rgba(0,0,0,0.38)_100%)] w-full h-full rounded-r-full flex flex-col items-center justify-center p-4">
        <h1 className="text-center text-[#ffffff] mb-10 text-2xl md:text-3xl font-bold">
          RECUPERAR SENHA
        </h1>

        <div className="bg-[#DFEEE5] w-full max-w-[400px] rounded-xl shadow-lg p-5 flex flex-col justify-center items-center">
          <Logo width={135} height={150} />

          <form
            className="flex flex-col gap-3 w-full"
            onSubmit={handleSubmit(handleSubmitReset)}
          >
            <p className="text-center text-[#21801A] mt-4 text-sm md:text-base">
              Informe seu e-mail cadastrado abaixo e enviaremos um link para
              redefinição da senha.
            </p>
            <Input
              name="email"
              placeholder="Insira seu email"
              control={control}
            />

            <Button type="submit" className="w-full md:w-[130px] self-center">
              {isSubmitting ? <FiLoader /> : "Enviar"}
            </Button>
          </form>
          <span className="text-center text-[#21801A] mt-4 text-sm md:text-base">
            <Link href="/auth" className="underline">
              Voltar à tela de login
            </Link>
          </span>
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
