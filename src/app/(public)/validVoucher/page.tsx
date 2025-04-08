"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Input } from "@/components/Input";
import Selector from "@/components/Selector/selector";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import { LogoGreen } from "@/icons/LogoGreen";
import { LogoWhite } from "@/icons/LogoWhite";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  select: yup.string().required("Propriedade obrigatória"),
  voucher: yup.string().required("O voucher é obrigatório"),
});

export default function ValidVoucher() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      select: "",
      voucher: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Dados enviados:", data);
  };

  return (
    <>
      <header className="w-full h-[120px] bg-[#23811C] flex items-center p-4 md:p-6 lg:p-8">
        <LogoWhite width={87} height={87} />
        <p className="text-[#ffffff] ml-4 sm:text-[20px] md:text-[22px] lg:text-[23px]">
          Programa de Reinserção <br /> e Monitoramento
        </p>
      </header>
      <div className="bg-[#D7EADD] min-h-screen w-full flex justify-center items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vh] opacity-20 pointer-events-none select-none z-0">
          <LogoGreen width={1300} height={1300} />
        </div>

        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] opacity-20 transform rotate-180 pointer-events-none select-none z-0">
          <LogoGreen width={1300} height={1300} />
        </div>
        <div className="justify-center flex flex-col w-[450px]">
          <h1 className="text-[#0A3503] text-center text-uppercase font-inter font-bold text-2xl leading-[37px] tracking-[0.1em] md:text-[24px] md:leading-[37px] mb-8 mt-5">
            VALIDAR VOUCHER
          </h1>
          <form
            className="flex flex-col w-full min-w-[320px] gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Selector
              name="select"
              label="Selecionar propriedade"
              placeholder="Selecione propriedade"
              control={control}
              options={[
                { value: "1", label: "Propriedade 1" },
                { value: "2", label: "Propriedade 2" },
              ]}
            />
            <Input
              name="voucher"
              control={control}
              label="Digite seu código voucher"
              placeholder="Digite seu código voucher"
              type="text"
            />
            <Button
              type="submit"
              className="w-full md:w-[130px] self-center mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Validando..." : "Validar"}
            </Button>

            <Link
              href="/buyVoucher"
              className="z-10 underline text-center text-[#21801A]"
            >
              Adquirir um voucher
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
