import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY_GET_FARMS = "farms";

interface Cidade {
  id: number;
  codigo: number;
  nome: string;
  uf: string;
}

interface Proprietario {
  id: number;
  telefone: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface SolicitacaoElegibilidade {
  id: number;
  carFederal: string;
  telefone: string;
  email: string;
  status: string;
  token: string;
  transactionId: string;
  confirmacaoEmail: string;
  nomePropriedade: string;
  codigoMunicipio: number;
  dataCriacao: string;
  dataAtualizacao: string;
  retornoAgrotools: RetornoAgrotools;
}

interface RetornoAgrotools {
  id: number;
  urlCheckout: string;
  createdAt: string;
  isEligible: boolean;
  hasDocuments: boolean;
  errors: string;
  areas_desmatamento_total: number;
  modulo_fiscal: string;
  vlr_multa: number | null;
  desconto_perc: number | null;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface Propriedade {
  id: number;
  carFederal: string;
  nomePropriedade: string;
  codigoMunicipio: number;
  geometry: any | null;
  voucher: string;
  moduloFiscal: string;
  dataCriacao: string;
  dataAtualizacao: string;
  proprietarios: Proprietario[];
  cidade: Cidade;
  solicitacaoElegibilidade: SolicitacaoElegibilidade;
}

interface GetFarmsParams {
  carFederal?: string;
  nomeFazenda?: string;
  codigoMunicipio?: string;
}

export const getFarms = async (params?: GetFarmsParams) => {
  try {
    const defaultParams: GetFarmsParams = {
      carFederal: "MT-5107263-0730B0A715504FFDBC23DFBDB34808F6",
      ...params,
    };

    const { data } = await api.get("/propriedade-prem", { params: defaultParams });
    return data.data as Propriedade[];
  } catch (error) {
    return Promise.reject(error);
  }
};

export function useGetFarms(params?: GetFarmsParams) {
  return useQuery({
    queryKey: [QUERY_KEY_GET_FARMS, params],
    queryFn: () => getFarms(params),
  });
}
