"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";

import { Logo } from "@/icons/Logo";
import { LogoSideName } from "@/icons/LogoSideName";

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
      `https://imac-api-homol-dhflh.ondigitalocean.app/imac/api/v1/agrotools/solicitacoes/${id}/validar?token=${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          if (id) setStatus("success");
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
      <LogoSideName width={400} height={130} />
      <div className="flex flex-col items-center gap-6 md:gap-10">
        <h1 className="text-left text-xl md:text-2xl text-[#1F3F13] font-bold">
          Seu e-mail foi confirmado com sucesso!
        </h1>
        <h3 className="text-left text-base md:text-lg text-[#2F3F13] font-bold">
          Sua propriedade já está em análise! Fique tranquilo(a), você receberá
          um novo e-mail com o resultado da consulta de Elegibilidade em até 24
          horas.
        </h3>
      </div>
      <div>
        <h3 className="text-left text-base md:text-lg text-[#2F3F13] font-bold">
          Saiba mais...
        </h3>
        <Card className="w-full max-w-2xl h-auto p-6 md:p-8 pt!-0">
          <h2 className="text-lg md:text-xl font-bold text-center mb-4">
            Entenda as 12 Etapas do Programa de Reinserção e Monitoramento.
          </h2>
          <div className="flex justify-center">
            <Logo width={130} height={130} />
          </div>
          <div className="flex justify-center">
            <p className="text-center text-base md:text-lg text-[#1A3380] font-bold">
              Programa de <br /> Reinserção e <br /> Monitoramento
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
