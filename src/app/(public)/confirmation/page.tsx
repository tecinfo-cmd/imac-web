import { BsFileText } from "react-icons/bs";
import { TbLeaf } from "react-icons/tb";
import { TfiBookmarkAlt } from "react-icons/tfi";

import { Card } from "@/components/ui/card";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import Step from "@/components/ui/step";

import { Logo } from "@/icons/Logo";

export default function Confirmation() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center p-10 md:p-20 gap-8 md:gap-16 w-full max-w-4xl">
          <Logo />
          <div className="flex flex-col self-start gap-6 md:gap-10">
            <h1 className="text-left text-xl md:text-2xl text-[#1F3F13] font-bold">
              Seu e-mail foi confirmado!
            </h1>
            <h1 className="text-left text-xl md:text-2xl text-[#1F3F13] font-bold">
              Agora vamos para a Etapa 2 - Análise socioambiental!
            </h1>
          </div>
        </div>
        <Card className="w-full max-w-2xl h-auto p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-bold text-center text-gray-800 border-b pb-2 mb-4">
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
      </main>
      <Footer />
    </>
  );
}
