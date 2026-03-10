import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoSearchSharp } from "react-icons/io5";
import { TbLoaderQuarter } from "react-icons/tb";

import { Input } from "@/components/Input";
import { InputFileUpload } from "@/components/InputFile";
import { InputSelect } from "@/components/InputSelect";
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/ui/button";
import { Modal } from "@/layouts/DashboardUser/Properties/[id]/SelfInspection/components/Modal";

import { yup } from "@/config/yup";
import {
  useCreateGuideline,
  useUpdateGuideline,
} from "@/hooks/useGuidelines/useGuidelines";
import { useUserRoleStore } from "@/store/useUserRoleStore";
import { maskDate } from "@/utils/maskDate";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

const guidelineSchema = yup.object().shape({
  titulo: yup
    .string()
    .required()
    .min(3, "Título deve ter pelo menos 3 caracteres"),
  descricao: yup
    .string()
    .required()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  tipo: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .required(),
  arquivo: yup.mixed().when("tipo", {
    is: (tipo: any) => tipo?.value === "pdf",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable(),
  }),
  urlVideo: yup.string().when("tipo", {
    is: (tipo: any) => tipo?.value === "video",
    then: (schema) => schema.required().url(),
    otherwise: (schema) => schema.nullable(),
  }),
  capaArquivo: yup.mixed().required(),
  statusExibicao: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .required("!"),
});

type Guideline = {
  id: number;
  titulo: string;
  data: string;
  descricao: string;
  tipo: "pdf" | "video";
  urlArquivo: string;
  nomeArquivoOriginal: string;
  urlCapaArquivo?: string;
  dataCriacao: string;
  ativo: boolean;
};

type FilterGuidelinesProps = {
  onFilter: (filters: any) => void;
  editingGuideline?: Guideline | null;
  onCloseEdit?: () => void;
};

export const FilterGuidelines = ({
  onFilter,
  editingGuideline,
  onCloseEdit,
}: FilterGuidelinesProps) => {
  const { control, handleSubmit, reset } = useForm();
  const { role } = useUserRoleStore();

  const {
    control: modalControl,
    handleSubmit: handleModalSubmit,
    reset: resetModal,
    setValue,
  } = useForm({
    resolver: yupResolver(guidelineSchema),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const createGuideline = useCreateGuideline();
  const updateGuideline = useUpdateGuideline();
  const isEditMode = !!editingGuideline;

  const watchedTipo = useWatch({
    control: modalControl,
    name: "tipo",
  });

  const watchedCapaArquivo = useWatch({
    control: modalControl,
    name: "capaArquivo",
  });

  const getTipoValue = (tipo: any): string => {
    if (typeof tipo === "string") return tipo;
    if (tipo && typeof tipo === "object" && "value" in tipo) return tipo.value;
    return "";
  };

  useEffect(() => {
    if (watchedCapaArquivo && watchedCapaArquivo instanceof File) {
      const file = watchedCapaArquivo;
      setFileName(file.name);

      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreviewUrl(null);
        setFileName("Arquivo de capa deve ser uma imagem");
      }
    } else {
      setPreviewUrl(null);
      setFileName("");
    }
  }, [watchedCapaArquivo]);

  useEffect(() => {
    if (editingGuideline) {
      setIsModalOpen(true);
      setValue("titulo", editingGuideline.titulo);
      setValue("descricao", editingGuideline.descricao);
      setValue("tipo", {
        label: editingGuideline.tipo === "pdf" ? "PDF" : "Vídeo",
        value: editingGuideline.tipo,
      });
      setValue("statusExibicao", {
        label: "Ativo",
        value: "ativo",
      });
    }
  }, [editingGuideline, setValue]);

  const handleFilterGuidelines = (data: any) => {
    const formattedData = {
      ...data,
      tipo: data.tipo?.value,
    };
    onFilter(formattedData);
  };

  const clearFilter = () => {
    reset();
    onFilter({});
  };

  const isAdmin = role === "ADMINISTRATIVO";

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetModal();
    if (onCloseEdit) {
      onCloseEdit();
    }
  };

  const handleSaveGuideline = async (data: any) => {
    try {
      const formData = new FormData();

      formData.append("titulo", data.titulo);
      formData.append("descricao", data.descricao);
      formData.append("tipo", data.tipo.value.toLowerCase());
      formData.append(
        "ativo",
        data.statusExibicao.value === "ativo" ? "true" : "false"
      );

      if (data.capaArquivo && data.capaArquivo instanceof File) {
        formData.append("capaArquivo", data.capaArquivo);
      }

      if (data.arquivo && data.arquivo instanceof File) {
        formData.append("arquivo", data.arquivo);
      }

      if (data.tipo.value === "video" && data.urlVideo) {
        formData.append("urlVideo", data.urlVideo);
      }

      if (isEditMode && editingGuideline) {
        const isActive = data.statusExibicao.value === "ativo";
        await updateGuideline.mutateAsync({
          id: editingGuideline.id.toString(),
          ativo: isActive,
        });
      } else {
        await createGuideline.mutateAsync(formData);
      }

      handleCloseModal();

      if (isEditMode) {
        toast.success("Documento orientativo atualizado com sucesso!");
      } else {
        toast.success("Documento orientativo criado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar documento orientativo:", error);
      if (isEditMode) {
        toast.error("Erro ao atualizar documento orientativo");
      } else {
        toast.error("Erro ao salvar documento orientativo");
      }
    }
  };

  return (
    <>
      <form
        className="flex items-center gap-4 py-6 px-4"
        onSubmit={handleSubmit(handleFilterGuidelines)}
      >
        <Input
          name="titulo"
          label="Nome do arquivo"
          placeholder="Digite o nome do arquivo"
          control={control}
        />

        <InputSelect
          name="tipo"
          label="Tipo"
          placeholder="Selecione"
          control={control}
          options={[
            { label: "PDF", value: "pdf" },
            { label: "Vídeo", value: "video" },
          ]}
        />

        <Input
          name="date"
          label="Data de upload"
          placeholder="Digite a data de upload"
          control={control}
          mask={maskDate}
        />

        <div className="pt-4 flex items-center gap-4">
          <Button type="submit" variant="green" className="mt-4">
            Buscar <IoSearchSharp size={20} />
          </Button>
          <Button
            type="button"
            variant="danger"
            className="mt-4"
            onClick={clearFilter}
          >
            Limpar
          </Button>
          {isAdmin && (
            <Button
              type="button"
              variant="dark"
              className="mt-4"
              onClick={handleOpenModal}
            >
              <FiPlus size={20} /> Novo
            </Button>
          )}
        </div>
      </form>

      <Modal.Container
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        className="rounded-lg !max-w-4xl"
      >
        <Modal.CloseButton onClose={handleCloseModal} />
        <Modal.Header className="bg-green-50 text-green-800">
          {isEditMode ? "Editar" : "Cadastrar"} Roteiros Orientativos
        </Modal.Header>
        <Modal.Body className="p-6">
          <form
            onSubmit={handleModalSubmit(handleSaveGuideline)}
            id="guideline-form"
          >
            <div className="flex gap-6">
              <div className="flex flex-col items-center w-1/3">
                <div className="text-sm text-[#21801A] mb-4">
                  Pré-Visualização
                </div>

                <div className="w-full max-w-64 overflow-hidden shadow-sm border border-gray-200 rounded-lg mb-4">
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Preview da Capa"
                        width={256}
                        height={192}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src="/placeholder-image.png"
                        alt="Preview"
                        width={120}
                        height={120}
                        className="opacity-60"
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-[#0A3503] font-semibold text-base mb-1">
                      {fileName || "Novo Documento"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {new Date().toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                      {watchedTipo
                        ? `Tipo: ${getTipoValue(watchedTipo)}`
                        : "Selecione o tipo do documento"}
                    </p>

                    <div className="w-full">
                      {getTipoValue(watchedTipo) === "pdf" ? (
                        <Button
                          variant="green"
                          className="w-full rounded-full py-2 text-sm font-medium"
                          disabled
                        >
                          {previewUrl ? "Alterar" : "Selecionar"} Arquivo
                        </Button>
                      ) : getTipoValue(watchedTipo) === "video" ? (
                        <Button
                          variant="dark"
                          className="w-full rounded-full py-2 text-sm font-medium"
                          disabled
                        >
                          Assistir
                        </Button>
                      ) : (
                        <Button
                          variant="green"
                          className="w-full rounded-full py-2 text-sm font-medium"
                          disabled
                        >
                          Baixar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <Input
                  name="titulo"
                  label="Nome do Arquivo"
                  placeholder="Digite o nome do arquivo"
                  control={modalControl}
                />

                <TextArea
                  name="descricao"
                  label="Descrição do Arquivo"
                  placeholder="Digite a descrição do arquivo"
                  control={modalControl}
                />

                {getTipoValue(watchedTipo) === "video" ? (
                  <Input
                    name="urlVideo"
                    label="URL do Vídeo (YouTube)"
                    placeholder="https://www.youtube.com/watch?v=..."
                    control={modalControl}
                  />
                ) : (
                  <InputFileUpload
                    name="arquivo"
                    label={
                      getTipoValue(watchedTipo) === "pdf"
                        ? "Insira o Arquivo PDF"
                        : "Insira o Arquivo"
                    }
                    control={modalControl}
                    accept=".pdf"
                  />
                )}

                <InputFileUpload
                  name="capaArquivo"
                  label="Capa do Arquivo"
                  control={modalControl}
                />

                <div className="flex gap-4">
                  <div className="w-32">
                    <InputSelect
                      name="tipo"
                      label="Tipo"
                      placeholder="pdf"
                      control={modalControl}
                      options={[
                        { label: "PDF", value: "pdf" },
                        { label: "Vídeo", value: "video" },
                      ]}
                    />
                  </div>
                  <div className="flex-1">
                    <InputSelect
                      name="statusExibicao"
                      label="Status da Exibição"
                      placeholder="Ativo"
                      control={modalControl}
                      options={[
                        { label: "Ativo", value: "ativo" },
                        { label: "Inativo", value: "inativo" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="bg-gray-50">
          <Button
            type="submit"
            variant="green"
            form="guideline-form"
            className="px-8"
            disabled={createGuideline.isPending || updateGuideline.isPending}
          >
            {createGuideline.isPending || updateGuideline.isPending ? (
              <TbLoaderQuarter className="animate-spin" />
            ) : isEditMode ? (
              "Atualizar"
            ) : (
              "Salvar"
            )}
          </Button>
        </Modal.Footer>
      </Modal.Container>
    </>
  );
};
