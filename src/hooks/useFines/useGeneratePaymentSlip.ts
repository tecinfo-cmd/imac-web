import { api } from "@/api";
import { Farm } from "@/hooks/useFarms/useGetFarmById";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface Pagador {
  cep: string;
  cidade: string;
  documento: string;
  nome: string;
  tipoPessoa: string;
  endereco: string;
  uf: string;
}

interface GeneratePaymentSlipPayload {
  parcela: number;
  valor: number;
  boleto: {
    pagador: Pagador;
    informativos: any[];
  };
}

interface GeneratePaymentSlipArgs {
  farmId: number;
  payload: GeneratePaymentSlipPayload;
}

const generatePaymentSlipRequest = async ({
  farmId,
  payload,
}: GeneratePaymentSlipArgs) => {
  try {
    const response = await api.post(`/boletos/multa/${farmId}`, payload);
    return response.data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};

const createPayerFromFarm = (farm: Farm) => {
  const mainOwner = farm.proprietarios.find(p => p.tipoProprietario === "PROPRIETARIO");

  if (!mainOwner) {
    throw new Error("Proprietário principal não encontrado");
  }

  const documento = mainOwner.pessoa.cpfCnpj;
  const tipoPessoa = documento.length === 14 ? "PESSOA_JURIDICA" : "PESSOA_FISICA";

  return {
    cep: farm.endereco.cep.replace(/\D/g, ""),
    cidade: farm.endereco.municipio,
    documento,
    nome: mainOwner.pessoa.nome,
    tipoPessoa,
    endereco: farm.endereco.logradouro,
    uf: farm.endereco.estado,
  };
};

export const useGeneratePaymentSlip = () => {
  return useMutation<unknown, AxiosError, GeneratePaymentSlipArgs>({
    mutationFn: generatePaymentSlipRequest,
  });
};

export { createPayerFromFarm };
