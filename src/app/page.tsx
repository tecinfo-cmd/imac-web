"use client";

import Head from "next/head";
import { useState } from "react";
import { BsFileText } from "react-icons/bs";
import { TbLeaf } from "react-icons/tb";
import { TfiBookmarkAlt } from "react-icons/tfi";

import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import CARInput from "@/app/components/ui/carInput";
import { CheckboxComponent } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import MaskedInput from "@/app/components/ui/maskedInput";
import Step from "@/app/components/ui/step";

export default function Home() {
  const [isChecked, setIsChecked] = useState(true);

  const [carValue, setCarValue] = useState<string>("");

  const handleCarValueChange = (value: string) => {
    setCarValue(value);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <Head>
        <title>Imac</title>
        <meta
          name="description"
          content="Uma página construída com Next.js, TypeScript, Tailwind e Radix UI."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div id="form" className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-extrabold leading-[50px] tracking-[0%] sm:text-2xl md:text-3xl lg:text-4xl font-inter mb-2">
                Dê o primeiro passo: consulte a elegibilidade da sua fazenda
              </h2>
              <p className="text-base font-normal leading-[24.2px] tracking-[0%] sm:text-lg md:text-xl lg:text-2xl font-inter mb-2">
                Preencha os campos e inicie a sua consulta.
              </p>
              <p className="text-sm font-normal leading-[19.36px] tracking-[0%] sm:text-base md:text-lg lg:text-xl font-inter mb-4">
                Campos obrigatórios*
              </p>
              <form className="space-y-4 mt-2">
                <CARInput value={carValue} onChange={handleCarValueChange} />

                <div className="mb-4">
                  <CheckboxComponent onCheckedChange={handleCheckboxChange}>
                    Não sei o número CAR
                  </CheckboxComponent>
                </div>

                {!isChecked && (
                  <div className="space-y-4 mt-4">
                    <MaskedInput
                      mask="000.000.000-00"
                      label="CPF*"
                      type="text"
                      placeholder="Digite seu CPF"
                    />
                    <Input
                      label="UF"
                      type="text"
                      placeholder="Digite seu estado"
                    />
                  </div>
                )}

                <MaskedInput
                  mask="(00) 00000-0000"
                  label="telefone de contato (whatsapp)*"
                  type="tel"
                  placeholder="(XX) XXXXX - XXXX"
                />
                <Input
                  label="e-mail de contato*"
                  type="email"
                  placeholder="exemplo@dominio.com"
                />

                <Button type="submit" className="w-full">
                  Consultar
                </Button>
              </form>
            </div>
            <Card>
              <h2 className="text-xl font-bold text-center text-gray-800 border-b pb-2 mb-4">
                Etapas do credenciamento
              </h2>
              <Step
                icon={<BsFileText className="w-6 h-6 text-white" />}
                title="Preenchimento de formulário"
                description="Preencha o formulário de consulta informando o número CAR da propriedade ou, alternativamente, seu CPF/CNPJ e a localização da fazenda. Informe também o seu contato para receber o retorno."
              />
              <Step
                icon={<TbLeaf className="w-6 h-6 text-white" />}
                title="Análise socioambiental"
                description="O IMAC realizará uma análise socioambiental da propriedade e informará se ela está elegível para participar da reinserção no mercado."
              />
              <Step
                icon={<TfiBookmarkAlt className="w-6 h-6 text-white" />}
                title="Credenciamento"
                description="Se a sua propriedade for elegível, você receberá as instruções para seguir com o credenciamento no PREM."
              />
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
