import * as React from "react";
import {version} from '../../../../package.json';

export default function Footer() {
  return (
    <footer className="w-full bg-[#E3E3E3] py-6 mt-10">
      <div className="w-full max-w-[1482px] mx-auto flex flex-col md:flex-row justify-center text-center p-[40px] gap-4 sm:gap-[50px] md:gap-[50px] lg:gap-[150px] xl:gap-[206px]">
        <p className="w-full sm:w-[200px] md:w-[300px] lg:w-[414px] h-auto text-left text-[11px] sm:text-[14px] lg:text-[15px] xl:text-[16px]">
          PREM <br />
          TERMOS E CONDIÇÕES DE USO <br />
          POLÍTICA DE PRIVACIDADE <br />
          POLÍTICA DE COOKIES
        </p>
        <p className="w-full sm:w-[200px] md:w-[300px] lg:w-[414px] h-auto text-left text-[11px] sm:text-[14px] lg:text-[15px] xl:text-[16px]">
          <span className="font-bold">CONTATO</span> <br />
          Fones: (65) 9 9977-8227 / (65) 3057-9291
        </p>
        <br />
        <p className="w-full sm:w-[200px] md:w-[300px] lg:w-[414px] h-auto text-left text-[12px] sm:text-[14px] lg:text-[15px] xl:text-[16px]">
          <span className="font-bold">ENDEREÇO</span> <br />
          Av. Dr. Hélio Ribeiro, 525 - Edifício Helbor Dual <br />
          Business Office Corporate, Sala 701 - Bairro <br />
          Alvorada, Cuiabá - MT, 78048-250
        </p>
      </div>
      <div className="w-full text-center mt-4 pt-4">
          <span className="font-bold">{version} </span> <br />
      </div>
    </footer>
  );
}
