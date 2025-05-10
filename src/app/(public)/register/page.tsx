"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { CheckboxComponent } from "@/components/ui/checkbox";

import { yup } from "@/config/yup";
import { useCadastroUsuario } from "@/hooks/useCadastroUsuario/useCadastroUsuario";
import { LogoGreen } from "@/icons/LogoGreen";
import { LogoWhite } from "@/icons/LogoWhite";
import { maskCPF } from "@/utils/maskCPF";
import { maskDate } from "@/utils/maskDate";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  nome: yup.string().required(),
  data: yup.string().required(),
  cpf: yup.string().required(),
  email: yup.string().email().required(),
  senha: yup.string().required(),
  confirmacaoSenha: yup
    .string()
    .required()
    .oneOf([yup.ref("senha")], "As senhas não coincidem"),
  aceitouTermos: yup
    .bool()
    .oneOf([true], "Você deve aceitar os termos para continuar."),
});

export default function Register() {
  const router = useRouter();
  const { cadastrar, isLoading } = useCadastroUsuario();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: "",
      data: "",
      cpf: "",
      email: "",
      senha: "",
      confirmacaoSenha: "",
      aceitouTermos: false,
    },
  });

  const onSubmit = async (data: any) => {
    const formatDateToISO = (date: string) => {
      const [day, month, year] = date.split("/");
      return `${year}-${month}-${day}`;
    };
    try {
      await cadastrar({
        nome: data.nome,
        dataNascimento: formatDateToISO(data.data),
        cpf: data.cpf.replace(/\D/g, ""),
        email: data.email,
        senha: data.senha,
        confirmacaoSenha: data.ConfirmacaoSenha,
        aceitouTermos: data.aceitouTermos,
      });

      router.push("/validVoucher");
    } catch (error) {
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <>
      <header className="w-full h-[120px] bg-[#23811C] flex items-center p-4 md:p-6 lg:p-8">
        <LogoWhite width={87} height={87} />
        <p className="text-[#ffffff] ml-4 sm:text-[20px] md:text-[22px] lg:text-[23px]">
          Programa de Reinserção <br /> e Monitoramento
        </p>
      </header>
      <div className="bg-[#165312] min-h-screen w-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <LogoGreen width={1300} height={1300} />
        </div>
        <div className="relative z-10 bg-[#DFEEE5] w-full max-w-[400px] rounded-xl shadow-lg p-5 flex flex-col justify-center items-center">
          <h1 className="text-[#0A3503] text-center text-uppercase font-inter font-bold text-2xl leading-[37px] tracking-[0.1em] md:text-[24px] md:leading-[37px] mb-8 mt-5">
            CADASTRO
          </h1>

          <form
            className="flex flex-col gap-3 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              name="nome"
              label="Nome Completo"
              placeholder="Insira seu nome completo"
              control={control}
            />

            <Input
              name="data"
              type="text"
              label="Data de Nascimento"
              placeholder="dd/mm/aaaa"
              mask={maskDate}
              control={control}
            />

            <Input
              name="cpf"
              type="text"
              label="CPF"
              placeholder="000.000.000-00"
              mask={maskCPF}
              control={control}
            />

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
              placeholder="Digite sua nova senha"
              control={control}
            />

            <Input
              name="confirmacaoSenha"
              type="password"
              label="Confirmar senha"
              placeholder="Digite sua nova senha"
              control={control}
            />

            <Controller
              name="aceitouTermos"
              control={control}
              render={({ field }) => (
                <CheckboxComponent
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="w-[17px] h-[17px] border-[1px] border-[#666666] shadow-[inset_0px_0px_5px_2px_rgba(0,0,0,0.2)]"
                >
                  Li e concordo com os termos de uso e política de privacidade.
                </CheckboxComponent>
              )}
            />
            {errors.aceitouTermos && (
              <p className="text-[#F12929] font-light text-xs mt-1">
                {errors.aceitouTermos.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full md:w-[130px] self-center"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
