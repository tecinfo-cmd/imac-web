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

export interface Territorio {
  id: number;
  idPropriedade: number;
  codigoTerritorio: string;
  codigoAgents: string;
  car: string;
  geometry: string;
  voucher: string;
}


export interface ResponsavelTecnico {
  id: number;
  nome: string;
  cpf: string;
  profissao: string;
  registroCrea: string;
  telefone: string;
  email: string;
  endereco: {
    id: number;
    cep: string;
    longitude: number;
    latitude: number;
    municipio: string;
    estado: string;
    caixaPostal: string;
    logradouro: string;
    complemento: string;
  };
}

export interface Deteccao {
  tipo: string;
  area_ha: string;
  idAgrotools: number;
}

export interface ContestacaoAutorizacaoSupressao {
  id: number;
  motivo: string;
  situacao: string;
  observacao: string | null;
  autorizacoesSupressoes: string[];
  responsavelTecnico: ResponsavelTecnico;
  documentos: string[];
}

export interface ContestacaoLaudo {
  id: number;
  motivo: string;
  situacao: string;
  observacao: string | null;
  responsavelTecnico: ResponsavelTecnico;
  documentos: string[];
}

export interface PlanoAdequacao {
  id: number;
  motivo: string;
  situacao: string;
  observacao: string | null;
  documentos: string[];
  responsavelTecnico: ResponsavelTecnico;
}

export interface Analise {
  urlRelatorio: string;
  areaDesmatadaTotal: number;
  areaARegenerar: number;
  moduloFiscal: number;
  valorMulta: number;
  descontoPercentual: number;
  deteccoes: Deteccao[];
  contestacaoAutorizacaoSupressao: ContestacaoAutorizacaoSupressao | null;
  contestacaoLaudo: ContestacaoLaudo | null;
  planoAdequacao: PlanoAdequacao | null;
  documentos: string[];
}

export interface RetornoAgrotools {
  urlCheckout: string;
  isEligible: boolean;
  hasDocuments: boolean;
  errors: string;
  areas_desmatamento_total: number;
  modulo_fiscal: string;
  vlr_multa: number;
  desconto_perc: number;
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
  retornoAgrotools: RetornoAgrotools;
  nomePropriedade: string;
  codigoMunicipio: number;
  cidade: Cidade;
  propriedades: string;
  cpfCnpj: string;
}

export interface CicloProducao {
  id: number;
  descricao: string;
}

export interface AtividadePrincipal {
  id: number;
  descricao: string;
}

export interface Farm {
  id: number;
  carFederal: string;
  idAtividadePrincipal: number;
  idClicloProducao: number;
  proprietarios: Proprietario[];
  nomePropriedade: string;
  cidade: Cidade;
  endereco: Endereco;
  analise: Analise;
  solicitacaoElegibilidade: SolicitacaoElegibilidade;
  cicloProducao: CicloProducao;
  atividadePrincipal: AtividadePrincipal;
  geometry: string;
  voucher: string;
  tamanhoPropriedade: number;
  numeroProprietarios: number;
  statusVoucher: boolean;
  moduloFiscal: number;
  etapa: string;
  status: string;
  documentos: string[];
  territorios: Territorio[];
  retornoAnalises: Analise[];
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
