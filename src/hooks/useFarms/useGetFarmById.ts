import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY_GET_FARM_BY_ID = "farm-by-id";

export interface Pessoa {
  id: number;
  cpfCnpj: string;
  nome: string;
  nomeMae: string | null;
  nomePai: string | null;
  sexo: string | null;
  dataNascimento: string | null;
  telefone: string | null;
  email: string | null;
  rgInscricaoSocial: string | null;
}

export interface Proprietario {
  id: number;
  tipoProprietario: "PROPRIETARIO" | "COPROPRIETARIO";
  telefone: string | null;
  dataCriacao: string;
  dataAtualizacao: string;
  pessoa: Pessoa;
}

export interface Endereco {
  id: number;
  cep: string;
  longitude: number | null;
  latitude: number | null;
  municipio: string;
  estado: string;
  caixaPostal: string | null;
  logradouro: string;
  complemento: string;
}

export interface Cidade {
  id: number;
  codigo: number;
  nome: string;
  uf: string;
}

export interface SolicitacaoElegibilidade {
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
}

export interface Documento {
  id: number;
  nomeArquivo: string;
  urlArquivo: string;
  idPropriedade: number;
  tipo: string;
}

export interface Farm {
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
  dataCriacao: string;
  dataAtualizacao: string;
  proprietarios: Proprietario[];
  endereco: Endereco;
  cidade: Cidade;
  solicitacaoElegibilidade: SolicitacaoElegibilidade;
  documentos: Documento[];
  etapa: string;
  status: string;
}

export const getFarmById = async (id: number | undefined) => {
  try {
    const { data } = await api.get(`/propriedade-prem/${id}`);
    return data as Farm;
  } catch (error) {
    return Promise.reject(error);
  }
};

export function useGetFarmById(id: number | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY_GET_FARM_BY_ID, id],
    queryFn: () => getFarmById(id),
    enabled: !!id
  });
}
