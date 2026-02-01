"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FiLoader } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { ClipLoader } from "react-spinners";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { LayoutContainer } from "@/components/LayoutContainer";
import { TextArea } from "@/components/TextArea";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";

import { api } from "@/api";
import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { useGetMainActivity } from "@/hooks/useFarms/useGetMainActivity";
import { useGetProductionCycle } from "@/hooks/useFarms/useGetProductionCycle";
import { useLinkOwnerToFarm } from "@/hooks/useFarms/useLinkOwnerToFarm";
import { useUpdateFarm } from "@/hooks/useFarms/useUpdateFarm";
import { useFarmStore } from "@/store/useFarmStore";
import { maskCep } from "@/utils/maskCEP";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import { PropertieDocument } from "./Propertie-Document";
import { RegisterOwner } from "./Register-Owner";
import type { RegisterOwnerRef } from "./Register-Owner";
import { farmSchema } from "./Register-Owner/schema";

type Documento = {
  id: number;
  nomeArquivo: string;
  nomeArquivoOriginal: string;
  urlArquivo: string;
  tipo: string;
};

type DocumentoOuFile = Documento | File;

const removeRgMask = (rg: string) => rg.replace(/\D/g, "");
const formatDateToISO = (dateStr: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
      2,
      "0"
    )}`;
  }
  return dateStr;
};

export const RegisterFarmLayout = () => {
  const [documentos, setDocumentos] = useState<DocumentoOuFile[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [owners, setOwners] = useState<any[]>([]);
  const ownerRefs = useRef<(RegisterOwnerRef | null)[]>([]);

  const router = useRouter();
  const { control, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(farmSchema),
  });
  const { farmStore } = useFarmStore();
  const { data: mainActivity } = useGetMainActivity();
  const { data: productionCycle } = useGetProductionCycle();
  const { mutateAsync: updateFarm, isPending } = useUpdateFarm();
  const { data: farm, refetch } = useGetFarmById(farmStore.id);
  const linkOwnerMutation = useLinkOwnerToFarm(farmStore.id!);

  const propertieNumber = watch("numeroProprietarios");
  const proprietarios = farm?.proprietarios || [];
  const mainOwner = proprietarios.find(
    (p) => p.tipoProprietario === "PROPRIETARIO"
  );
  const coOwners = proprietarios.filter(
    (p) => p.tipoProprietario === "COPROPRIETARIO"
  );

  const hability = farm?.endereco && Object.keys(farm.endereco).length > 0;

  useEffect(() => {
    if (!farm) return;
    setValue("cep", farm.endereco?.cep || "");
    setValue("logradouro", farm.endereco?.logradouro || "");
    setValue("atividadePrincipal", {
      value: Number(farm.atividadePrincipal?.id) || 0,
      label: farm.atividadePrincipal?.descricao || "",
    });
    setValue("cicloProducao", {
      value: Number(farm.cicloProducao?.id) || 0,
      label: farm.cicloProducao?.descricao || "",
    });
    setValue("numeroProprietarios", farm.numeroProprietarios ?? 0);
    if (farm.documentos) {
      setDocumentos(
        farm.documentos.map((doc) => ({
          ...doc,
          nomeArquivoOriginal: doc.nomeArquivoOriginal ?? "",
        }))
      );
    }
  }, [farm, setValue]);

  useEffect(() => {
    if (!farm?.endereco || Object.keys(farm.endereco).length === 0) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [farm]);

  const validateOwners = async () => {
    if (ownerRefs.current.length === 0) return true;
    const results = await Promise.all(
      ownerRefs.current.map((ref) =>
        ref?.validate ? ref.validate() : Promise.resolve({ isValid: true })
      )
    );
    const invalidIndexes = results
      .map((result, idx) => (result && result.isValid === false ? idx : null))
      .filter((idx) => idx !== null);
    if (invalidIndexes.length > 0) {
      invalidIndexes.forEach((idx) => {
        toast.error(
          `Preencha todos os campos do coproprietário ${Number(idx) + 1}!`
        );
      });
      return false;
    }
    return true;
  };

  const handleUpdateFarm = async (data: any) => {
    if (documentos.length < 3) {
      toast.error("Adicione os 3 documentos obrigatórios antes de salvar!");
      return;
    }
    if (!(await validateOwners())) return;

    if (farmStore?.cidade && farmStore?.id) {
      const formData = {
        idPropriedade: farmStore.id,
        data: {
          endereco: {
            cep: data.cep || "",
            logradouro: data.logradouro || "",
            complemento: data.complemento || "",
            municipio: farmStore.cidade,
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
      await updateFarm(formData);
    }

    let ownersLinked = false;

    try {
      for (const owner of owners) {
        if (!owner?.nome) continue;

        const tipoProprietario = owner.setAsMainOwner
          ? "PROPRIETARIO"
          : "COPROPRIETARIO";

        const item: any = {
          nome: owner.nome,
          cpfCnpj: owner.cpfCnpj,
          rgInscricaoSocial: removeRgMask(owner.rgInscricaoSocial),
          dataNascimento: formatDateToISO(owner.dataNascimento) || "",
          telefone: owner.telefone,
          email: owner.email,
          tipoProprietario,
        };

        if (owner.id) {
          item.idProprietario = owner.id;
        }

        const payload = [item];
        await linkOwnerMutation.mutateAsync(payload);
      }
      ownersLinked = true;
    } catch {
      toast.error("Erro ao enviar coproprietários!");
    }

    const arquivosNovos = documentos.filter(
      (doc) => doc instanceof File
    ) as File[];
    if (arquivosNovos.length >= 3) {
      const formData = new FormData();
      arquivosNovos.forEach((file) => formData.append("arquivos", file));
      const parameters = arquivosNovos.map((file) => ({
        nome: file.name,
        tipo: file.name.split(".").slice(0, -1).join(".").toUpperCase(),
      }));
      formData.append("parametros", JSON.stringify(parameters));
      try {
        await api.post(
          `/propriedade-prem/${farm?.id}/upload-documentos`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Dados enviados com sucesso!");
        setDocumentos(documentos.filter((doc) => !(doc instanceof File)));
        refetch();
      } catch {
        toast.error("Erro ao enviar documentos!");
      }
    } else if (arquivosNovos.length > 0 && arquivosNovos.length < 3) {
      toast.error(
        "Para enviar novos documentos, selecione pelo menos 3 arquivos!"
      );
      return;
    } else {
      // não há novos arquivos para enviar — se os proprietários foram vinculados com sucesso, mostrar sucesso
      if (ownersLinked) {
        toast.success("Dados enviados com sucesso!");
        refetch();
      }
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
          {farm?.endereco && Object.keys(farm.endereco).length > 0 && (
            <Tooltip message="Editar dados" id="Editar dados" position="bottom">
              <button
                className="border-2 border-[#CAC4D0] p-1 rounded"
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
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
          <h2 className="text-[#21801A]">CAR Estadual</h2>
          <p>{farm?.carEstadual || "-"}</p>
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
      <h2 className="text-xl font-bold mt-8 ml-3">Endereço da Propriedade</h2>
      <form
        className="flex flex-col gap-4 p-4 border-b-2"
        onSubmit={handleSubmit(handleUpdateFarm)}
      >
        <div className="flex items-center gap-2">
          <div className="w-full">
            <TextArea
              name="logradouro"
              label="Descrição de acesso a propriedade*"
              placeholder="Digite o Logradouro"
              control={control}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Input
            name="cep"
            label="CEP"
            placeholder="Digite o CEP"
            mask={maskCep}
            control={control}
            disabled={!isEditing}
          />
          <InputSelect
            name="atividadePrincipal"
            label="Atividade Principal"
            placeholder="Selecione uma opção"
            control={control}
            options={mainActivity?.map((item) => ({
              value: item.id,
              label: item.descricao,
            }))}
            disabled={!isEditing}
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
            disabled={!isEditing}
          />
          <Input
            name="numeroProprietarios"
            type="number"
            label="Número de proprietários legais*"
            control={control}
            disabled={!isEditing}
          />
        </div>
      </form>

      {propertieNumber >= 0 && (
        <div className="flex flex-col gap-6 mt-8">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold ml-3">Proprietários</h2>
          </div>
          {mainOwner && (
            <RegisterOwner
              key={mainOwner.id || "main"}
              ref={(el) => {
                ownerRefs.current[0] = el;
              }}
              index={0}
              initialData={{
                nome: mainOwner.pessoa?.nome || "",
                cpfCnpj: mainOwner.pessoa?.cpfCnpj || "",
                rgInscricaoSocial: mainOwner.pessoa?.rgInscricaoSocial || "",
                dataNascimento: mainOwner.pessoa?.dataNascimento || "",
                telefone: mainOwner.telefone || "",
                email: mainOwner.pessoa?.email || "",
                setAsMainOwner: true,
              }}
              disabled={!isEditing}
              onOwnerChange={(data) => {
                setOwners((prev) => {
                  const updated = [...prev];
                  updated[0] = { ...data, id: mainOwner.id };
                  return updated;
                });
              }}
            />
          )}
          {coOwners.map((coOwner, idx) => (
            <RegisterOwner
              key={coOwner.id || `co-${idx}`}
              ref={(el) => {
                ownerRefs.current[idx + 1] = el;
              }}
              index={idx + 1}
              initialData={{
                nome: coOwner.pessoa?.nome || "",
                cpfCnpj: coOwner.pessoa?.cpfCnpj || "",
                rgInscricaoSocial: coOwner.pessoa?.rgInscricaoSocial || "",
                dataNascimento: coOwner.pessoa?.dataNascimento || "",
                telefone: coOwner.telefone || "",
                email: coOwner.pessoa?.email || "",
                setAsMainOwner: false,
              }}
              disabled={!isEditing}
              onOwnerChange={(data) => {
                setOwners((prev) => {
                  const updated = [...prev];
                  updated[idx + 1] = { ...data, id: coOwner.id };
                  return updated;
                });
              }}
            />
          ))}
          {Array.from({
            length:
              (propertieNumber || 1) - (mainOwner ? 1 : 0) - coOwners.length,
          }).map((_, idx) => (
            <RegisterOwner
              key={`new-${idx}`}
              ref={(el) => {
                ownerRefs.current[(mainOwner ? 1 : 0) + coOwners.length + idx] =
                  el;
              }}
              index={(mainOwner ? 1 : 0) + coOwners.length + idx}
              disabled={false}
              onOwnerChange={(data) => {
                setOwners((prev) => {
                  const updated = [...prev];
                  updated[(mainOwner ? 1 : 0) + coOwners.length + idx] = data;
                  return updated;
                });
              }}
            />
          ))}
        </div>
      )}

      <PropertieDocument files={documentos} setFiles={setDocumentos} />
      <div className="flex justify-between mt-4">
        <Link className="underline" href="/dashboard">
          Voltar
        </Link>
        <div className="flex items-center">
          <Button className="px-10" onClick={handleSubmit(handleUpdateFarm)}>
            {isPending ? <FiLoader /> : "Salvar "}
          </Button>
          {hability && (
            <Button
              variant="dark"
              className="px-10 ml-4"
              onClick={() => router.push(`/analise-ambiental/${farm.id}`)}
            >
              Acompanhar Propriedade
            </Button>
          )}
        </div>
      </div>
    </LayoutContainer>
  );
};
