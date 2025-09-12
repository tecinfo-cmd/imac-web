import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface Cidade {
  id: number;
  codigo: number;
  nome: string;
  uf: string;
}

interface Propriedade {
  carFederal: string;
  nomePropriedade: string;
  cidade: Cidade;
}

interface PaymentStatus {
  id: number;
  status: string;
  transactionId: string;
  numeroBoleto: string;
  propriedade: Propriedade;
  codigoBarras: string;
  nossoNumero: string;
  cooperativa: string;
  linhaDigitavel: string;
  txId: string;
  posto: string;
  statusComando: string;
  dataHoraComando: string;
  tipoMensagem: string;
  parcela: number;
  dataVencimento: string;
}

export const useGetPaymentStatus = (farmId: number) => {
  return useQuery({
    queryKey: ["payment-status", farmId],
    queryFn: async () => {
      const response = await api.get(`/boletos/pagamento-multas/${farmId}`);
      return response.data as PaymentStatus[];
    },
    enabled: !!farmId,
  });
};
