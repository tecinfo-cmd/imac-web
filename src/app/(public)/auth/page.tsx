"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FiLoader } from "react-icons/fi";

import { Input } from "../../../components/Input";
import { Button } from "../../../components/ui/button";

import { yup } from "@/config/yup";
import { useAuthContext } from "@/context";
import { SignInCredentials } from "@/hooks/useAuth/useSignIn";
import { Logo } from "@/icons/Logo";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  email: yup.string().email().required(),
  senha: yup.string().required(),
});

export default function Auth() {
  const { handleSignIn, isPending } = useAuthContext();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitSignIn = async (data: SignInCredentials) => {
    await handleSignIn(data);
  };

  return (
    <div className="bg-[#DFEEE5] min-h-screen flex flex-col md:grid md:grid-cols-[60%_40%] items-center justify-center place-items-center">
      <div className="bg-[#1A6415] bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_44%,_rgba(0,0,0,0.38)_100%)] w-full h-full rounded-r-full flex items-center justify-center p-4">
        <div className="bg-[#DFEEE5] w-full max-w-[400px] rounded-xl shadow-lg p-5 flex flex-col justify-center items-center">
          <div className="flex justify-center">
          <Logo width={135} height={150} />
          <h1 className="text-justify text-base md:text-lg text-[#1A3380] font-bold mt-9">
           Programa de <br /> Reinserção e <br /> Monitoramento
        </h1>
        </div>
          <form
            className="flex flex-col gap-3 w-full"
            onSubmit={handleSubmit(handleSubmitSignIn)}
          >
            <Input
              name="email"
              label="E-mail"
              placeholder="Insira seu email"
              control={control}
            />
            <Input
              name="senha"
              type="password"
              label="Senha"
              placeholder="Insira sua senha"
              control={control}
            />
            <Link
              href="/resetPassword"
              className="text-end text-[#21801A] mr-4 mb-4 text-sm"
            >
              Esqueceu a senha?
            </Link>
            <Button type="submit" className="w-full md:w-[130px] self-center">
              {isPending ? <FiLoader /> : "Entrar"}
            </Button>
          </form>
          <span className="text-center text-[#21801A] mt-4 text-sm md:text-base">
            Não possui uma conta?
            <br />
            <Link href="/register" className="underline">
              Cadastra-se
            </Link>
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center flex-col gap-4 text-[#175912] h-auto md:h-[50vh] p-6">
        <h1 className="text-4xl md:text-5xl font-bold">PREM</h1>
        <Logo />
        <h1 className="text-2xl md:text-3xl text-center leading-snug text-[#1A3380] font-bold">
           Programa de <br /> Reinserção e <br /> Monitoramento
        </h1>
      </div>
    </div>
  );
}
