import Image from "next/image";
import Link from "next/link";

import { Button } from "@/app/components/ui/button";

interface HeroProps {
  topImage: string;
  title: string;
  text: string;
}

const HeroSection: React.FC<HeroProps> = () => {
  return (
    <section
      className="relative w-full h-[500px] md:h-[500px] flex items-center justify-start px-6 md:px-12 bg-cover bg-center"
      style={{ backgroundImage: "url('/img/main.jpeg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A2510]/95 via-[#1A2510]/80 to-transparent"></div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 md:w-32 md:h-32">
        <Image
          src="/img/image_home.png"
          alt="Top Image"
          fill
          sizes="w-24 h-24 md:w-32 md:h-32"
          style={{ objectFit: "contain" }}
        />
      </div>

      <div className="relative max-w-[582px] max-h-[330px] text-white">
        <h1 className="text-2xl md:text-4xl font-bold">
          Verifique se sua propriedade está elegível para participar do{" "}
          <span className="font-thin">PREM</span>
        </h1>
        <p className="mt-2 text-sm md:text-lg mb-6">
          O processo é simples e permite identificar oportunidades para
          regularização e reintegração com frigoríficos.
        </p>

        <Link href="#form" scroll={true}>
          <Button className="mt-3 w-64 sm:w-80 md:w-96 h-10 text-lg px-6 py-3 hover:bg-green-700 rounded-lg flex items-center justify-center gap-1">
            Consultar agora
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
