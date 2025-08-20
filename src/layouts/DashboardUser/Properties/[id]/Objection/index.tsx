"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { GoArrowLeft } from "react-icons/go";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import {
  PiFarmLight,
  PiSealCheckLight,
  PiUserCircleThin,
  PiWarningFill,
} from "react-icons/pi";

import { InfoGrid } from "@/components/InfoGrid";
import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
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
import { X } from "@/icons/X";
import { toast } from "sonner";

type SelectOption = { label: string; value: string } | string | undefined;

type FormValues = {
  justificativa: string;
  justificativaPorLauro: string;
  status: string;
  descontoPercentual: string;
  poligonos: {
    poligono: string;
    idTad: number;
    areaARegenerar: number;
    tipo: string;
  }[];
  areaHa: string;
  valorMulta: string;
  deteccoes: {
    pdf?: FileList;
    tipo?: string | { label: string; value: string };
    areaARegenerar?: string;
    wkt?: string;
  }[];
  parecerTecnico: {
    pdf?: FileList;
  };
};

export const ObjectionLayout = () => {
  const params = useParams();
  const router = useRouter();
  const propriedadeId = params?.id as string;

  const { control, handleSubmit, reset, register, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        justificativa: "",
        justificativaPorLauro: "",
        status: "",
        descontoPercentual: "0",
        poligonos: [],
        areaHa: "",
        valorMulta: "",
        deteccoes: [],
        parecerTecnico: { pdf: undefined },
      },
    });

  const {
    data,
    isLoading,
    isError,
    error,
    submitObjectionAsync,
    isSubmitting,
  } = useObjectionData();


  function toLabelValue(sel: SelectOption) {
    if (!sel) return { label: "", value: "" };
    if (typeof sel === "string") return { label: sel, value: sel };
    return { label: sel.label ?? "", value: sel.value ?? "" };
  }

  function toNum(v: any) {
    const n = parseFloat(String(v ?? "").replace(",", "."));
    return isNaN(n) ? NaN : n;
  }

  useEffect(() => {
    if (!data) return;
    reset({
      justificativa: data.justificativaSupressao ?? "",
      justificativaPorLauro: data.justificativaLaudo ?? "",
      status: "",
      descontoPercentual: "0",
      poligonos: [],
      areaHa: "0",
      deteccoes: (data.deteccoes || []).map(() => ({
        pdf: undefined,
        tipo: undefined,
        areaARegenerar: "",
        wkt: "",
      })),
      parecerTecnico: { pdf: undefined },
    });
  }, [data, reset]);

  const deteccoesWatch = useWatch({ control, name: "deteccoes" });

  const totalAreaHa = useMemo(() => {
    const list = Array.isArray(deteccoesWatch) ? deteccoesWatch : [];
    return list.reduce((sum, d) => {
      const n = toNum(d?.areaARegenerar);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);
  }, [deteccoesWatch]);

  useEffect(() => {
    setValue("areaHa", String(totalAreaHa), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [totalAreaHa, setValue]);

  const areaHaValue = watch("areaHa");

  const valorBaseMulta = useMemo(() => {
    const area = toNum(areaHaValue);
    return area * 250;
  }, [areaHaValue]);

  const valorFinalMulta = useMemo(() => {
    return valorBaseMulta;
  }, [valorBaseMulta]);

  useEffect(() => {
    setValue("valorMulta", valorFinalMulta.toFixed(2), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [valorFinalMulta, setValue]);

  const [selectedSupressaoDocsIds, setSelectedSupressaoDocsIds] = useState<
    number[]
  >([]);
  const [selectedLaudoDocsIds, setSelectedLaudoDocsIds] = useState<number[]>(
    []
  );
  const [selectedAuthIds, setSelectedAuthIds] = useState<number[]>([]);
  const [openSection, setOpenSection] = useState<{ [key: string]: boolean }>({
    tecnico: false,
    autorizacoes: false,
    justificativa: false,
    documentos: false,
    laudo: false,
  });

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

  if (isLoading) return <p>Carregando dados...</p>;
  if (isError) return <p>Erro: {(error as Error).message}</p>;
  if (!data) return <p>Dados não encontrados.</p>;

  const {
    tecnico,
    autorizacoes,
    documentosSupressao,
    documentosLaudo,
    farmData,
    deteccoes,
  } = data;

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

  const toggleAllSupressaoDocs = () => {
    if (selectedSupressaoDocsIds.length === documentosSupressao.length) {
      setSelectedSupressaoDocsIds([]);
    } else {
      setSelectedSupressaoDocsIds(documentosSupressao.map((doc) => doc.id));
    }
  };
  const toggleSingleSupressaoDoc = (id: number) => {
    setSelectedSupressaoDocsIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const toggleAllLaudoDocs = () => {
    if (selectedLaudoDocsIds.length === documentosLaudo.length) {
      setSelectedLaudoDocsIds([]);
    } else {
      setSelectedLaudoDocsIds(documentosLaudo.map((doc) => doc.id));
    }
  };
  const toggleSingleLaudoDoc = (id: number) => {
    setSelectedLaudoDocsIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const toggleAllAuth = () => {
    if (selectedAuthIds.length === autorizacoes.length) {
      setSelectedAuthIds([]);
    } else {
      setSelectedAuthIds(autorizacoes.map((a) => a.id));
    }
  };
  const toggleSingleAuth = (id: number) => {
    setSelectedAuthIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDownloadFile = (url: string | undefined) => {
    if (!url || url === "#") return;
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSelectedAuth = () => {
    autorizacoes
      .filter((item) => selectedAuthIds.includes(item.id))
      .forEach((item) => handleDownloadFile(item.url));
  };
  const handleDownloadSelectedSupressaoDocs = () => {
    documentosSupressao
      .filter((item) => selectedSupressaoDocsIds.includes(item.id))
      .forEach((item) => handleDownloadFile(item.url));
  };
  const handleDownloadSelectedLaudoDocs = () => {
    documentosLaudo
      .filter((item) => selectedLaudoDocsIds.includes(item.id))
      .forEach((item) => handleDownloadFile(item.url));
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

  const onSubmit = async (formData: FormValues) => {
  try {
    const erros: string[] = [];

    if (!formData.status) erros.push("Selecione um status do parecer.");
    if (!formData.parecerTecnico.pdf || formData.parecerTecnico.pdf.length === 0) erros.push("Anexe o parecer técnico da contestação."); 

    (formData.deteccoes || []).forEach((d, i) => {
      const w = (d?.wkt ?? "").trim();
      if (w && !isValidPolygonWKT(sanitizeWKT(w))) {
        erros.push(`Polígono ${i + 1}: WKT inválido.`);
      }
    });

    if (erros.length) {
      toast.error(erros.join("\n"), { duration: 6000 });
      return;
    }

    const parametros: { nome: string; tipo: string }[] = [];
    const poligonosOut: {
      tipo: string;
      poligono: string;
      idTad: number | string;
      areaARegenerar: number;
      wkt: string;
    }[] = [];
    const arquivosOut: { pdf: File; tipo: string }[] = [];

    const originalList = data?.deteccoes ?? [];

    (formData.deteccoes || []).forEach((d, index) => {
      const original = (originalList[index] ?? {}) as any;

      const { label: selectedLabel, value: selectedValue } = toLabelValue(d?.tipo);
      const wktRaw = (d?.wkt ?? "").trim();
      const areaNum = toNum(d?.areaARegenerar);

      const hasTipo = !!(selectedValue && String(selectedValue).trim());
      const hasWKT = wktRaw.length > 0;
      const hasArea = Number.isFinite(areaNum) && areaNum > 0;
      const hasPdf = !!(d?.pdf && d.pdf[0] instanceof File);

      if (hasPdf) {
        const file = d!.pdf![0] as File;
        parametros.push({ nome: selectedLabel || "(sem-label)", tipo: "PDF" });
        arquivosOut.push({ pdf: file, tipo: file.name });
      }

      const hasPolygonData = hasTipo || hasWKT || hasArea;
      if (!hasPolygonData) return; 

      const originalTipo = String(original?.tipo ?? "");
      const originalIdAgrotools = original?.idAgrotools ?? original?.id ?? "";
      const maxVal = Math.max(0, toNum(original?.area_ha ?? original?.ara_ha ?? 0) || 0);
      const clamped = Number.isFinite(areaNum) ? Math.min(Math.max(areaNum, 0), maxVal) : 0;

      poligonosOut.push({
        tipo: hasTipo ? String(selectedValue) : "",
        poligono: originalTipo,
        idTad: originalIdAgrotools,
        areaARegenerar: hasArea ? clamped : 0, 
        wkt: hasWKT ? sanitizeWKT(wktRaw) : "",
      });
    });

    const parecerFile = formData.parecerTecnico?.pdf?.[0];
    if (parecerFile instanceof File) {
      parametros.push({ nome: "Parecer Técnico da Contestação", tipo: "PDF" });
      arquivosOut.push({ pdf: parecerFile, tipo: parecerFile.name });
    }

    if (arquivosOut.length === 0 && poligonosOut.length === 0) {
      toast.error("Nada para enviar: preencha pelo menos um polígono ou anexe um arquivo.", { duration: 4000 });
      return;
    }

    const area = toNum(formData.areaHa);
    const valorBruto = (Number.isFinite(area) ? area : 0) * 250;
    const desconto = (formData.descontoPercentual as "0" | "50" | "100") || "0";
    const valorFinalMulta = desconto === "100" ? 0 : desconto === "50" ? valorBruto / 2 : valorBruto;

    const payload: any = {
      status: formData.status,
      parametros,
      descontoPercentual: valorFinalMulta,
    };
    if (arquivosOut.length) payload.deteccoes = arquivosOut;
    if (poligonosOut.length) payload.poligonos = poligonosOut;

    await submitObjectionAsync(payload);
    toast.success("Parecer enviado com sucesso!", { duration: 5000 });
  } catch (err: any) {
    console.error(err);
    const apiMessage =
      err?.response?.data?.message || err?.message || "Falha ao enviar o parecer.";
    toast.error(apiMessage, { duration: 5000 });
  }
};


  const fileValue = watch("parecerTecnico.pdf");
  const hasParecer = !!(fileValue && fileValue.length > 0);
  const parecerNome = fileValue?.[0]?.name;

  return (
    <LayoutContainer title="Análise Socioambiental" menuItems={customMenuItems}>
      <button
        onClick={() => router.push(`/dashboard/properties/${propriedadeId}`)}
        className="text-[#21801A] flex items-center gap-3"
      >
        <GoArrowLeft size={28} />
      </button>
      <div className="flex items-center justify-center">
        <div className="border-[#CAC4D0] border-[1px] p-4 rounded-md flex justify-center items-center space-x-3 text-sm text-gray-800 w-fit">
          <PiWarningFill
            size={36}
            className="text-red-500 mt-1 text-xl flex-shrink-0"
          />
          <p>
            <strong>Para Contestar a Análise Socioambiental</strong>, é
            necessário enviar os documentos necessários de acordo com o tipo de
            contestação. Caso tenha mais de um tipo de contestação,
            certifique-se de preencher o formulário de acordo com o tipo que
            deseja contestar. <br />
            Após a solicitação não é possível editar os dados da propriedade e
            dos proprietários.
          </p>
        </div>
      </div>

      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Contestação de Análise Socioambiental
      </h1>

      <InfoGrid rows={farmInfoRows} data={[]} />

      <div className="space-y-6 pb-4 mx-auto">
        <section className="border rounded-md shadow bg-white">
          <div
            className="bg-[#4A4A4A] text-white px-4 py-2 font-semibold flex justify-between items-center cursor-pointer"
            onClick={() =>
              setOpenSection((prev) => ({ ...prev, tecnico: !prev.tecnico }))
            }
          >
            Informações do Responsável Técnico
            {openSection.tecnico ? (
              <IoMdArrowDropup className="ml-2" />
            ) : (
              <IoMdArrowDropdown className="ml-2" />
            )}
          </div>

          {openSection.tecnico && (
            <>
              {tecnico ? (
                <>
                  <div className="bg-[#EBE3F3] font-bold text-[#21801A] px-4 py-2 text-sm">
                    Informe os dados do responsável técnico.
                  </div>
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
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Nenhum responsável técnico associado a esta contestação.
                </div>
              )}

              <div className="bg-[#4A4A4A] text-white px-4 py-2 font-semibold flex justify-between items-center">
                Autorização de Supressão
              </div>
              <Table.Container className="!pt-0">
                <Table.Header>
                  <Table.Title>
                    <CheckboxComponent
                      checked={
                        selectedAuthIds.length === autorizacoes.length &&
                        autorizacoes.length > 0
                      }
                      onCheckedChange={toggleAllAuth}
                    />
                  </Table.Title>
                  <Table.Title>Nº</Table.Title>
                  <Table.Title>Data de Emissão</Table.Title>
                  <Table.Title>Data de Validade</Table.Title>
                  <Table.Title>Tipo de Supressão</Table.Title>
                  <Table.Title>Órgão Emissor</Table.Title>
                  <Table.Title>Área autorizada(ha)</Table.Title>
                  <Table.Title>Ações</Table.Title>
                </Table.Header>
                <Table.Body>
                  {autorizacoes.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>
                        <CheckboxComponent
                          checked={selectedAuthIds.includes(item.id)}
                          onCheckedChange={() => toggleSingleAuth(item.id)}
                        />
                      </Table.Cell>
                      <Table.Cell>{item.id}</Table.Cell>
                      <Table.Cell>{item.dataEmissao}</Table.Cell>
                      <Table.Cell>{item.validade}</Table.Cell>
                      <Table.Cell>{item.tipo}</Table.Cell>
                      <Table.Cell>{item.orgao}</Table.Cell>
                      <Table.Cell>{item.area}</Table.Cell>
                      <Table.Cell>
                        <button
                          onClick={() => handleDownloadFile(item.url)}
                          disabled={!item.url || item.url === "#"}
                        >
                          <Eye />
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Container>
              <div className="flex justify-end px-4 py-3">
                <Button
                  onClick={handleDownloadSelectedAuth}
                  variant="green"
                  disabled={selectedAuthIds.length === 0}
                >
                  Baixar Selecionados
                </Button>
              </div>

              <div className="bg-[#4A4A4A] text-white px-4 py-2 font-semibold">
                Motivo da Contestação
              </div>
              <TextAreaCard
                name="justificativa"
                control={control}
                subtitle="Justificativa da contestação por Autorização de Supressão"
                placeholder="Descreva sua justificativa..."
                disabled
              />

              <div className="bg-[#4A4A4A] text-white px-4 py-2 font-semibold">
                Anotação de responsabilidade técnica
              </div>
              <Table.Container className="!pt-0">
                <Table.Header>
                  <Table.Title>
                    <CheckboxComponent
                      checked={
                        selectedSupressaoDocsIds.length ===
                          documentosSupressao.length &&
                        documentosSupressao.length > 0
                      }
                      onCheckedChange={toggleAllSupressaoDocs}
                    />
                  </Table.Title>
                  <Table.Title>Descrição do documento</Table.Title>
                  <Table.Title>Ações</Table.Title>
                </Table.Header>
                <Table.Body>
                  {documentosSupressao.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>
                        <CheckboxComponent
                          checked={selectedSupressaoDocsIds.includes(item.id)}
                          onCheckedChange={() =>
                            toggleSingleSupressaoDoc(item.id)
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>{item.descricao}</Table.Cell>
                      <Table.Cell>
                        <button
                          onClick={() => handleDownloadFile(item.url)}
                          disabled={!item.url || item.url === "#"}
                        >
                          <Eye />
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Container>
              <div className="flex justify-end px-4 py-3">
                <Button
                  onClick={handleDownloadSelectedSupressaoDocs}
                  variant="green"
                  disabled={selectedSupressaoDocsIds.length === 0}
                >
                  Baixar Selecionados
                </Button>
              </div>
            </>
          )}
        </section>

        <section className="border rounded-md shadow bg-white">
          <div
            className="bg-[#4A4A4A] text-white px-4 py-2 font-semibold flex justify-between items-center cursor-pointer"
            onClick={() =>
              setOpenSection((prev) => ({ ...prev, laudo: !prev.laudo }))
            }
          >
            Contestação por Laudo
            {openSection.laudo ? (
              <IoMdArrowDropup className="ml-2" />
            ) : (
              <IoMdArrowDropdown className="ml-2" />
            )}
          </div>

          {openSection.laudo && (
            <>
              <div className="mt-4">
                <TextAreaCard
                  name="justificativaPorLauro"
                  control={control}
                  title="Motivo da Contestação"
                  subtitle="Justificativa da contestação por laudo"
                  placeholder="Descreva sua justificativa..."
                  disabled
                />
              </div>
              <div className="bg-[#4A4A4A] text-white px-4 py-2 font-semibold">
                Anotação de responsabilidade técnica
              </div>
              <Table.Container className="!pt-0">
                <Table.Header>
                  <Table.Title>
                    <CheckboxComponent
                      checked={
                        selectedLaudoDocsIds.length ===
                          documentosLaudo.length && documentosLaudo.length > 0
                      }
                      onCheckedChange={toggleAllLaudoDocs}
                    />
                  </Table.Title>
                  <Table.Title>Descrição do documento</Table.Title>
                  <Table.Title>Ações</Table.Title>
                </Table.Header>
                <Table.Body>
                  {documentosLaudo.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>
                        <CheckboxComponent
                          checked={selectedLaudoDocsIds.includes(item.id)}
                          onCheckedChange={() => toggleSingleLaudoDoc(item.id)}
                        />
                      </Table.Cell>
                      <Table.Cell>{item.descricao}</Table.Cell>
                      <Table.Cell>
                        <button
                          onClick={() => handleDownloadFile(item.url)}
                          disabled={!item.url || item.url === "#"}
                        >
                          <Eye />
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Container>
              <div className="flex justify-end px-4 py-3">
                <Button
                  onClick={handleDownloadSelectedLaudoDocs}
                  variant="green"
                  disabled={selectedLaudoDocsIds.length === 0}
                >
                  Baixar Selecionados
                </Button>
              </div>
            </>
          )}
        </section>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-[#21801A] text-white px-4 py-2 font-semibold">
            Parecer da Contestação
          </div>
          <Table.Container className="!pt-0">
            <Table.Header>
              <Table.Title colspan={4}>
                Qual é o parecer da analise da contestação?
              </Table.Title>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Radio
                    name="status"
                    value="DEFERIDO"
                    label="Deferido"
                    control={control}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Radio
                    name="status"
                    value="DEFERIDO_PARCIAL"
                    label="Deferido Parcialmente"
                    control={control}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Radio
                    name="status"
                    value="INDEFERIDO"
                    label="Indeferido"
                    control={control}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Radio
                    name="status"
                    value="COM_PENDENCIAS"
                    label="Com Pendências"
                    control={control}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Container>

          <div className="bg-[#21801A] text-white px-4 py-2 font-semibold">
            Faça o upload do parecer da análise da contestação
          </div>
          <Table.Container className="!pt-0 w-full">
            <Table.Header>
              <Table.Title>Descrição do documento</Table.Title>
              <Table.Title>Arquivo selecionado</Table.Title>
              <Table.Title>Ações</Table.Title>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <CheckboxComponent checked={hasParecer} disabled />
                    <span>Parecer Técnico da Contestação</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className="truncate block max-w-xs">
                    {parecerNome || "-"}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <input
                    type="file"
                    accept="application/pdf"
                    id="parecer-tecnico-input"
                    className="hidden"
                    {...register("parecerTecnico.pdf" as const)}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        document
                          .getElementById("parecer-tecnico-input")
                          ?.click()
                      }
                      className="p-1 hover:scale-110 transition-transform"
                      title="Selecionar PDF"
                    >
                      <DownloadIcon />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setValue(
                          "parecerTecnico.pdf" as const,
                          undefined as any,
                          {
                            shouldDirty: true,
                            shouldValidate: true,
                          }
                        );
                        const input = document.getElementById(
                          "parecer-tecnico-input"
                        ) as HTMLInputElement | null;
                        if (input) input.value = "";
                      }}
                      className="p-1 hover:scale-110 transition-transform"
                      title="Limpar arquivo"
                      disabled={!hasParecer}
                    >
                      <X />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Container>

          <div className="bg-[#21801A] text-white px-4 py-2 font-semibold">
            Indique os poligonos a serem considerados no cálculo da área
            degradada.
          </div>
          <Table.Container className="!pt-0 w-full">
            <Table.Header>
              <Table.Title>Poligono</Table.Title>
              <Table.Title>TAD/ID</Table.Title>
              <Table.Title>Área identificada</Table.Title>
              <Table.Title>Área a regenerar</Table.Title>
              <Table.Title>Tipo</Table.Title>
              <Table.Title>WKT</Table.Title>
            </Table.Header>
            <Table.Body>
              {deteccoes.length > 0 ? (
                deteccoes.map((d: any, index: number) => (
                  <Table.Row key={d.id}>
                    <Table.Cell>{d?.tipo ?? "-"}</Table.Cell>
                    <Table.Cell>{d?.idAgrotools ?? "-"}</Table.Cell>
                    <Table.Cell>{d?.area_ha ?? "-"}</Table.Cell>
                    <Table.Cell>
                      <Controller
                        control={control}
                        name={`deteccoes.${index}.areaARegenerar` as const}
                        rules={{
                          validate: (v: any) => {
                            if (v === "" || v === undefined || v === null)
                              return true;
                            const n = toNum(v);
                            if (isNaN(n)) return "Informe um número válido";
                            if (n < 0) return "Não pode ser negativo";
                            const maxN = toNum(
                              d?.area_ha ?? d?.ara_ha ?? d?.areaARegenerar ?? 0
                            );
                            const maxVal = isNaN(maxN) ? 0 : maxN;
                            if (n > maxVal)
                              return `Não pode ser maior que ${maxVal}`;
                            return true;
                          },
                        }}
                        render={({ field, fieldState }) => {
                          const maxN = toNum(
                            d?.area_ha ?? d?.ara_ha ?? d?.areaARegenerar ?? 0
                          );
                          const maxVal = isNaN(maxN) ? 0 : maxN;

                          return (
                            <div className="flex flex-col">
                              <input
                                type="number"
                                inputMode="decimal"
                                step="any"
                                min={0}
                                value={field.value ?? ""}
                                placeholder="0"
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  if (raw === "" || raw === undefined) {
                                    field.onChange("");
                                    return;
                                  }
                                  const n = toNum(raw);
                                  if (isNaN(n)) {
                                    field.onChange("");
                                    return;
                                  }
                                  const clamped = Math.max(
                                    0,
                                    Math.min(n, maxVal)
                                  );
                                  field.onChange(String(clamped));
                                }}
                                onBlur={field.onBlur}
                                className={`w-full h-[48px] p-4 mt-2 text-black rounded focus:outline-none border border-[#CAC4D0] shadow-[0px_1px_3px_rgba(0,0,0,0.3)] placeholder:text-[#D7D6D7] ${
                                  fieldState.error
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                              {fieldState.error && (
                                <div className="p-2 mt-1 bg-white border border-[#CAC4D0] rounded-lg rounded-bl-none">
                                  <p className="text-[#F12929] font-light text-xs">
                                    {fieldState.error.message}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        }}
                      />
                    </Table.Cell>

                    <Table.Cell>
                      <InputSelect
                        label=""
                        control={control}
                        name={`deteccoes.${index}.tipo`}
                        options={[
                          {
                            label: "contestação por laudo",
                            value: "contestação por laudo",
                          },
                          {
                            label: "Autorização supressao",
                            value: "Autorização supressao",
                          },
                        ]}
                      />
                    </Table.Cell>

                    <Table.Cell>
                      <Input
                        control={control}
                        name={`deteccoes.${index}.wkt`}
                        className="text-black"
                        placeholder="POLYGON (())"
                      />
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colspan={6} className="text-center text-gray-500">
                    Nenhuma detecção encontrada.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Container>

          <div>
            <div className="bg-[#21801A] text-white px-4 py-2 font-semibold">
              Base de Cálculo da multa
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-2">
              <Input
                label="Soma da área total a ser regenerada"
                name="areaHa"
                disabled
                control={control}
              />

              <Input
                label="Valor da multa"
                name="valorMulta"
                disabled
                control={control}
              />
              <InputSelect
                name="descontoPercentual"
                label="Valor de desconto PREM"
                placeholder="Isento"
                control={control}
                options={[
                  { label: "Isento", value: "100" },
                  { label: "50%", value: "50" },
                  { label: "0%", value: "0" },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end px-4 py-2">
            <Button
              variant="dark"
              type="submit"
              className="w-36"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </LayoutContainer>
  );
};
