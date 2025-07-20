"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { Input } from "@/components/Input";
import Selector from "@/components/Selector/selector";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import { useBuyVoucher } from "@/hooks/useBuyVoucher/useBuyVoucher";
import { LogoGreen } from "@/icons/LogoGreen";
import { LogoWhite } from "@/icons/LogoWhite";
import { maskCard, maskCVV, maskValidade } from "@/utils/maskCard";
import { maskCep } from "@/utils/maskCEP";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  nomeCompleto: yup.string().required(),
  numeroCartao: yup.string().required("Obrigatório"),
  validade: yup.string().required("!"),
  CVV: yup.string().required("!"),
  cep: yup.string().required("!"),
  pais: yup.string().required("!"),
  endereco: yup.string().required(),
  numero: yup.string().required("!"),
  complemento: yup.string().required(),
  bairro: yup.string().required("!"),
  cidade: yup.string().required("!"),
  selecionarPropriedade: yup.string().required("!"),
});

export default function BuyVoucher() {
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nomeCompleto: "",
      numeroCartao: "",
      validade: "",
      CVV: "",
      cep: "",
      pais: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      selecionarPropriedade: "",
    },
  });

  const { control, setValue, handleSubmit, reset } = methods;

  const cep = useWatch({
    control,
    name: "cep",
  });

   useEffect(() => {
    void buscarPropriedadesSalvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchEndereco = async () => {
      const rawCEP = cep?.replace(/\D/g, "");
      if (rawCEP?.length === 8) {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${rawCEP}/json/`);
          const data = await res.json();

          if (data.erro) {
            console.error("CEP inválido.");
            return;
          }

          setValue("endereco", data.logradouro || "");
          setValue("bairro", data.bairro || "");
          setValue("cidade", data.localidade || "");
          setValue("pais", "Brasil");
        } catch (error) {
          console.error("Erro ao buscar endereço:", error);
        }
      }
    };

    fetchEndereco();
  }, [cep, setValue]);

  const {
    pagar,
    isLoading,
    userData,
    loadUserData,
    isLoadingUserData,
    propriedades,
    buscarPropriedadesSalvas,
  } = useBuyVoucher();
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (!isLoadingUserData && !userData) {
      router.push("/register");
    }
  }, [isLoadingUserData, userData, router]);

  if (isLoadingUserData) {
    return <p>Carregando seus dados...</p>;
  }

  if (!userData) {
    return null;
  }

  const onSubmit = async (data: any) => {
    try {
      const result = await pagar(data);
      console.log("Pagamento realizado com sucesso:", result);
    } catch (err) {
      console.error("Falha no pagamento:", err);
    } finally {
      reset();
    }
  };

  return (
    <FormProvider {...methods}>
      <header className="w-full h-[120px] bg-[#23811C] flex items-center p-4 md:p-6 lg:p-8">
        <LogoWhite width={87} height={87} />
        <p className="text-[#ffffff] ml-4 sm:text-[20px] md:text-[22px] lg:text-[23px]">
          Programa de Reinserção <br /> e Monitoramento
        </p>
      </header>
      <div className="bg-[#ffffff] min-h-screen w-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 right-[-1500] flex items-center justify-center opacity-20">
          <LogoGreen width={900} height={900} />
        </div>
        <div className="relative z-10 bg-[#DFEEE5] w-full max-w-[400px] rounded-xl shadow-lg p-5 flex flex-col justify-center items-center">
          <h1 className="text-[#0A3503] text-center text-uppercase font-inter font-bold text-2xl leading-[37px] tracking-[0.1em] md:text-[24px] md:leading-[37px] mb-8 mt-5">
            COMPRAR VOUCHER
          </h1>

          <div className="flex items-center w-full mb-4">
            <div className="flex-1 border-t border-[#CAC4D0] border-solid"></div>
            <span className="px-4 text-lg text-[#0A3503]">
              Cartão de Crédito
            </span>
            <div className="flex-1 border-t border-[#CAC4D0] border-solid"></div>
          </div>

          <form
            className="flex flex-col gap-3 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Selector
              name="select"
              label="Selecionar propriedade"
              placeholder="Selecione propriedade"
              control={control}
              options={propriedades.map((prop) => ({
                value: String(prop.id),
                label: `${prop.nomePropriedade} - ${prop.carFederal}`,
              }))}
            />
            <Input
              name="nomeCompleto"
              label="Nome Completo"
              placeholder="Insira seu nome completo"
              control={control}
            />
            <div className="w-[260px] flex flex-col gap-3">
              <Input
                name="numeroCartao"
                type="text"
                label="Número do cartão de crédito"
                placeholder="_ _ _ _  _ _ _ _  _ _ _ _  _ _ _ _"
                mask={maskCard}
                control={control}
              />
            </div>
            <div className="flex flex-row items-center gap-3">
              <div className="flex flex-col w-[115px] gap-3">
                <Input
                  name="validade"
                  type="text"
                  label="Validade"
                  placeholder="mm/aaaa"
                  mask={maskValidade}
                  control={control}
                />
              </div>

              <div className="flex flex-col w-[115px] gap-3 ml-4">
                <Input
                  name="CVV"
                  label="CVV"
                  placeholder="---"
                  control={control}
                  mask={maskCVV}
                />
              </div>
            </div>

            <div className="flex items-center w-full mb-4">
              <div className="flex-1 border-t border-[#CAC4D0] border-solid"></div>
              <span className="px-4 text-lg text-[#0A3503]">
                Endereço de Cobrança
              </span>
              <div className="flex-1 border-t border-[#CAC4D0] border-solid"></div>
            </div>
            <div className="flex flex-row gap-4 items-start">
              <div className="flex flex-col w-[130px] gap-3">
                <Input
                  name="cep"
                  type="text"
                  label="CEP"
                  placeholder="_ _ _ _ _ - _ _ _"
                  control={control}
                  mask={maskCep}
                />
              </div>
              <div className="flex flex-col w-[130px] gap-3 ml-4">
                <Input
                  name="pais"
                  label="País"
                  placeholder="País"
                  control={control}
                />
              </div>
            </div>
            <Input
              name="endereco"
              type="text"
              label="Endereço"
              placeholder="Digite seu endereço"
              control={control}
            />
            <div className="flex flex-row gap-4 items-start">
              <div className="flex flex-col w-[68px] gap-3">
                <Input
                  name="numero"
                  type="text"
                  label="Número"
                  placeholder=""
                  control={control}
                />
              </div>
              <div className="flex flex-col w-[260px] gap-3 ml-4">
                <Input
                  name="complemento"
                  type="text"
                  label="Complemento"
                  placeholder="(Opicional)"
                  control={control}
                />
              </div>
            </div>
            <div className="flex flex-row gap-4 items-start">
              <div className="flex flex-col w-[130px] gap-3">
                <Input
                  name="bairro"
                  label="Bairro"
                  placeholder="Bairro"
                  control={control}
                />
              </div>
              <div className="flex flex-col w-[130px] gap-3 ml-4 mb-4">
                <Input
                  name="cidade"
                  label="Cidade"
                  placeholder="Cidade"
                  control={control}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full md:w-[180px] self-center"
              disabled={isLoading}
            >
              {isLoading ? "Finalizando..." : "Finalizar Compra"}
            </Button>
          </form>
          <span className="text-center text-[#21801A] mt-4 text-sm md:text-base">
            <Link href="/" className="underline">
              Voltar ao início
            </Link>
          </span>
        </div>
      </div>
    </FormProvider>
  );
}
