"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiLoader, FiPlus, FiUpload } from "react-icons/fi";
import { IoArrowBack, IoTrashSharp } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { ClipLoader } from "react-spinners";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";

import { api } from "@/api";
import {
  QUERY_KEY_GET_FARM_BY_ID,
  useGetFarmById,
} from "@/hooks/useFarms/useGetFarmById";
import { useGetMainActivity } from "@/hooks/useFarms/useGetMainActivity";
import { useGetProductionCycle } from "@/hooks/useFarms/useGetProductionCycle";
import { useUpdateFarm } from "@/hooks/useFarms/useUpdateFarm";
import { useFarmStore } from "@/store/useFarmStore";
import { maskCep } from "@/utils/maskCEP";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Document {
  type: string;
  checked: boolean;
  file?: File;
  uploadDate?: string;
  nomeArquivo?: string;
  urlArquivo?: string;
}

const initialDocuments: Document[] = [
  { type: "CONTRATO", checked: false, file: undefined, uploadDate: undefined },
  {
    type: "COMPROVANTE CAR",
    checked: false,
    file: undefined,
    uploadDate: undefined,
  },
  { type: "TAXA CAR", checked: false, file: undefined, uploadDate: undefined },
];

export const RegisterFarmLayout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { control, handleSubmit, setValue } = useForm();
  const { farmStore } = useFarmStore();
  const { data: mainActivity } = useGetMainActivity();
  const { data: productionCycle } = useGetProductionCycle();
  const { mutateAsync: updateFarm, isPending } = useUpdateFarm();
  const { data: farm } = useGetFarmById(farmStore.id);

  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [isEditing, setIsEditing] = useState(false);

  const isCadastro = !farm?.endereco?.cep;
  const shouldShowForm = isCadastro || isEditing;

  useEffect(() => {
    if (farm) {
      setValue("cep", farm?.endereco?.cep || "");
      setValue("logradouro", farm?.endereco?.logradouro || "");
      setValue("complemento", farm?.endereco?.complemento || "");
      setValue("longitude", farm?.endereco?.longitude || "");
      setValue("latitude", farm?.endereco?.latitude || "");

      if (mainActivity && productionCycle) {
        const atividadePrincipal = mainActivity.find(
          (activity) => activity.id === farm.idAtividadePrincipal
        );
        const cicloProducao = productionCycle.find(
          (cycle) => cycle.id === farm.idClicloProducao
        );

        setValue("atividadePrincipal", {
          value: farm.idAtividadePrincipal || "",
          label: atividadePrincipal?.descricao || "",
        });

        setValue("cicloProducao", {
          value: farm.idClicloProducao || "",
          label: cicloProducao?.descricao || "",
        });
      }

      setValue("tamanhoPropriedade", farm.tamanhoPropriedade || "");
      setValue("numeroProprietarios", farm.numeroProprietarios || "");

      const existingDocs =
        farm.documentos?.map((doc) => ({
          type: doc.tipo,
          checked: true,
          file: undefined,
          uploadDate: new Date().toLocaleDateString("pt-BR"),
          nomeArquivo: doc.nomeArquivo,
          urlArquivo: doc.urlArquivo,
        })) || [];

      const initial = initialDocuments.filter(
        (initDoc) => !existingDocs.find((d) => d.type === initDoc.type)
      );

      setDocuments([...existingDocs, ...initial]);
    }
  }, [farm, mainActivity, productionCycle, setValue]);

  const handleUpdateFarm = async (data: any) => {
    if (farmStore?.cidade && farmStore?.id) {
      const formData = {
        idPropriedade: farmStore?.id,
        data: {
          endereco: {
            cep: data.cep || "",
            logradouro: data.logradouro || "",
            complemento: data.complemento || "",
            municipio: farmStore?.cidade,
            estado: "MT",
            codigoPostal: data.codigoPostal || "",
            longitude: data.longitude ? Number(data.longitude) : 0,
            latitude: data.latitude ? Number(data.latitude) : 0,
          },
          idCicloProducao: data.cicloProducao?.value || null,
          idAtividadePrincipal: data.atividadePrincipal?.value || null,
          tamanhoPropriedade: data.tamanhoPropriedade || null,
          numeroProprietarios: data.numeroProprietarios || null,
        },
      };

      await updateFarm(formData, {
        onSuccess: () => {
          toast.success("Propriedade atualizada com sucesso!");
        },
      });
    }
  };

  const handleCheckboxChange = (index: number) => {
    setDocuments((prevDocuments) => {
      const updatedDocuments = prevDocuments.map((doc, i) => {
        if (i === index) {
          return { ...doc, checked: !doc.checked };
        }
        return doc;
      });

      return updatedDocuments;
    });
  };

  const handleFileChange = (index: number, file: File) => {
    setDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments];
      updatedDocuments[index].file = file;
      updatedDocuments[index].uploadDate = new Date().toLocaleDateString(
        "pt-BR"
      );
      return updatedDocuments;
    });
  };

  const handleRemoveFile = (index: number) => {
    setDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments];
      updatedDocuments[index].file = undefined;
      updatedDocuments[index].uploadDate = undefined;
      return updatedDocuments;
    });
  };

  const handleUploadDocuments = async () => {
    const files = documents
      .filter((doc) => doc.checked && doc.file)
      .map((doc) => doc.file) as File[];

    const parameters = documents
      .filter((doc) => doc.checked && doc.file)
      .map((doc) => ({
        nome: doc.file?.name,
        tipo: doc.type,
      }));

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("arquivos", file);
    });
    formData.append("parametros", JSON.stringify(parameters));

    try {
      await api.post(
        `/propriedade-prem/${farm?.id}/upload-documentos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Documentos enviados com sucesso!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_GET_FARM_BY_ID],
      });
    } catch (error) {
      toast.error("Erro ao enviar documentos!");
      console.error("Erro ao enviar documentos:", error);
    }
  };

  const isLoading = !farm || !mainActivity || !productionCycle;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#21801A" />
      </div>
    );
  }

  return (
    <LayoutContainer
      title="Dados da Propriedade"
      actions={
        <>
          {farm?.endereco?.cep && (
            <Tooltip message="Editar dados" id="Editar dados" position="bottom">
              <button
                className="border-2 border-[#CAC4D0] p-1 rounded"
                type="button"
                onClick={() => setIsEditing((prevState) => !prevState)}
              >
                <MdOutlineEdit size={20} color="#CAC4D0" />
              </button>
            </Tooltip>
          )}
        </>
      }
    >
      <button
        onClick={() => router.back()}
        className="text-[#CAC4D0] border-2 border-[#CAC4D0] p-1 rounded flex gap-2 items-center mb-4"
      >
        <IoArrowBack size={24} />
      </button>
      <div className="grid grid-cols-3 gap-8 p-4">
        <div>
          <h2 className="text-[#21801A]">Cadastro Ambiental Rural (CAR)</h2>
          <p>{farmStore?.carFederal}</p>
        </div>
        <div>
          <h2 className="text-[#21801A]">Código Voucher PREM</h2>
          <p>{farmStore?.voucher}</p>
        </div>

        <div className="col-span-3 mt-4">
          <div className="grid grid-cols-3">
            <div>
              <h2 className="text-[#21801A]">Nome da propriedade*</h2>
              <p>{farmStore?.nomePropriedade}</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Município*</h2>
              <p>{farmStore?.cidade}</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Estado</h2>
              <p>MT</p>
            </div>
          </div>
        </div>
      </div>
      {!shouldShowForm && (
        <div className="grid grid-cols-4 gap-8 p-4 mt-6">
          {(() => {
            const formatField = (value: any) => {
              if (
                value === null ||
                value === undefined ||
                value === "" ||
                value === 0
              ) {
                return "Não informado";
              }
              return value;
            };

            const atividade = mainActivity?.find(
              (a) => a.id === farm?.idAtividadePrincipal
            );
            const ciclo = productionCycle?.find(
              (c) => c.id === farm?.idClicloProducao
            );

            return (
              <>
                <div>
                  <h2 className="text-[#21801A]">CEP</h2>
                  <p>{formatField(farm?.endereco?.cep)}</p>
                </div>
                <div>
                  <h2 className="text-[#21801A]">Logradouro</h2>
                  <p>{formatField(farm?.endereco?.logradouro)}</p>
                </div>
                <div>
                  <h2 className="text-[#21801A]">Complemento</h2>
                  <p>{formatField(farm?.endereco?.complemento)}</p>
                </div>
                <div>
                  <h2 className="text-[#21801A]">Código Postal</h2>
                  <p>{formatField(farm?.endereco?.caixaPostal)}</p>
                </div>

                <div className="col-span-4 mt-4 grid grid-cols-4 gap-8">
                  <div>
                    <h2 className="text-[#21801A]">Longitude</h2>
                    <p>{formatField(farm?.endereco?.longitude)}</p>
                  </div>
                  <div>
                    <h2 className="text-[#21801A]">Latitude</h2>
                    <p>{formatField(farm?.endereco?.latitude)}</p>
                  </div>
                  <div>
                    <h2 className="text-[#21801A]">
                      Tamanho da propriedade (Hectares)
                    </h2>
                    <p>{formatField(farm?.tamanhoPropriedade)}</p>
                  </div>
                  <div>
                    <h2 className="text-[#21801A]">
                      Número de proprietários legais
                    </h2>
                    <p>{formatField(farm?.numeroProprietarios)}</p>
                  </div>
                  <div>
                    <h2 className="text-[#21801A]">Atividade Principal</h2>
                    <p>{formatField(atividade?.descricao)}</p>
                  </div>
                  <div>
                    <h2 className="text-[#21801A]">Ciclo de produção</h2>
                    <p>{formatField(ciclo?.descricao)}</p>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {shouldShowForm && (
        <form
          className="flex flex-col gap-4 p-4"
          onSubmit={handleSubmit(handleUpdateFarm)}
        >
          <div className="flex items-center gap-2">
            <Input
              name="cep"
              label="CEP"
              placeholder="Digite o CEP"
              className="w-[300px]"
              mask={maskCep}
              control={control}
            />
            <div className="w-full">
              <Input
                name="logradouro"
                label="Logradouro*"
                placeholder="Digite o Logradouro"
                control={control}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Input name="complemento" label="Complemento" control={control} />
            <Input
              name="codigoPostal"
              label="Código Postal"
              control={control}
            />
            <Input
              name="longitude"
              label="Longitude"
              type="number"
              control={control}
            />
            <Input
              name="latitude"
              label="Latitude"
              type="number"
              control={control}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <InputSelect
              name="atividadePrincipal"
              label="Atividade Principal"
              placeholder="Selecione uma opção"
              control={control}
              options={mainActivity?.map((item) => ({
                value: item.id,
                label: item.descricao,
              }))}
            />

            <InputSelect
              name="cicloProducao"
              label="Ciclo de produção*"
              placeholder="Selecione uma opção"
              options={productionCycle?.map((item) => ({
                value: item.id,
                label: item.descricao,
              }))}
              control={control}
            />
            <Input
              name="tamanhoPropriedade"
              type="number"
              label="Tamanho da propriedade (Hectares)"
              control={control}
            />
            <Input
              name="numeroProprietarios"
              type="number"
              label="Número de proprietários legais*"
              control={control}
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button className="w-[253px]" variant="green" type="submit">
              {isPending ? <FiLoader /> : "Salvar"}
            </Button>
            <Button
              className="w-[253px]"
              variant="dark"
              disabled={!farm?.endereco?.cep}
              type="button"
              onClick={() =>
                router.push(`/propriedade/${farmStore.id}/proprietario`)
              }
            >
              <FiPlus size={20} /> Adicionar Proprietário
            </Button>
          </div>
        </form>
      )}
      <div className="p-4 flex flex-col gap-4">
        <div className="rounded mt-8">
          <h5 className="text-[#1A6415] text-xl font-bold">
            Documentos da propriedade
          </h5>
        </div>
        <Table.Container>
          <Table.Header>
            <Table.Title className="text-[#21801A] font-normal">
              Descrição do arquivo
            </Table.Title>
            <Table.Title className="text-[#21801A] font-normal">
              Nome do arquivo
            </Table.Title>
            <Table.Title className="text-[#21801A] font-normal">
              Data de upload
            </Table.Title>
            <Table.Title className="text-[#21801A] font-normal">
              {""}
            </Table.Title>
          </Table.Header>
          <Table.Body>
            {documents.map((doc, index) => (
              <Table.Row key={index}>
                <Table.Cell className="border-none text-gray-900">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-[#21801A]"
                      checked={doc.checked}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    {doc.type === "CONTRATO" &&
                      "Escritura, matrícula, contrato de compra ou arrebatamento"}
                    {doc.type === "COMPROVANTE CAR" && "Comprovante CAR"}
                    {doc.type === "TAXA CAR" &&
                      "Comprovante de pagamento da taxa CAR"}
                  </label>
                </Table.Cell>
                <Table.Cell className="border-none">
                  {doc.nomeArquivo || doc.file?.name || "-"}
                </Table.Cell>
                <Table.Cell className="border-none">
                  {doc.uploadDate || "-"}
                </Table.Cell>
                <Table.Cell className="border-none flex gap-2 items-center">
                  {doc.urlArquivo ? (
                    <Link
                      href={doc.urlArquivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Visualizar documento"
                    >
                      <FiEye size={18} />
                    </Link>
                  ) : doc.checked && !doc.file ? (
                    <label className="cursor-pointer">
                      <FiUpload size={18} />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files &&
                          handleFileChange(index, e.target.files[0])
                        }
                      />
                    </label>
                  ) : null}

                  {doc.file && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-600"
                    >
                      <IoTrashSharp size={18} />
                    </button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Container>
        {documents.some(
          (doc) => doc.checked && !doc.nomeArquivo && !doc.file
        ) && (
          <div className="mt-4 flex justify-end">
            <Button variant="dark" onClick={handleUploadDocuments}>
              Enviar documentação
            </Button>
          </div>
        )}
      </div>
    </LayoutContainer>
  );
};
