import Image from "next/image";
import * as React from "react";

import { Button } from "@/app/components/ui/button";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {
          <Image
            src="/img/logo.png"
            alt="Logo da Empresa"
            width={150}
            height={50}
            className="h-6 sm:h-8 md:h-10 lg:h-12 mr-2"
          />
        }

        <Button className="bg-[#52A532] hover:bg-green-700">Entrar</Button>
      </div>
    </header>
  );
}
