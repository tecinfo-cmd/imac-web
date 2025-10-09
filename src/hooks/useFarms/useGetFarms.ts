"use client";

import { api } from "@/api";
import { useAuthEmail } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY_GET_FARMS = "farms";

interface Pessoa {
  id: number;
  cpfCnpj: string;
  nome: string;
  nomeMae: string | null;
  nomePai: string | null;
  sexo: string | null;
  dataNascimento: string | null;
  telefone: string | null;
  email: string;
  tipoPessoa: string;
  rgInscricaoSocial: string | null;
  idUsuarioAgrotools: number;
}

interface Proprietario {
  id: number;
  tipoProprietario: string;
  telefone: string;
  dataCriacao: string;
  dataAtualizacao: string;
  pessoa: Pessoa;
}

interface Cidade {
  id: number;
  codigo: number;
  nome: string;
  uf: string;
}

interface Endereco {
  id: number;
  cep: string;
  longitude: string;
  latitude: string;
  municipio: string;
  estado: string;
  caixaPostal: string | null;
  logradouro: string;
  complemento: string;
}

interface Deteccao {
  id: number;
  tipo: string;
  area_ha: string;
  idAgrotools: number;
}

interface RetornoAgrotools {
  id: number;
  urlCheckout: string;
  createdAt: string;
  isEligible: boolean;
  hasDocuments: boolean;
  errors: string | null;
  areas_desmatamento_total: string;
  modulo_fiscal: string;
  vlr_multa: string;
  desconto_perc: number;
  dataCriacao: string;
  dataAtualizacao: string;
  deteccoes: Deteccao[];
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
  cpfCnpj: string;
  dataCriacao: string;
  dataAtualizacao: string;
  retornoAgrotools: RetornoAgrotools;
}

interface Territorio {
  id: number;
  idPropriedade: number;
  codigoTerritorio: string;
  codigoAgents: string;
  car: string;
  geometry: string;
  voucher: string;
}

export interface Propriedade {
  id: number;
  carFederal: string;
  nomePropriedade: string;
  codigoMunicipio: number;
  idSolicitacaoElegibilidade: number;
  idClicloProducao: number;
  idAtividadePrincipal: number;
  geometry: string | null;
  voucher: string;
  tamanhoPropriedade: number;
  numeroProprietarios: number;
  statusVoucher: boolean;
  moduloFiscal: string;
  etapa: string;
  status: string;
  dataCriacao: string;
  dataAtualizacao: string;
  proprietarios: Proprietario[];
  endereco: Endereco;
  cidade: Cidade;
  territorios: Territorio[];
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
    const { data } = await api.get("/propriedade-prem/proprietario", { params });
    return data as Propriedade[];

  } catch (error) {
    console.error("Error fetching farms:", error);
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
    select: (data) => data || [],
  });
}
