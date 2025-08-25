"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GoArrowLeft } from "react-icons/go";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import {
  PiFarmLight,
  PiSealCheckLight,
  PiUserCircleThin,
  PiWarningFill,
} from "react-icons/pi";

import { InfoGrid } from "@/components/InfoGrid";
import { Input } from "@/components/Input";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Radio } from "@/components/RadioBox";
import { Table } from "@/components/Table";
import { TextAreaCard } from "@/components/TextAreaCard";
import { Button } from "@/components/ui/button";
import { CheckboxComponent } from "@/components/ui/checkbox";

import { useObjectionData } from "@/hooks/useGetProperties/useObjectionData";
import { Analityc } from "@/icons/Analityc";
import { DownloadIcon } from "@/icons/Download";
import { Eye } from "@/icons/Eye";
//import { Taxa } from "@/icons/Taxa";
import { X } from "@/icons/X";
import { toast } from "sonner";

type Parecer =
  | "deferido"
  | "deferido_parcial"
  | "indeferido"
  | "comPendencias"
  | "";

interface FormValues {
  justificativa: string;
  parecer: Parecer;
  parecerTecnicoFile: File | null;
  wkt: string;
}

export const PlanoAdequacaoLayout = () => {
  const params = useParams();
  const router = useRouter();
  const propriedadeId = params?.id as string;

  const [selectedDocsIds, setSelectedDocsIds] = useState<number[]>([]);
  const [openSection, setOpenSection] = useState({ tecnico: true });

  const { data, isLoading, isError, error, submitPlanoAdequacaoAsync } =
    useObjectionData();

  const form = useForm<FormValues>({
    defaultValues: {
      justificativa: "",
      parecer: "",
      parecerTecnicoFile: null,
      wkt: "",
    },
  });

  const PARECER_LABEL = "Parecer Técnico da Contestação";

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { control, handleSubmit, setValue, reset, watch } = form;

  const selectedFile = watch("parecerTecnicoFile");

  const openFilePicker = () => fileInputRef.current?.click();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] ?? null;
    setValue("parecerTecnicoFile", file, { shouldValidate: true });
  };

  const clearFile = () => {
    setValue("parecerTecnicoFile", null, { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  React.useEffect(() => {
    if (data?.planoAdequacao?.motivo) {
      setValue("justificativa", data.planoAdequacao.motivo);
    }
  }, [data?.planoAdequacao?.motivo, setValue]);

  if (isLoading) return <p>Carregando dados...</p>;
  if (isError) return <p>Erro: {(error as Error).message}</p>;
  if (!data) return <p>Dados não encontrados.</p>;

  const canSendParecer = (() => {
    const status = data?.planoAdequacao?.situacao;
    if (!status) return false;
    return ["Em Análise", "COM_PENDENCIAS"].includes(status);
  })();

  const { tecnico, farmData, documentosPlano = [], planoAdequacao } = data;

  const customMenuItems = [
    { label: "Dashboard", href: "/dashboard", icon: <Analityc /> },
    {
      label: "Usuários",
      href: "/dashboard/users",
      icon: <PiUserCircleThin size={44} />,
    },
    {
      label: "Elegibilidade",
      href: "/dashboard/elegibility",
      icon: <PiSealCheckLight size={44} />,
    },
    {
      label: "Propriedades",
      href: "/dashboard/properties",
      icon: <PiFarmLight size={44} />,
    },
  ];

  const farmInfoRows = [
    [
      { label: "Cadastro Ambiental Rural (CAR)", value: farmData.car },
      { label: "Código Voucher PREM", value: farmData.voucher },
    ],
    [
      { label: "Nome da propriedade*", value: farmData.nome },
      { label: "Município*", value: farmData.municipio },
      { label: "Estado*", value: farmData.estado },
    ],
    [
      { label: "Etapa Atual:", value: farmData.etapa },
      { label: "Status", value: farmData.status },
    ],
  ];

  const toggleAllDocs = () => {
    if (selectedDocsIds.length === documentosPlano.length) {
      setSelectedDocsIds([]);
    } else {
      setSelectedDocsIds(documentosPlano.map((doc) => doc.id));
    }
  };

  const toggleSingleDoc = (id: number) => {
    setSelectedDocsIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDownloadSelectedDocs = () => {
    if (!documentosPlano.length || !selectedDocsIds.length) {
      alert("Selecione pelo menos um documento para baixar.");
      return;
    }
    documentosPlano
      .filter((d) => selectedDocsIds.includes(d.id))
      .forEach((d) => d.url && d.url !== "#" && window.open(d.url, "_blank"));
  };

  function sanitizeWKT(input?: string) {
    if (!input) return "";
    let s = input.trim();
    s = s.replace(/^SRID=\d+;?/i, "");
    s = s.replace(/(\d),(?=\d)/g, "$1.");
    s = s.replace(/\s+/g, " ");
    return s;
  }

  function isValidPolygonWKT(raw?: string) {
    if (!raw) return false;
    const wkt = sanitizeWKT(raw).toUpperCase();

    if (!wkt.startsWith("POLYGON") && !wkt.startsWith("MULTIPOLYGON")) {
      return false;
    }
    let bal = 0;
    for (const ch of wkt) {
      if (ch === "(") bal++;
      else if (ch === ")") bal--;
      if (bal < 0) return false;
    }
    if (bal !== 0) return false;
    if (wkt.startsWith("POLYGON")) {
      const ringMatch = wkt.match(/POLYGON\s*\(\(\s*([^)]+)\s*\)\)/i);
      if (ringMatch) {
        const coords = ringMatch[1]
          .split(",")
          .map((p) => p.trim().split(/\s+/).map(Number))
          .filter(
            (pair) =>
              pair.length >= 2 &&
              !Number.isNaN(pair[0]) &&
              !Number.isNaN(pair[1])
          );

        if (coords.length < 4) return false;

        const first = coords[0];
        const last = coords[coords.length - 1];
        const isClosed =
          Math.abs(first[0] - last[0]) < 1e-12 &&
          Math.abs(first[1] - last[1]) < 1e-12;
        if (!isClosed) return false;
      }
    }

    return true;
  }

  const onSubmit = async (values: FormValues) => {
    try {
      if (!values.parecerTecnicoFile) {
        toast.error("Selecione o parecer da análise da contestação.", { duration: 5000 });
        return;
      }
      const wktObrigatorio = ["deferido", "deferido_parcial"].includes(
        values.parecer
      );

      const cleanedWkt = sanitizeWKT(values.wkt);

      if (wktObrigatorio) {
        if (!cleanedWkt) {
          toast.error(
            "O campo WKT é obrigatório para parecer Deferido ou Deferido Parcialmente."
          , { duration: 5000 });
          return;
        }
        if (!isValidPolygonWKT(cleanedWkt)) {
          toast.error("Informe um WKT válido do tipo POLYGON ou MULTIPOLYGON.", { duration: 5000 });
          return;
        }
      } else if (cleanedWkt && !isValidPolygonWKT(cleanedWkt)) {
        toast.error("Informe um WKT válido do tipo POLYGON ou MULTIPOLYGON.", { duration: 5000 });
        return;
      }

      if (!values.parecerTecnicoFile) {
        toast.error("Selecione o parecer da análise da contestação.", { duration: 5000 });
        return;
      }

      const file = values.parecerTecnicoFile;

      const parametros = [
        { nome: file.name, tipo: "Parecer Técnico da Contestação" },
      ];

      const payload: any = {
        status: values.parecer,
        parametros,
        arquivo: file,
        wkt: values?.wkt,
      };

      await submitPlanoAdequacaoAsync(payload);
      toast.success("Parecer enviado com sucesso!", { duration: 5000 });
      reset();
      setSelectedDocsIds([]);
    } catch (err: any) {
      console.error(err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Falha ao enviar o parecer.";

      toast.error(apiMessage, { duration: 5000 });
    }
  };

  return (
    <LayoutContainer title="Análise Socioambiental" menuItems={customMenuItems}>
      <button
        onClick={() => router.push(`/dashboard/properties/${propriedadeId}`)}
        className="text-[#21801A] flex items-center gap-3"
      >
        <GoArrowLeft size={28} />
      </button>
      <div className="flex items-center justify-center mb-6">
        <div className="border-[#CAC4D0] border p-4 rounded-md flex items-center gap-3 text-sm text-gray-800">
          <PiWarningFill size={36} className="text-red-500" />
          <p>
            Para fazer o Aceite da Análise Socioambiental, é necessário
            solicitar o Termo de Adequação.
          </p>
        </div>
      </div>

      {/* Título + Situação do Plano */}
      <div className="flex items-center justify-between py-6">
        <h1 className="text-xl text-[#1A6415] font-semibold">
          Plano de Adequação
        </h1>
        {planoAdequacao?.situacao && (
          <span className="px-3 py-1 rounded-full text-sm bg-gray-100 border">
            Situação: <strong>{planoAdequacao.situacao}</strong>
          </span>
        )}
      </div>

      <InfoGrid rows={farmInfoRows} data={[]} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="border rounded-md shadow bg-white mt-4">
          <div className="bg-[#4A4A4A] text-white px-4 py-2 font-semibold">
            Estratégia de Adequação
          </div>

          <div
            className="bg-[#4A4A4A] flex justify-between text-white px-4 py-2 font-semibold mt-8 cursor-pointer"
            onClick={() =>
              setOpenSection((s) => ({ ...s, tecnico: !s.tecnico }))
            }
          >
            Informações do Responsável Técnico
            {openSection.tecnico ? (
              <IoMdArrowDropup className="inline ml-2" />
            ) : (
              <IoMdArrowDropdown className="inline ml-2" />
            )}
          </div>

          {openSection.tecnico && (
            <>
              {tecnico ? (
                <Table.Container className="!pt-0">
                  <Table.Header>
                    <Table.Title>Nome</Table.Title>
                    <Table.Title>CPF</Table.Title>
                    <Table.Title>Profissão</Table.Title>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{tecnico.nome}</Table.Cell>
                      <Table.Cell>{tecnico.cpf}</Table.Cell>
                      <Table.Cell>{tecnico.profissao}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                  <Table.Header>
                    <Table.Title>Registro CREA</Table.Title>
                    <Table.Title>Telefone</Table.Title>
                    <Table.Title>Email</Table.Title>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{tecnico.registroCrea}</Table.Cell>
                      <Table.Cell>{tecnico.telefone}</Table.Cell>
                      <Table.Cell>{tecnico.email}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Container>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Nenhum responsável técnico associado ao plano/contestação.
                </div>
              )}
            </>
          )}
        </section>
        <section className="border rounded-md shadow bg-white">
          <TextAreaCard
            name="justificativa"
            control={control}
            title="Motivo da Estratégia de Adequação"
            subtitle="(Pré-preenchido com o motivo do Plano de Adequação)"
            placeholder="Descreva sua justificativa..."
            disabled
          />
        </section>
        <section className="border rounded-md shadow bg-white mt-4">
          <div className="bg-[#4A4A4A] text-white px-4 py-2 font-semibold">
            Documentos do Plano de Adequação
          </div>

          <Table.Container className="!pt-0">
            <Table.Header>
              <Table.Title className="!bg-[#EBE3F3]">
                <CheckboxComponent
                  checked={
                    selectedDocsIds.length === documentosPlano.length &&
                    documentosPlano.length > 0
                  }
                  onCheckedChange={toggleAllDocs}
                />
              </Table.Title>
              <Table.Title className="bg-[#EBE3F3]">Descrição</Table.Title>
              <Table.Title className="bg-[#EBE3F3]">Ações</Table.Title>
            </Table.Header>
            <Table.Body>
              {documentosPlano.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <CheckboxComponent
                      checked={selectedDocsIds.includes(item.id)}
                      onCheckedChange={() => toggleSingleDoc(item.id)}
                    />
                  </Table.Cell>
                  <Table.Cell>{item.descricao}</Table.Cell>
                  <Table.Cell>
                    <button
                      type="button"
                      onClick={() =>
                        item.url &&
                        item.url !== "#" &&
                        window.open(item.url, "_blank")
                      }
                      className="inline-flex items-center gap-2 hover:underline"
                      title="Visualizar documento"
                    >
                      <Eye />
                      <span>Ver</span>
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
              {documentosPlano.length === 0 && (
                <Table.Row>
                  <Table.Cell colspan={3} className="text-center text-gray-500">
                    Nenhum documento encontrado para o Plano de Adequação.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Container>

          <div className="flex justify-end px-4 py-3">
            <Button
              onClick={handleDownloadSelectedDocs}
              type="button"
              variant="green"
            >
              Baixar Selecionados
            </Button>
          </div>
        </section>
        <section className="border rounded-md shadow bg-white mt-4">
          <div className="bg-[#21801A] text-white px-4 py-2 font-semibold flex justify-between items-center">
            Parecer do Plano de Adequação
          </div>
          <Table.Container className="!pt-0">
            <Table.Header>
              <Table.Title colspan={4}>
                Qual é o parecer da analise do Plano de Adequação?
              </Table.Title>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Radio
                    name="parecer"
                    value="deferido"
                    label="Deferido"
                    control={control}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Radio
                    name="parecer"
                    value="deferido_parcial"
                    label="Deferido Parcialmente"
                    control={control}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Radio
                    name="parecer"
                    value="indeferido"
                    label="Indeferido"
                    control={control}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Radio
                    name="parecer"
                    value="comPendencias"
                    label="Com Pendencias"
                    control={control}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Container>
        </section>
        <section className="border rounded-md shadow bg-white mt-4">
          <div className="bg-[#21801A] text-white px-4 py-2 font-semibold flex justify-between items-center">
            Faça o upload do parecer da analise do Plano de Adequação?
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={onFileChange}
          />
          <Table.Container className="!pt-0">
            <Table.Header>
              <Table.Title colspan={3}>Descrição do documento</Table.Title>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <span>{PARECER_LABEL}</span>
                    {selectedFile && (
                      <span className="text-xs text-gray-600 italic">
                        ({selectedFile.name})
                      </span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={openFilePicker}
                      className="inline-flex items-center gap-2 hover:underline"
                      title="Selecionar arquivo (PDF)"
                    >
                      <DownloadIcon />
                    </button>
                    {/* Limpar */}
                    <button
                      type="button"
                      onClick={clearFile}
                      className="inline-flex items-center gap-2 hover:underline disabled:opacity-50"
                      title="Remover arquivo"
                      disabled={!selectedFile}
                    >
                      <X />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Input
                    label="Wkt"
                    control={control}
                    placeholder="POLYGON (())"
                    name="wkt"
                    className="text-black"
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Container>
        </section>
        <div className="flex flex-col items-end mt-4">
          {!canSendParecer && (
            <span className="text-red-600 text-sm mb-2">
              Só é possível enviar o parecer se o Plano de Adequação estiver em
              análise ou com pendências.
            </span>
          )}
          <Button
            variant="dark"
            type="submit"
            className="w-36"
            disabled={!canSendParecer}
          >
            Salvar
          </Button>
        </div>
      </form>
    </LayoutContainer>
  );
};
