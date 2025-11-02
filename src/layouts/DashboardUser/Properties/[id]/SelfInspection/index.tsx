"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import { GoArrowLeft } from "react-icons/go";
import { IoTrashSharp } from "react-icons/io5";
import { MdEngineering } from "react-icons/md";
import {
  PiFarmLight,
  PiSealCheckLight,
  PiUserCircleThin,
} from "react-icons/pi";
import { TbLoaderQuarter } from "react-icons/tb";

import { Modal } from "./components/Modal";
import { InfoGrid } from "@/components/InfoGrid";
import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Radio } from "@/components/RadioBox";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import {
  useCreateSelfInspection,
  useSendParecerAutoVistoria,
} from "@/hooks/useGetProperties/useCreateSelfInspection";
import { useGetSelfInspections } from "@/hooks/useGetProperties/useCreateSelfInspection";
import { useObjectionData } from "@/hooks/useGetProperties/useObjectionData";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { Eye } from "@/icons/Eye";
import { maskDate } from "@/utils/maskDate";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

const PARECER_LABEL = "Parecer Técnico da Contestação";

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
  {
    label: "Frigorificos",
    href: "/dashboard/abattoir-industry",
    icon: <Abattoir size={44} />,
  },
  {
    label: "Responsável Técnico",
    href: "/dashboard/technical-manager",
    icon: <MdEngineering size={44} />,
  },
];

const selfInspectionSchema = yup.object().shape({
  numeroVistoria: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .required(),
  dataInicio: yup.string().required(),
});

const parecerSchema = yup.object().shape({
  parecer: yup.string().required("Selecione um parecer"),
});

export const SelfInspectionLayout = () => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(selfInspectionSchema),
  });

  const { control: parecerControl, handleSubmit: handleParecerSubmit } =
    useForm({
      resolver: yupResolver(parecerSchema),
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const params = useParams();
  const propriedadeId = params?.id as string;
  const { data } = useObjectionData();
  const createSelfInspection = useCreateSelfInspection();
  const sendParecer = useSendParecerAutoVistoria();
  const { data: selfInspectionsData, refetch: refetch } = useGetSelfInspections(
    Number(propriedadeId)
  );

  const selfInspections = selfInspectionsData ?? [];

  if (!data) {
    return <div>Carregando...</div>;
  }

  const { farmData } = data;

  const farmInfoRows = [
    [
      { label: "Cadastro Ambiental Rural (CAR)", value: farmData.car },
      { label: "Código Voucher PREM", value: farmData.vouches },
    ],
    [
      { label: "Nome da propriedade", value: farmData.nome },
      { label: "Município", value: farmData.municipio },
      { label: "Estado", value: farmData.estado },
    ],
    [
      { label: "Etapa Atual:", value: farmData.etapa },
      { label: "Status", value: farmData.status },
    ],
  ];

  const formatDateToISO = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    if (!day || !month || !year) return dateStr;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const formatDateFromISO = (isoDateStr: string) => {
    if (!isoDateStr) return "";
    const datePart = isoDateStr.split("T")[0]; // Pega só a data

    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleViewDCS = () => {
    const primeiraUrl =
      selfInspections?.[0]?.formularios?.reportUrl || "https://chatgpt.com/";

    if (primeiraUrl) {
      setReportUrl(primeiraUrl);
    } else {
      alert("Nenhum documento encontrado");
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Por favor, selecione apenas arquivos PDF");
        return;
      }

      setSelectedFile(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];

      if (file.type !== "application/pdf") {
        toast.error("Por favor, selecione apenas arquivos PDF");
        return;
      }

      setSelectedFile(file);
    }
  };

  const canSendParecer = selectedFile !== null;

  const onParecerSubmit = async (formData: any) => {
    if (!selectedFile) {
      toast.error("Por favor, selecione um arquivo");
      return;
    }

    try {
      await sendParecer.mutateAsync({
        id: selfInspections[0]?.id,
        status: formData.parecer.toUpperCase(),
        file: selectedFile,
      });
      toast.success("Parecer salvo com sucesso!");
      setReportUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar parecer!");
    }
  };

  const onSubmit = (formData: any) => {
    createSelfInspection.mutate(
      {
        dataInicio: formatDateToISO(formData.dataInicio),
        idPropriedade: Number(propriedadeId),
      },
      {
        onSuccess: (data) => {
          console.log(data);
          setTimeout(() => {
            setIsModalOpen(false);
          }, 5000);
          toast.success("Agendamento realizado com sucesso!");
          refetch();
        },
        onError: (error: any) => {
          console.log(error);
          toast.error("Erro ao agendar vistoria.");
        },
      }
    );
  };

  return (
    <LayoutContainer title="Análise Socioambiental" menuItems={customMenuItems}>
      <button
        onClick={() => router.push(`/dashboard/properties/${propriedadeId}`)}
        className="text-[#21801A] flex items-center gap-3"
      >
        <GoArrowLeft size={28} />
      </button>
      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Autovistoria
      </h1>
      <InfoGrid rows={farmInfoRows} data={[]} />
      <div className="flex justify-end">
        <Button
          variant="dark"
          className="my-6"
          onClick={() => setIsModalOpen(true)}
        >
          Criar uma agenda
        </Button>
      </div>

      <Modal.Container
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Modal.Header className="bg-[#21801A] font-semibold text-center uppercase p-4 text-white !mb-0">
          AGENDA
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="flex justify-center items-center">
            <p className="text-[#21801A] font-bold">
              Determine o período da vistoria
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <InputSelect
              label="Número da vistoria"
              name="numeroVistoria"
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
              ]}
              control={control}
            />
            <Input
              label="Data de início"
              name="dataInicio"
              control={control}
              mask={maskDate}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                variant="dark"
                disabled={createSelfInspection.isPending}
              >
                {createSelfInspection.isPending ? (
                  <TbLoaderQuarter className="animate-spin" />
                ) : (
                  "Agendar"
                )}
              </Button>
            </div>
          </form>
        </Modal.Body>
        <Modal.CloseButton onClose={() => setIsModalOpen(false)} />
      </Modal.Container>

      <h1 className="bg-[#1A6415] text-xl text-white font-semibold text-center py-2">
        Vistorias
      </h1>

      <Table.Container className="!pt-0">
        <Table.Header>
          <Table.Title>Data da vistoria</Table.Title>
          <Table.Title>Status da vistoria</Table.Title>
          <Table.Title>Vistoria</Table.Title>
          <Table.Title>Ações</Table.Title>
        </Table.Header>
        <Table.Body>
          {selfInspections.map((inspection: any) => (
            <Table.Row key={inspection.id}>
              <Table.Cell>
                {formatDateFromISO(inspection.dataInicio)}
              </Table.Cell>
              <Table.Cell>{inspection.statusVistoria}</Table.Cell>
              <Table.Cell>{inspection.vistoria}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Tooltip message="Visualizar" id={`view-${inspection.id}`}>
                    <button
                      onClick={() => handleViewDCS()}
                      className="cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <Eye />
                    </button>
                  </Tooltip>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>

      {reportUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded-lg overflow-hidden flex flex-col">
            <div className="p-2 bg-gray-100 flex justify-between items-center">
              <span className="font-bold text-lg">Relatório da Vistoria</span>
              <button
                onClick={() => setReportUrl(null)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Fechar
              </button>
            </div>
            <iframe
              src={reportUrl}
              className="flex-1"
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Relatório da Vistoria"
            />
            <form
              onSubmit={handleParecerSubmit(onParecerSubmit)}
              className="p-4"
            >
              <section className="border rounded-md shadow bg-white">
                <div className="bg-[#21801A] text-white px-4 py-2 font-semibold flex justify-between items-center">
                  Parecer da Autovistoria
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
                          control={parecerControl}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Radio
                          name="parecer"
                          value="indeferido"
                          label="Indeferido"
                          control={parecerControl}
                        />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Container>
              </section>

              <section
                className={`border rounded-md shadow bg-white mt-4 transition-colors ${
                  isDragOver ? "border-blue-400 bg-blue-50" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="bg-[#21801A] text-white px-4 py-2 font-semibold flex justify-between items-center">
                  Faça o upload do parecer da analise da autovistoria
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={onFileChange}
                />

                <Table.Container className="!pt-0">
                  <Table.Header>
                    <Table.Title colspan={3}>
                      Descrição do documento
                    </Table.Title>
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
                            <FiUpload />
                          </button>
                          <button
                            type="button"
                            onClick={clearFile}
                            className="inline-flex items-center gap-2 hover:underline disabled:opacity-50"
                            title="Remover arquivo"
                            disabled={!selectedFile}
                          >
                            <IoTrashSharp className="text-red-500" />
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Container>
              </section>

              <div className="flex justify-center mt-4">
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
          </div>
        </div>
      )}
    </LayoutContainer>
  );
};
