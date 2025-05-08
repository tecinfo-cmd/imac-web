"use client";

import { useState, useRef } from "react";
import React from "react";
import { BsFileText } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { TbLoaderQuarter } from "react-icons/tb";
import { TbLeaf } from "react-icons/tb";
import { TfiBookmarkAlt } from "react-icons/tfi";

import Footer from "../components/ui/footer";
import Header from "../components/ui/header";
import HeroSection from "../components/ui/heroSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CARInput from "@/components/ui/carInput";
import { CheckboxComponent } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import MaskedInput from "@/components/ui/maskedInput";
import {
  MaskedModalInput,
  MaskedModalInputHandle,
} from "@/components/ui/maskedModalInput";
import EmailModal from "@/components/ui/modals/emailModal";
import Modal from "@/components/ui/modals/modal";
import Step from "@/components/ui/step";

import { useCAR } from "@/hooks/useCAR";

export default function Home() {
  const [carValue, setCarValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentType, setDocumentType] = React.useState<
    "cpf" | "cnpj" | "carEstadual" | undefined
  >(undefined);

  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [modalErrors, setModalErrors] = useState<{
    type?: string;
    value?: string;
  }>({});

  const [carNumbers, setCarNumbers] = useState<string[]>([]);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);

  const documentInputRef = useRef<MaskedModalInputHandle>(null);
  const documentTypeValue = ["cpf", "cnpj", "carEstadual"].includes(
    documentType ?? ""
  )
    ? documentType
    : undefined;

  const { data, fetchData } = useCAR();

  const handleCarValueChange = (value: string) => {
    setCarValue(value);
  };

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  const fetchCARNumbers = async () => {
    const rawValue = documentInputRef.current?.getUnmaskedValue();

    if (!rawValue || !rawValue.trim()) {
      setModalErrors({
        value: "Por favor, insira um valor valido para buscar.",
      });
      return;
    }

    if (!documentType) {
      setModalErrors({ value: "Por favor, selecione um tipo de documento." });
      return;
    }

    if (documentType === "carEstadual") {
      console.log("Valor bruto:", rawValue);

      const match = rawValue.match(/^([A-Z]{2})(\d{4,6})\/(\d{4})$/i);

      if (!match) {
        setModalErrors({
          value:
            "Formato inválido. Use duas letras, 4-6 números, uma barra e 4 números finais (ex: AA1234/5678).",
        });
        return;
      }
    }

    setIsLoading(true);
    setModalErrors({});

    try {
      console.log("Função chamada");
      console.log("Valor desmascarado:", rawValue);
      console.log("Tipo de documento:", documentType);

      const response = await fetchData(
        documentType as "cpf" | "cnpj" | "carEstadual",
        rawValue
      );
      console.log("Resposta da API:", response);

      if (response && response.carFederal) {
        setCarNumbers([response.carFederal]);
      } else {
        setCarNumbers([]);
        setModalErrors({
          value:
            "Nenhuma propriedade encontrada para os critérios informados. Verifique os dados e tente novamente.",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados do CAR:", error);
      setModalErrors({
        value: "Erro ao buscar os dados. Tente novamente mais tarde.",
      });
      setCarNumbers([]);
    } finally {
      setDocumentType(undefined);
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawCpfValue = documentInputRef.current?.getUnmaskedValue();

    const newErrors: { [key: string]: string } = {};
    if (!rawCpfValue || rawCpfValue.length !== 11)
      newErrors.cpf = "Campo obrigatório. | Insira um CPF válido.";

    if (!carValue || carValue.length !== 43)
      newErrors.carValue =
        "Campo obrigatório. | Insira um número de CAR válido.";
    if (!phone || phone.length !== 15)
      newErrors.phone =
        "Campo obrigatório. | Insira um número de telefone válido.";
    if (!email)
      newErrors.email = "Campo obrigatório. | Insira um e-mail válido.";
    if (!isChecked)
      newErrors.isChecked =
        "Você precisa aceitar os termos e condições de uso para prosseguir.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payload = {
        carFederal: carValue,
        telefone: phone,
        email,
        cpfCnpj: rawCpfValue,
      };
      console.log("Payload enviado:", payload);

      try {
        const response = await fetch(
          "https://imac-dev-f8b98.ondigitalocean.app/imac/api/v1/elegibilidades/solicitacoes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const responseText = await response.text();
          throw new Error(
            `Erro ao enviar solicitação: ${response.status} - ${responseText}`
          );
        }

        setCarValue("");
        setPhone("");
        setEmail("");
        setIsChecked(false);
        documentInputRef.current?.clearValue();

        const result = await response.json();
        console.log("Resposta da API:", result);

        setIsModalTwoOpen(true);
      } catch (error) {
        console.error("Erro ao enviar para API:", error);
      }
    }
  };

  const resetModal = () => {
    setCarNumbers([]);
    setSelectedCar(null);

    setDocumentType(undefined);
    setModalErrors({});
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <HeroSection topImage={""} title={""} text={""} />
      <div id="form" className="min-h-screen flex flex-col py-4 px-6">
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
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <CARInput
                  value={carValue}
                  onChange={handleCarValueChange}
                  error={errors.carValue}
                  setError={(error: string | null) => {
                    setErrors({ carValue: error || "" });
                  }}
                  inputClassName={errors.carValue}
                />

                <div className="mb-4">
                  <p className="mt-2">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsModalOpen(true);
                      }}
                      className="text-[#666666] underline hover:text-gray-700 cursor-pointer"
                    >
                      não sei o número CAR
                    </a>
                  </p>
                </div>
                <MaskedModalInput
                  documentType="cpf"
                  type="text"
                  ref={documentInputRef}
                  placeholder="Digite seu CPF"
                  className="bg-white border border-gray-400 focus:outline-none rounded-md px-4 py-2 h-12 w-full sm:w-70 md:w-70  placeholder-[#A2A2A2]"
                  label="CPF do próprietario*"
                  error={errors.cpf}
                />
                <MaskedInput
                  mask="(00) 00000-0000"
                  label="telefone de contato (whatsapp)*"
                  type="tel"
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPhone(e.target.value)
                  }
                  placeholder="(XX) XXXXX - XXXX"
                  className="bg-white w-[194px] h-[48px] sm:w-[270px] md:w-[320px] lg:w-[380px]"
                  error={errors.phone}
                />

                <Input
                  label="e-mail de contato*"
                  type="email"
                  value={email}
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setEmail(e.target.value)}
                  placeholder="exemplo@dominio.com"
                  error={errors.email}
                />

                <CheckboxComponent
                  checked={isChecked}
                  onCheckedChange={handleCheckboxChange}
                  className="w-[17px] h-[17px] border-[1px] border-[#666666] shadow-[inset_0px_0px_5px_2px_rgba(0,0,0,0.2)] "
                  error={errors.isChecked}
                >
                  aceito os termos e condições de uso.
                </CheckboxComponent>

                <Button
                  type="submit"
                  className="w-[285px] h-[48px] sm:w-[320px] md:w-[350px] lg:w-[380px]"
                >
                  Consultar
                </Button>
              </form>
              <EmailModal
                isOpen={isModalTwoOpen}
                onOpenChange={setIsModalTwoOpen}
                onClose={() => setIsModalTwoOpen(false)}
              >
                <div className="flex justify-center items-center w-full h-full">
                  <div className="w-[90%] max-w-[300px] h-auto max-h-[90%]  flex flex-col justify-center items-center">
                    <MdOutlineMarkEmailRead className="text-[#52A532] w-8 h-8 sm:w-9 sm:h-9 mb-2" />
                    <h2 className="sm:text-lg font-bold mb-2">Quase lá!</h2>
                    <p className="sm:text-sm text-center">
                      Enviamos um e-mail para você. Acesse sua caixa de entrada
                      e siga as instruções para concluir sua solicitação.
                    </p>
                  </div>
                </div>
              </EmailModal>
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

      <Modal isOpen={isModalOpen} onOpenChange={() => {}} onClose={resetModal}>
        <div className="w-full max-w-[90vw] sm:max-w-[400px] lg:max-w-[449px] mx-auto p-4 sm:p-6">
          <h2 className="text-lg   font-thin mb-4">
            Pesquisar CAR Federal por:
          </h2>

          <div className="flex mb-4">
            {["cpf", "cnpj", "carEstadual"].map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={type}
                  checked={documentType === type}
                  onChange={() =>
                    setDocumentType(type as "cpf" | "cnpj" | "carEstadual")
                  }
                  className="hidden peer"
                />
                <div
                  className={`w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7  border-[#222222] border rounded-full flex items-center justify-center ${
                    documentType === type ? "bg-[#52A532]" : "bg-white"
                  }`}
                >
                  {documentType === type && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
                <span className="ml-2 text-sm md:text-base lg:text-lg">
                  {type === "cpf" && "CPF"}
                  {type === "cnpj" && "CNPJ"}
                  {type === "carEstadual" && "CAR Estadual"}
                </span>
              </label>
            ))}
          </div>

          <div className="relative w-full mt-4">
            <div className="flex-grow">
              <MaskedModalInput
                documentType={documentTypeValue}
                type="text"
                ref={documentInputRef}
                placeholder="valor"
                disabled={!documentType}
                className="border border-[#222222] focus:outline-none rounded-md px-4 py-2 h-12 w-full sm:w-70 md:w-70  placeholder-[#A2A2A2] bg-white"
                label={""}
                onKeyDown={(e: { key: string; preventDefault: () => void }) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    fetchCARNumbers();
                  }
                }}
              />
            </div>
            <button
              onClick={fetchCARNumbers}
              className="absolute right-0 sm:right-0 md:right-0 top-0 translate-y-0 h-12 w-12 bg-white border-t border-b border-r border-[#222222] rounded-r-md hover:bg-gray-100 transition duration-200 flex items-center justify-center"
              disabled={!documentType}
            >
              {isLoading ? (
                <TbLoaderQuarter className="animate-spin h-5 w-5 text-[#A2A2A2]" />
              ) : (
                <IoMdSearch className="h-5 w-5 text-[#A2A2A2]" />
              )}
            </button>

            <div className="w-full mt-5 text-center">
              {modalErrors.value && (
                <p className="text-[#666666] text-sm">{modalErrors.value}</p>
              )}
            </div>
          </div>

          {carNumbers.length > 0 && data && (
            <div className="mt-4 w-full px-4 md:px-6 lg:px-8">
              <h3 className="text-md font-medium  md:text-left">
                Selecione a propriedade para consulta:
              </h3>
              <ul className="mt-2">
                {carNumbers.map((car, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <input
                      type="radio"
                      checked={selectedCar === data.carFederal}
                      onChange={() => setSelectedCar(data.carFederal)}
                      className="w-4 h-4 mt-1"
                    />

                    <div className="">
                      <span className="font-medium text-sm md:text-base lg:text-lg ">
                        {data.nome}
                      </span>
                      <br />
                      <span className="text-xs md:text-sm lg:text-base text-gray-500">
                        {car}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => {
                    if (selectedCar) {
                      setCarValue(selectedCar);
                      resetModal();
                    }
                  }}
                  className="bg-[#52A532] text-white px-4 py-2 rounded-md mt-4 w-[285px] h-[48px] hover:bg-[#469029]"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
      <Footer />
    </>
  );
}
