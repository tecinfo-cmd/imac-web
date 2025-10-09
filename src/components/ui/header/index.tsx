"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();

  return (
    <header className="w-full bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="relative w-[120px] h-[40px] sm:w-[140px] sm:h-[45px] md:w-[150px] md:h-[50px] lg:w-[180px] lg:h-[60px]">
          <Image
            src="/img/logo.png"
            alt="Logo da Empresa"
            fill
            sizes="w-30 h-10 sm:w-35 sm:h-3 md:w-37 md:h-3 lg:w-45 lg:h-4"
            className="object-contain"
          />
        </div>

        <Button
          onClick={() => router.push("/auth")}
          className="bg-[#52A532] hover:bg-green-700"
        >
          Entrar
        </Button>
      </div>
    </header>
  );
}
