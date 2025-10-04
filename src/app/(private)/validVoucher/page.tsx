"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GrValidate } from "react-icons/gr";
import { MdErrorOutline } from "react-icons/md";

import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";
import EmailModal from "@/components/ui/modals/emailModal";

import { yup } from "@/config/yup";
import {
  useGetAbattoirVouchers,
  useActivateVoucher,
} from "@/hooks/useValidVoucher/useValidVoucher";
import { LogoGreen } from "@/icons/LogoGreen";
import { LogoWhite } from "@/icons/LogoWhite";
import { yupResolver } from "@hookform/resolvers/yup";

export default function ValidVoucher() {
  const { data: vouchers = [], isLoading: isLoadingVouchers } =
    useGetAbattoirVouchers();

  const router = useRouter();

  const schema = yup.object({
    codigoVoucher: yup
      .object({
        value: yup.string().required("Voucher obrigatório"),
        label: yup.string().required("Voucher obrigatório"),
      })
      .required("Voucher obrigatório")
      .test(
        "ja-validado",
        "Este voucher já foi validado anteriormente!",
        (value) => {
          if (!value?.value) return true;
          const voucherSelecionado = vouchers.find(
            (v: any) => v.voucher === value.value
          );
          return voucherSelecionado?.status !== "ATIVO";
        }
      ),
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      codigoVoucher: { label: "", value: "" },
    },
  });

  const activateVoucherMutation = useActivateVoucher();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    const codigoVoucher = data.codigoVoucher.value;

    const voucherSelecionado = vouchers.find(
      (v: any) => v.voucher === codigoVoucher
    );

    if (voucherSelecionado?.status === "ATIVO") {
      setModalSuccess(false);
      setModalMessage("Este voucher já foi validado anteriormente!");
      setIsModalOpen(true);
      return;
    }

    try {
      await activateVoucherMutation.mutateAsync(codigoVoucher);
      setModalSuccess(true);
      setModalMessage("Voucher ativado com sucesso!");

      setTimeout(() => {
      router.push("/propriedade");
    }, 5000);

    } catch (error) {
      console.error("Erro ao ativar voucher:", error);
      setModalSuccess(false);
      setModalMessage("Erro ao ativar voucher. Tente novamente.");
    }

    setIsModalOpen(true);
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
            <InputSelect
              name="codigoVoucher"
              label="Selecionar Voucher"
              placeholder={
                isLoadingVouchers
                  ? "Carregando vouchers..."
                  : "Selecione um voucher"
              }
              control={control}
              options={vouchers.map((voucher: any) => ({
                value: voucher.voucher,
                label: voucher.voucher,
              }))}
            />
            <Button
              type="submit"
              className="w-full md:w-[130px] self-center mt-3"
              disabled={
                isSubmitting ||
                isLoadingVouchers ||
                activateVoucherMutation.isPending
              }
            >
              {activateVoucherMutation.isPending
                ? "Validando..."
                : isSubmitting
                ? "Validando..."
                : isLoadingVouchers
                ? "Carregando..."
                : "Validar"}
            </Button>

            <Link
              href="/enrollmentFee"
              className="z-10 underline text-center text-[#21801A]"
            >
              Adquirir um voucher
            </Link>
            <Link
              href="/propriedade"
              className="z-10 underline text-center text-[#21801A]"
            >
              Voltar
            </Link>
          </form>
        </div>
      </div>
      <EmailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="flex justify-center items-center w-full h-full">
          <div className="w-[90%] max-w-[300px] h-auto max-h-[90%]  flex flex-col justify-center items-center">
            {modalSuccess ? (
              <GrValidate className="text-[#52A532] w-8 h-8 sm:w-9 sm:h-9 mb-2" />
            ) : (
              <MdErrorOutline className="text-red-600 w-8 h-8 sm:w-9 sm:h-9 mb-2" />
            )}

            <h2
              className={`sm:text-lg font-bold mb-2${
                modalSuccess ? "text-[#52A532]" : "text-red-600"
              }`}
            >
              {modalSuccess ? "Parabéns!" : "Voucher Inválido!"}
            </h2>
            <p className="sm:text-sm text-center">{modalMessage}</p>
          </div>
        </div>
      </EmailModal>
    </>
  );
}
