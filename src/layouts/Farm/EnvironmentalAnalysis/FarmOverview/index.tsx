"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLoader } from "react-icons/fi";

import { TableInformation } from "@/components/TableInformation";
import { Button } from "@/components/ui/button";

import { api } from "@/api";
import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { toast } from "sonner";

interface FarmOverviewProps {
  farmId: number;
}

interface Protocol {
  id: number;
  protocolName: string;
  description: string;
}

export const FarmOverview = ({ farmId }: FarmOverviewProps) => {
  const { data: farm } = useGetFarmById(farmId);
  const { register, watch } = useForm();
  const acceptChecked = watch("accept");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisRequested, setAnalysisRequested] = useState(false);

  if (!farm) return <div>Carregando...</div>;

  const owner = farm.proprietarios.find(
    (p) => p.tipoProprietario === "PROPRIETARIO"
  );

  const coOwners = farm.proprietarios.filter(
    (p) => p.tipoProprietario === "COPROPRIETARIO"
  );

  const hasAnalysisResults =
    farm.retornoAnalises && farm.retornoAnalises.length > 0;

  const shouldShowSuccessMessage = hasAnalysisResults || analysisRequested;

  const handleSubmitRequest = async () => {
    if (!farm?.territorios?.[0] || !acceptChecked) {
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading(
      "Enviando solicitação de análise socioambiental..."
    );

    try {
      const { data } = await api.get<Protocol[]>(
        "/agrotools/analise/protocolo"
      );

      const protocol = data[data.length - 1]?.id;

      if (!protocol) {
        toast.error("Protocolo não encontrado.", { id: toastId });
        return;
      }

      const cdTerritory = farm.territorios[0].codigoTerritorio;

      await api.post(`/agrotools/analise/consulta/${farm.id}`, {
        cdTerritory,
        protocol,
      });

      setAnalysisRequested(true);
      toast.dismiss(toastId);

      toast.custom((t) => (
        <div className="relative bg-[#DFEEE5] flex flex-col items-center text-center gap-4 py-6 px-4 shadow border border-[#0A3503] rounded-lg max-w-md w-full">
          <button
            onClick={() => toast.dismiss(t)}
            className="absolute top-2 right-3 text-[#0A3503] text-xl hover:opacity-70"
            aria-label="Fechar"
          >
            ✕
          </button>
          <h1 className="text-[#0A3503] text-xl font-semibold">
            Solicitação de Análise Socioambiental realizada com sucesso!
          </h1>
          <p className="text-sm text-[#0A3503]">
            A análise socioambiental demora até 48h. Enviaremos no seu e-mail
            uma mensagem quando estiver disponível.
          </p>
        </div>
      ));
    } catch (err: any) {
      console.error("Erro ao solicitar análise:", err);
      console.error("Erro completo:", err?.response?.data);
      toast.error(
        err?.response?.data?.message ||
          "Erro ao solicitar análise socioambiental. Tente novamente.",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateFromISO = (isoDateStr: string) => {
    if (!isoDateStr) return "";
    const datePart = isoDateStr.split("T")[0];

    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div className="max-w-6xl mx-auto my-8">
        <TableInformation>
          <TableInformation.Section title="Informações Propriedades">
            <TableInformation.Row columnsPerRow={4}>
              <TableInformation.Column>
                <TableInformation.Title>
                  Nome da Propriedade
                </TableInformation.Title>
                <TableInformation.Value>
                  {farm.nomePropriedade}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>Município</TableInformation.Title>
                <TableInformation.Value>
                  {farm.endereco?.municipio}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>UF</TableInformation.Title>
                <TableInformation.Value>
                  {farm.endereco?.estado}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>CEP</TableInformation.Title>
                <TableInformation.Value>
                  {farm.endereco?.cep}
                </TableInformation.Value>
              </TableInformation.Column>
            </TableInformation.Row>

            <TableInformation.Row columnsPerRow={3}>
              <TableInformation.Column>
                <TableInformation.Title>Logradouro</TableInformation.Title>
                <TableInformation.Value>
                  {farm.endereco?.logradouro}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>Módulo Fiscal</TableInformation.Title>
                <TableInformation.Value>
                  {farm.moduloFiscal}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>
                  Embargo Ambiental
                </TableInformation.Title>
                <TableInformation.Value>
                  {farm.statusVoucher ? "Sim" : "Não"}
                </TableInformation.Value>
              </TableInformation.Column>
            </TableInformation.Row>

            <TableInformation.Row columnsPerRow={3}>
              <TableInformation.Column>
                <TableInformation.Title>
                  Atividade Principal
                </TableInformation.Title>
                <TableInformation.Value>
                  {farm.atividadePrincipal?.descricao || "Não informado"}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>
                  Ciclo de Produção
                </TableInformation.Title>
                <TableInformation.Value>
                  {farm.cicloProducao?.descricao || "Não informado"}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>
                  Número de Proprietários
                </TableInformation.Title>
                <TableInformation.Value>
                  {String(farm.numeroProprietarios)}
                </TableInformation.Value>
              </TableInformation.Column>
            </TableInformation.Row>

            <TableInformation.Row columnsPerRow={2}>
              <TableInformation.Column>
                <TableInformation.Title>
                  Cadastro Ambiental Rural (CAR)
                </TableInformation.Title>
                <TableInformation.Value>
                  {farm.carFederal}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>
                  Código voucher PREM
                </TableInformation.Title>
                <TableInformation.Value>{farm.voucher}</TableInformation.Value>
              </TableInformation.Column>
            </TableInformation.Row>
          </TableInformation.Section>

          <TableInformation.Section title="Proprietário Principal">
            <TableInformation.Row columnsPerRow={3}>
              <TableInformation.Column>
                <TableInformation.Title>
                  Nome/Razão Social
                </TableInformation.Title>
                <TableInformation.Value>
                  {owner?.pessoa.nome}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>CPF/CNPJ</TableInformation.Title>
                <TableInformation.Value>
                  {owner?.pessoa.cpfCnpj}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>
                  RG/Inscrição Social
                </TableInformation.Title>
                <TableInformation.Value>
                  {owner?.pessoa.rgInscricaoSocial || "Não informado"}
                </TableInformation.Value>
              </TableInformation.Column>
            </TableInformation.Row>

            <TableInformation.Row columnsPerRow={3}>
              <TableInformation.Column>
                <TableInformation.Title>
                  Data de Nascimento
                </TableInformation.Title>
                <TableInformation.Value>
                  {formatDateFromISO(owner?.pessoa.dataNascimento || "")}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>Telefone</TableInformation.Title>
                <TableInformation.Value>
                  {owner?.telefone}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>Email</TableInformation.Title>
                <TableInformation.Value>
                  {owner?.pessoa.email}
                </TableInformation.Value>
              </TableInformation.Column>
            </TableInformation.Row>
          </TableInformation.Section>

          {coOwners.map((coOwner, index) => (
            <TableInformation.Section
              key={index}
              title={`Coproprietário ${index + 1}`}
            >
              <TableInformation.Row columnsPerRow={3}>
                <TableInformation.Column>
                  <TableInformation.Title>
                    Nome/Razão Social
                  </TableInformation.Title>
                  <TableInformation.Value>
                    {coOwner.pessoa.nome}
                  </TableInformation.Value>
                </TableInformation.Column>
                <TableInformation.Column>
                  <TableInformation.Title>CPF/CNPJ</TableInformation.Title>
                  <TableInformation.Value>
                    {coOwner.pessoa.cpfCnpj}
                  </TableInformation.Value>
                </TableInformation.Column>
                <TableInformation.Column>
                  <TableInformation.Title>
                    RG/Inscrição Social
                  </TableInformation.Title>
                  <TableInformation.Value>
                    {coOwner.pessoa.rgInscricaoSocial || "—"}
                  </TableInformation.Value>
                </TableInformation.Column>
              </TableInformation.Row>

              <TableInformation.Row columnsPerRow={3}>
                <TableInformation.Column>
                  <TableInformation.Title>
                    Data de Nascimento
                  </TableInformation.Title>
                  <TableInformation.Value>
                    {formatDateFromISO(coOwner.pessoa.dataNascimento || "")}
                  </TableInformation.Value>
                </TableInformation.Column>
                <TableInformation.Column>
                  <TableInformation.Title>Telefone</TableInformation.Title>
                  <TableInformation.Value>
                    {coOwner.pessoa.telefone}
                  </TableInformation.Value>
                </TableInformation.Column>
                <TableInformation.Column>
                  <TableInformation.Title>Email</TableInformation.Title>
                  <TableInformation.Value>
                    {coOwner.pessoa.email}
                  </TableInformation.Value>
                </TableInformation.Column>
              </TableInformation.Row>
            </TableInformation.Section>
          ))}
        </TableInformation>

        {!shouldShowSuccessMessage && (
          <>
            <div className="flex items-center gap-4 mt-6">
              <input
                id="accept"
                type="checkbox"
                className="accent-[#21801A] size-5"
                {...register("accept")}
              />
              <label className="text-sm text-[#0A3503]" htmlFor="accept">
                Declaro, para todos os fins de direito, e sob penas de lei, que
                os dados informados e documentos apresentados são legítimos. E
                que autorizo o compartilhamento de meus dados para consultas
                públicas para análise socioambiental perante aos órgãos
                necessários.
              </label>
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                variant="green"
                className="w-[253px]"
                disabled={!acceptChecked || isLoading || analysisRequested}
                onClick={handleSubmitRequest}
              >
                {isLoading ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  "Solicitar"
                )}
              </Button>
            </div>
          </>
        )}

        {shouldShowSuccessMessage && (
          <div className="mt-6 p-4 bg-[#DFEEE5] border border-[#0A3503] rounded-lg">
            <p className="text-[#0A3503] text-center">
              Análise socioambiental já foi solicitada e está disponível. Você
              pode visualizar os resultados na seção &quot;Análise
              Ambiental&quot;.
            </p>
          </div>
        )}
      </div>
    </>
  );
};
