"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
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
        <Suspense
          fallback={
            <p className="text-center mt-10">Carregando confirmação...</p>
          }
        >
          <ConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    if (!id || !token) {
      setStatus("error");
      return;
    }

    fetch(
      " https://imac-api-homol-dhflh.ondigitalocean.app/imac/api/v1/elegibilidades/solicitacoes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, token }),
      }
    )
      .then((res) => {
        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [id, token]);

  if (status === "loading") {
    return <p className="text-center mt-10">Validando dados...</p>;
  }

  if (status === "error") {
    return (
      <p className="text-center text-red-600 mt-10">
        Erro ao confirmar o e-mail. Verifique o link ou tente novamente.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 md:p-20 gap-8 md:gap-16 w-full max-w-4xl">
      <Logo width={130} height={130} />
      <div className="flex flex-col self-start gap-6 md:gap-10">
        <h1 className="text-left text-xl md:text-2xl text-[#1F3F13] font-bold">
          Seu e-mail foi confirmado!
        </h1>
        <h1 className="text-left text-xl md:text-2xl text-[#1F3F13] font-bold">
          Agora vamos para a Etapa 2 - Análise socioambiental!
        </h1>
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
    </div>
  );
}
