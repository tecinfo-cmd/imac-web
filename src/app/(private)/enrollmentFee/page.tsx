"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/Input";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Table } from "@/components/Table";
import { Button } from "@/components/ui/button";

import { yup } from "@/config/yup";
import { useEnrollmentFee } from "@/hooks/useEnrollmentFee/useEnrollmentFee";
import { usePagamentoVoucher } from "@/hooks/useEnrollmentFee/useEnrollmentFee";
import { getAddressByCep } from "@/hooks/useEnrollmentFee/useEnrollmentFee";
import Barcode from "@/icons/BarCode";
import CopyIcon from "@/icons/Copy";
import { maskCep } from "@/utils/maskCEP";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

const schema = yup.object({
  cep: yup.string().required("CEP é obrigatório"),
});

export default function EnrollmentFee() {
  const { control, watch, setError, clearErrors } = useForm({
    resolver: yupResolver(schema),
  });

  const { propriedades, isLoading, gerarBoleto, isPaying, imprimirBoleto } =
    useEnrollmentFee();

  const [selected, setSelected] = useState<any | null>(null);
  const cep = watch("cep");
  const [endereco, setEndereco] = useState<any>(null);

  const pagamentoQuery = usePagamentoVoucher(selected?.id);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prop = propriedades?.find(
      (p: any) => String(p.id) === e.target.value
    );
    setSelected(prop || null);
    setEndereco(null);
  };

  useEffect(() => {
    const fetchEndereco = async () => {
      const rawCep = cep?.replace(/\D/g, "");
      if (rawCep?.length === 8) {
        const data = await getAddressByCep(rawCep);
        if (data.erro) {
          setError("cep", { type: "manual", message: "CEP inválido." });
          setEndereco(null);
        } else {
          clearErrors("cep");
          setEndereco(data);
        }
      }
      if (!rawCep) {
        setEndereco(null);
        clearErrors("cep");
      }
    };
    fetchEndereco();
  }, [cep, setError, clearErrors]);

  const handleGerarBoleto = async () => {
    if (!selected || !cep || !endereco) {
      toast.error("Preencha todos os campos antes de gerar o boleto.");
      return;
    }

    try {
      await gerarBoleto({
        idSolicitacao: selected.id,
        cep: cep.replace(/\D/g, ""),
        endereco: endereco.logradouro,
      });
      toast.success("Boleto gerado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar boleto!");
    }
  };

  const handleCopyCodigoBarras = () => {
    if (pagamentoQuery?.data?.codigoBarras) {
      navigator.clipboard.writeText(pagamentoQuery.data.codigoBarras);
      toast.success("Código de barras copiado!");
    }
  };

  return (
    <LayoutContainer title="Adesão ao PREM">
      <div className="flex flex-col items-center w-full">
        <section className="w-[90%] md:w-[80%] border border-[#aaacaa] mx-auto my-10 bg-white rounded">
          <h1 className="bg-[#1A6415] text-lg md:text-xl text-white font-semibold text-center py-4 md:py-6 rounded-t">
            Taxa de adesão ao PREM
          </h1>

          <form className="p-4 md:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <label className="block font-medium min-w-[180px] text-[#21801A]">
                Selecione o CAR Federal
              </label>
              <select
                className="border rounded px-3 py-2 w-full"
                onChange={handleSelect}
                value={selected?.id || ""}
              >
                <option value="">Selecione o CAR</option>
                {propriedades?.map((prop: any) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.carFederal}
                  </option>
                ))}
              </select>
            </div>

            {selected && (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="font-medium text-[#21801A]">
                    Nome da Propriedade:
                  </span>
                  <div>{selected.nomePropriedade}</div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="font-medium text-[#21801A]">
                    Nome do Produtor:
                  </span>
                  <div>{selected?.pessoa?.nome}</div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-medium text-[#21801A]">CEP:</label>
                  <Input
                    name="cep"
                    control={control}
                    mask={maskCep}
                    placeholder="digite o CEP"
                  />
                </div>

                {endereco && (
                  <div className="p-3 border rounded bg-gray-50 space-y-1">
                    <p>
                      <strong>Rua:</strong> {endereco.logradouro}
                    </p>
                    <p>
                      <strong>Bairro:</strong> {endereco.bairro}
                    </p>
                    <p>
                      <strong>Cidade:</strong> {endereco.localidade} -{" "}
                      {endereco.uf}
                    </p>
                    <p>
                      <strong>CEP:</strong> {endereco.cep}
                    </p>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="font-medium text-[#21801A]">
                    Valor da Taxa de Adesão:
                  </span>
                  <span>R$ 1.420,00</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="font-medium text-[#21801A]">
                    Valor total a ser pago:
                  </span>
                  <div>R$ 1.420,00</div>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={handleGerarBoleto}
                    disabled={isPaying}
                  >
                    {isPaying ? "Gerando..." : "Gerar Boleto"}
                  </Button>
                </div>
              </>
            )}
            {isLoading && (
              <div className="text-center text-gray-500">Carregando...</div>
            )}
          </form>
        </section>

        <h1 className="w-[90%] md:w-[80%] bg-[#A2A2A2] text-lg md:text-xl text-white font-semibold text-center py-2">
          Status do pagamento
        </h1>

        <Table.Container className="w-[90%] md:w-[80%] !pt-0">
          <Table.Header>
            <Table.Cell>Parcela</Table.Cell>
            <Table.Cell>Valor da parcela</Table.Cell>
            <Table.Cell>Data de vencimento</Table.Cell>
            <Table.Cell>Status</Table.Cell>
            <Table.Cell>Imprimir</Table.Cell>
            <Table.Cell>Copiar Cod de barras</Table.Cell>
          </Table.Header>

          {pagamentoQuery?.isLoading && (
            <Table.Body>
              <Table.Row>
                <Table.Cell colspan={6} className="text-center">
                  Carregando status do pagamento...
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          )}

          {pagamentoQuery?.data && (
            <Table.Body>
              <Table.Row>
                <Table.Cell>única</Table.Cell>
                <Table.Cell>R$ 1.420,00</Table.Cell>
                <Table.Cell>{new Date().toLocaleDateString()}</Table.Cell>
                <Table.Cell>{pagamentoQuery.data.status}</Table.Cell>
                <Table.Cell>
                  <button
                    className="hover:opacity-70"
                    onClick={() =>
                      imprimirBoleto(pagamentoQuery.data.linhaDigitavel)
                    }
                  >
                    <Barcode size={20} />
                  </button>
                </Table.Cell>
                <Table.Cell>
                  <button
                    className="hover:opacity-70"
                    onClick={handleCopyCodigoBarras}
                  >
                    <CopyIcon size={20} />
                  </button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          )}
        </Table.Container>
      </div>
    </LayoutContainer>
  );
}
