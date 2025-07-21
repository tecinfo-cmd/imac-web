"use client";

import { api } from "@/api";
import { useAuthEmail } from "@/store/useAuthStore";
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

export interface GetFarmsParams {
  carFederal?: string;
  nomeFazenda?: string;
  codigoMunicipio?: string;
  email?: string;
}

export const getFarms = async (params: GetFarmsParams = {}) => {
  try {
    const { data } = await api.get("/propriedade-prem", { params });
    return data.data as Propriedade[];
  } catch (error) {
    return Promise.reject(error);
  }
};

export function useGetFarms(params?: GetFarmsParams) {
  const email = useAuthEmail();

  const finalParams: GetFarmsParams = {
    email,
    ...params,
  };

  return useQuery({
    queryKey: [QUERY_KEY_GET_FARMS, finalParams],
    queryFn: () => getFarms(finalParams),
    enabled: !!finalParams.email,
  });
}
