import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaBarcode } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";

import { Button } from "@/components/ui/button";

import { api } from "@/api";
import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import {
  useGeneratePaymentSlip,
  createPayerFromFarm,
} from "@/hooks/useFines/useGeneratePaymentSlip";
import { useGetPaymentStatus } from "@/hooks/useFines/useGetPaymentStatus";
import { useQueryClient } from "@tanstack/react-query";

interface FinesProps {
  farmId: number;
}

export const Fines = ({ farmId }: FinesProps) => {
  const queryClient = useQueryClient();
  const { data: farm } = useGetFarmById(farmId);
  const { data: paymentStatus, isLoading: isLoadingPayments } =
    useGetPaymentStatus(farmId);
  const { register, watch } = useForm();
  const [selectedInstallments, setSelectedInstallments] = useState<string>("2");
  const cashPaymentMutation = useGeneratePaymentSlip();
  const installmentPaymentMutation = useGeneratePaymentSlip();

  const analysisData = farm?.retornoAnalises?.[0];
  const areaToRegenerate = analysisData?.areaARegenerar || 0;
  const fineValue = analysisData?.valorMulta || 0;
  const discountPercentage = analysisData?.descontoPercentual || 0;

  const hasExemption = discountPercentage === 100;
  const discountValue = (fineValue * discountPercentage) / 100;
  const totalFineValue = fineValue - discountValue;
  const installmentValue2x = totalFineValue / 2;
  const installmentValue3x = totalFineValue / 3;

  const hasPaymentStatus = paymentStatus && paymentStatus.length > 0;
  const isAccepted = watch("accept") || hasPaymentStatus;

  const handlePrintPaymentSlip = async (linhaDigitavel: string) => {
    try {
      const response = await api.get(`/boletos/imprimir/${linhaDigitavel}`);

      const base64Data = response.data.pdf;
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `boleto-${linhaDigitavel}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao imprimir boleto:", error);
    }
  };

  const handleGenerateCashPayment = () => {
    if (!farm) return;

    const payer = createPayerFromFarm(farm);

    cashPaymentMutation.mutate(
      {
        farmId,
        payload: {
          parcela: 1,
          valor: fineValue,
          boleto: {
            pagador: payer,
            informativos: ["Pagamento de multa"],
          },
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["payment-status", farmId],
          });
        },
      }
    );
  };

  const handleGenerateInstallmentPayments = () => {
    if (!farm) return;

    const installments = parseInt(selectedInstallments);
    const valueInstallment =
      installments === 2 ? installmentValue2x : installmentValue3x;

    const payer = createPayerFromFarm(farm);

    installmentPaymentMutation.mutate(
      {
        farmId,
        payload: {
          parcela: installments,
          valor: valueInstallment,
          boleto: {
            pagador: payer,
            informativos: ["Pagamento de multa"],
          },
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["payment-status", farmId],
          });
        },
      }
    );
  };

  return (
    <>
      <div className="w-fit mx-auto flex justify-center items-center gap-3 border border-[#CAC4D0] p-4 rounded">
        <GoAlertFill size={35} color="#F12929" />
        <p className="text-[#0A3503]">
          Para ter acesso a Autorização de Comercialização, as multas devem ser{" "}
          <br /> quitadas.
        </p>
      </div>
      <h1 className="text-xl text-[#1A6415] font-semibold text-center py-10">
        Multas
      </h1>
      <div className="grid grid-cols-3 gap-8 p-6 border border-[#CAC4D0] rounded shadow">
        <div>
          <h2 className="text-[#21801A]">Cadastro Ambiental Rural (CAR)</h2>
          <p>{farm?.carFederal}</p>
        </div>
        <div>
          <h2 className="text-[#21801A]">Código Voucher PREM</h2>
          <p>{farm?.voucher}</p>
        </div>

        <div className="col-span-3 mt-4">
          <div className="grid grid-cols-3">
            <div>
              <h2 className="text-[#21801A]">Nome da propriedade</h2>
              <p>{farm?.nomePropriedade}</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Município</h2>
              <p>{farm?.cidade?.nome}</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Estado</h2>
              <p>MT</p>
            </div>
          </div>
        </div>
        <div className="col-span-2 mt-4">
          <div className="grid grid-cols-2">
            <div>
              <h2 className="text-[#21801A]">Etapa Atual</h2>
              <p>-</p>
            </div>
            <div>
              <h2 className="text-[#21801A]">Status</h2>
              <p>-</p>
            </div>
          </div>
        </div>
      </div>
      <h1 className="bg-[#21801A] font-semibold uppercase p-4 text-center text-white mt-6">
        Multas
      </h1>
      <div className="grid grid-cols-3 gap-8 p-6 border border-[#CAC4D0] rounded shadow">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <h2 className="text-[#21801A]">Área degradada consolidada (ha):</h2>
            <p>{areaToRegenerate.toFixed(2)}</p>
          </div>
          <div className="flex gap-2">
            <h2 className="text-[#21801A]">Valor multa:</h2>
            <p>R${fineValue.toFixed(2).replace(".", ",")}</p>
          </div>
          <div className="flex gap-2">
            <h2 className="text-[#21801A]">Possui isenção?</h2>
            <p>{hasExemption ? "Sim" : "Não"}</p>
          </div>
          <div className="flex gap-2">
            <h2 className="text-[#21801A]">Desconto:</h2>
            <p>
              R${discountPercentage}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-6 px-6">
        <input
          id="accept"
          type="checkbox"
          className="accent-[#21801A]"
          disabled={hasPaymentStatus}
          {...register("accept", {
            value: hasPaymentStatus || false,
          })}
        />
        <label className="text-sm text-[#0A3503]" htmlFor="accept">
          Declaro, para todos os fins de direito, e sob penas de lei, que estou
          de acordo com os valores de multa e insenção informados.
        </label>
      </div>

      {isAccepted && (
        <>
          <div className="mt-8">
            <div className="bg-[#21801A] text-white font-semibold p-4 text-center">
              Como deseja fazer o pagamento?
            </div>

            <div className="bg-white border border-[#CAC4D0] rounded-b">
              <div className="flex items-center justify-between p-4 border-b border-[#CAC4D0] bg-[#D7EADD]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#21801A] rounded-full flex items-center justify-center">
                    <FaBarcode className="text-white text-sm" />
                  </div>
                  <span className="text-[#0A3503] font-medium">
                    Boleto à vista
                  </span>
                </div>
                <Button
                  variant="dark"
                  className="text-sm"
                  onClick={handleGenerateCashPayment}
                  disabled={cashPaymentMutation.isPending || hasPaymentStatus}
                >
                  {cashPaymentMutation.isPending
                    ? "Gerando..."
                    : "Gerar Boleto"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#D7EADD]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#21801A] rounded-full flex items-center justify-center">
                    <FaBarcode className="text-white text-sm" />
                  </div>
                  <span className="text-[#0A3503] font-medium">
                    Boleto parcelado
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#0A3503] text-sm">
                    Número de parcelas:
                  </span>
                  <select
                    value={selectedInstallments}
                    onChange={(e) => setSelectedInstallments(e.target.value)}
                    className="border border-[#CAC4D0] rounded px-2 py-1 text-sm"
                  >
                    <option value="2">
                      2 x R$ {installmentValue2x.toFixed(2).replace(".", ",")}
                    </option>
                    <option value="3">
                      3 x R$ {installmentValue3x.toFixed(2).replace(".", ",")}
                    </option>
                  </select>
                  <Button
                    variant="dark"
                    className="text-sm"
                    onClick={handleGenerateInstallmentPayments}
                    disabled={
                      installmentPaymentMutation.isPending || hasPaymentStatus
                    }
                  >
                    {installmentPaymentMutation.isPending
                      ? "Gerando..."
                      : "Gerar Boletos"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-[#21801A] text-white font-semibold p-4">
              Status do pagamento
            </div>

            <div className="bg-white border border-[#CAC4D0] rounded-b">
              <div className="bg-[#D7EADD] grid grid-cols-6 gap-4 p-4 font-bold text-[#21801A]">
                <div>Parcela</div>
                <div>Data de vencimento</div>
                <div>Data de pagamento</div>
                <div>Valor da parcela</div>
                <div>Status</div>
                <div>Imprimir</div>
              </div>

              {isLoadingPayments ? (
                <div className="p-8 text-center text-zinc-600">
                  <p>Carregando status de pagamentos...</p>
                </div>
              ) : paymentStatus && paymentStatus.length > 0 ? (
                <div className="divide-y divide-[#CAC4D0]">
                  {paymentStatus.map((payment) => (
                    <div
                      key={payment.id}
                      className="grid grid-cols-6 gap-4 p-4 text-sm"
                    >
                      <div className="text-[#0A3503]">{payment.parcela}</div>
                      <div className="text-[#0A3503]">
                        {new Date(payment.dataVencimento).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                      <div className="text-[#0A3503]">
                        {payment.dataPagamento
                          ? new Date(payment.dataPagamento).toLocaleDateString(
                              "pt-BR"
                            )
                          : "-"}
                      </div>
                      <div className="text-[#0A3503]">{payment.valor || "-"}</div>
                      <div className="text-[#0A3503]">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            payment.status === "LIQUIDADO"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "PENDENTE"
                              ? "bg-yellow-100 text-yellow-800"
                              : payment.status === "VENCIDO"
                              ? "bg-red-100 text-red-800"
                              : payment.status === "BAIXADO"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>
                      <div className="text-[#0A3503]">
                        <button
                          onClick={() =>
                            handlePrintPaymentSlip(payment.linhaDigitavel)
                          }
                          title="Imprimir boleto"
                        >
                          <FaBarcode size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-600">
                  <p>Nenhum pagamento registrado ainda.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
