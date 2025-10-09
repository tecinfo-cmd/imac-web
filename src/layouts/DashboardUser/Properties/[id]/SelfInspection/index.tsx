"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoArrowLeft } from "react-icons/go";
import {
  PiFarmLight,
  PiSealCheckLight,
  PiUserCircleThin,
} from "react-icons/pi";

import { Modal } from "./components/Modal";
import { InfoGrid } from "@/components/InfoGrid";
import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import { useCreateSelfInspection } from "@/hooks/useGetProperties/useCreateSelfInspection";
import { useGetSelfInspections } from "@/hooks/useGetProperties/useCreateSelfInspection";
import { useObjectionData } from "@/hooks/useGetProperties/useObjectionData";
import { Abattoir } from "@/icons/Abattoir";
import { Analityc } from "@/icons/Analityc";
import { Eye } from "@/icons/Eye";
import { maskDate } from "@/utils/maskDate";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

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

export const SelfInspectionLayout = () => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(selfInspectionSchema),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const propriedadeId = params?.id as string;
  const { data } = useObjectionData();
  const createSelfInspection = useCreateSelfInspection();

  const { data: selfInspectionsData } = useGetSelfInspections();

  const selfInspections = selfInspectionsData?.data ?? [];

  if (!data) {
    return <div>Carregando...</div>;
  }

  const { farmData } = data;

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

  const formatDateToISO = (dateStr: string) => {
    // Espera "dd/mm/yyyy" e retorna "yyyy-mm-dd"
    const [day, month, year] = dateStr.split("/");
    if (!day || !month || !year) return dateStr;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const onSubmit = (formData: any) => {
    createSelfInspection.mutate(
      {
        dataInicio: formatDateToISO(formData.dataInicio),
        idPropriedade: Number(propriedadeId),
      },
      {
        onSuccess: (data) => {
          toast.success(data.mensagem || "Agendamento realizado com sucesso!");
        },
        onError: (error: any) => {
          // Se a API retorna a mensagem de erro em error.response.data.mensagem
          const apiMessage =
            error?.response?.data?.mensagem ||
            error?.message ||
            "Erro ao agendar vistoria.";
          toast.error(apiMessage);
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
              <Button type="submit" variant="dark">
                Agendar
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
              <Table.Cell>{inspection.dataInicio}</Table.Cell>
              <Table.Cell>{inspection.statusVistoria}</Table.Cell>
              <Table.Cell>{inspection.vistoria}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Tooltip message="Visualizar" id={`view-${inspection.id}`}>
                    <Eye />
                  </Tooltip>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>
    </LayoutContainer>
  );
};
