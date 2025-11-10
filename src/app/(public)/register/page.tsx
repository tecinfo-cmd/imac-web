"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { CheckboxComponent } from "@/components/ui/checkbox";

import { api } from "@/api";
import { yup } from "@/config/yup";
import { useCadastroUsuario } from "@/hooks/useCadastroUsuario/useCadastroUsuario";
import { LogoWhite } from "@/icons/LogoWhite";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserRoleStore } from "@/store/useUserRoleStore";
import { maskCep } from "@/utils/maskCEP";
import { maskCPF } from "@/utils/maskCPF";
import { maskDate } from "@/utils/maskDate";
import { maskPhone } from "@/utils/maskPhone";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";
import { setCookie } from "nookies";

function validarTelefone(telefone: string): boolean {
  const regex =
    /^(?:(?:\+|00)?(55)\s?)?(?:([1-9][1-9]))?\s?(?:9?\d{4})-?(\d{4})$/;
  return regex.test(telefone);
}

const schema = yup.object({
  nome: yup.string().required(),
  data: yup.string().required(),
  cpf: yup.string().required(),
  email: yup.string().email().required(),
  telefone: yup
    .string()
    .required()
    .test(
      "validar-telefone",
      "Número de telefone inválido",
      (value) => !!value && validarTelefone(value.replace(/\D/g, ""))
    ),
  cep: yup.string().required(),
  uf: yup.string().required("!"),
  logradouro: yup.string().required(),
  numero: yup.string().notRequired(),
  bairro: yup.string().required(),
  cidade: yup.string().required(),
  senha: yup
    .string()
    .required()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{11,}$/,
      "Senha com mínimo 11 caracteres, incluindo 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial."
    ),
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
  const { setUserData } = useAuthStore();
  const { setRole } = useUserRoleStore();
  const { cadastrar, isLoading } = useCadastroUsuario();
  const previousCepRef = useRef("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: "",
      data: "",
      cpf: "",
      email: "",
      telefone: "",
      cep: "",
      uf: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      senha: "",
      confirmacaoSenha: "",
      aceitouTermos: false,
    },
  });

  const cep = watch("cep");

  useEffect(() => {
    const fetchEndereco = async () => {
      const rawCEP = cep?.replace(/\D/g, "");
      if (rawCEP?.length === 8) {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${rawCEP}/json/`);
          const data = await res.json();

          if (data.erro) {
            setError("cep", {
              type: "manual",
              message: "CEP inválido.",
            });
            previousCepRef.current = rawCEP;
            return;
          }

          setValue("uf", data.uf || "");
          setValue("logradouro", data.logradouro || "");
          setValue("bairro", data.bairro || "");
          setValue("cidade", data.localidade || "");
          previousCepRef.current = "";
        } catch (error) {
          console.error("Erro ao buscar endereço:", error);
        }
      }
    };

    fetchEndereco();
  }, [cep, setValue, setError]);

  useEffect(() => {
    const rawCEP = cep?.replace(/\D/g, "");

    if (
      errors.cep &&
      rawCEP &&
      previousCepRef.current &&
      rawCEP !== previousCepRef.current
    ) {
      clearErrors("cep");
    }
  }, [cep, errors.cep, clearErrors]);

  const onSubmit = async (data: any) => {
    const formatDateToISO = (date: string) => {
      const [day, month, year] = date.split("/");
      return `${year}-${month}-${day}`;
    };
    try {
      setCookie(undefined, "email", data.email, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      const { accessToken } = await cadastrar({
        nome: data.nome,
        dataNascimento: formatDateToISO(data.data),
        cpf: data.cpf.replace(/\D/g, ""),
        email: data.email,
        telefone: data.telefone.replace(/\D/g, ""),
        cep: data.cep.replace(/\D/g, ""),
        uf: data.uf,
        logradouro: data.logradouro,
        numero: data.numero,
        bairro: data.bairro,
        cidade: data.cidade,
        senha: data.senha,
        confirmacaoSenha: data.confirmacaoSenha,
        aceitouTermos: data.aceitouTermos,
        tipo: "PF",
        roles: [
          {
            id: 3,
            nome: "PRODUTOR",
          },
        ],
      });

      setCookie(undefined, "@IMAC:T", accessToken, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      const userResponse = await api.get(`/usuario/email/${data.email}`);
      setUserData(userResponse.data);

      const decoded = jwtDecode<{ roles: string[] }>(accessToken);
      setRole(decoded.roles?.[0]?.toUpperCase());

      router.push("/enrollmentFee");
    } catch (error: any) {
      if (error.response) {
        console.error("Erro no cadastro:", error.response.data);
      } else {
        console.error("Erro no cadastro:", error);
      }
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
      <div className="relative z-10 bg-[#DFEEE5] w-full rounded-xl shadow-lg p-5 flex flex-col justify-center items-center">
        <h1 className="text-[#0A3503] text-center text-uppercase font-inter font-bold text-2xl leading-[37px] tracking-[0.1em] md:text-[24px] md:leading-[37px] mb-8 mt-5">
          ADESÃO AO PREM
        </h1>
        <p className="font-bold mb-4">
          PRODUTOR, FAÇA SEU CADASTRO PARA ACESSAR A PLATAFORMA PREM E CONCLUIR
          A SUA ADESÃO AO PROGRAMA!
        </p>
        <p className="font-bold mb-4">
          ATENÇÃO! ULTILIZE OS MESMOS DADOS INFORMADOS NA CONSULTA DE
          ELEGIBILIDADE!
        </p>
        <h2 className="font-bold mb-4 text-sm sm:text-base md:text-lg lg:text-xl">
          CADASTRO DE USUÁRIO
        </h2>
        <form
          className="flex flex-col gap-3 w-full max-w-[900px] mt-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="font-bold">DADOS PESSOAIS</p>
          <div className="flex flex-row gap-6 w-full">
            <div className="flex flex-col gap-3 flex-1">
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
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <Input
                name="email"
                label="E-mail"
                placeholder="Insira seu email"
                control={control}
              />

              <Input
                name="telefone"
                label="Celular"
                placeholder="Digite seu numero de telefone"
                control={control}
                mask={maskPhone}
              />
            </div>
          </div>

          <p className="font-bold mt-2">ENDEREÇO</p>
          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col flex-1 gap-3">
              <Input
                name="cep"
                label="CEP"
                placeholder="_ _ _ _ _ - _ _ _"
                control={control}
                mask={maskCep}
              />
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <Input
                name="cidade"
                label="Cidade"
                placeholder="nome do município"
                control={control}
              />
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <Input
                name="uf"
                label="Estado"
                placeholder="UF"
                control={control}
              />
            </div>
          </div>

          <div className="flex flex-row gap-4 w-full mt-3">
            <div className="flex flex-col flex-1 gap-3">
              <Input
                name="logradouro"
                label="Logradouro"
                placeholder="logradouro"
                control={control}
              />
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <Input
                name="numero"
                label="Número"
                placeholder="xxxx"
                control={control}
              />
            </div>
          </div>

          <div className="flex flex-row gap-4 w-full mt-3">
            <div className="flex flex-col flex-1 gap-3">
              <Input
                name="bairro"
                label="Bairro"
                placeholder="nome do bairro"
                control={control}
              />
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <Input
                name="complemento"
                label="Complemento"
                placeholder="informe um complemento"
                control={control}
              />
            </div>
          </div>

          <p className="font-bold mt-4">SENHA</p>
          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col flex-1 gap-3">
              <Input
                name="senha"
                type="password"
                label="Informe uma senha"
                placeholder="Digite sua nova senha"
                control={control}
              />
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <Input
                name="confirmacaoSenha"
                type="password"
                label="Informe novamente a senha"
                placeholder="Digite sua nova senha"
                control={control}
              />
            </div>
          </div>

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

          <Link href="/auth" className="font-bold text-center">
            JÁ TEM CADASTRO? FAÇA O LOGIN!
          </Link>
        </form>
      </div>
    </>
  );
}
