import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY_GET_FARMS = "farms";

interface Endereco {
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

interface CicloProducao {
  id: number;
  descricao: string;
}

interface AtividadePrincipal {
  id: number;
  descricao: string;
}

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
  rgInscricaoSocial: string | null;
}

interface Proprietario {
  id: number;
  telefone: string;
  dataCriacao: string;
  dataAtualizacao: string;
  pessoa: Pessoa;
}

interface Propriedade {
  id: number;
  carFederal: string;
  nomePropriedade: string;
  geometry: any | null;
  voucher: string;
  moduloFiscal: string;
  dataCriacao: string;
  dataAtualizacao: string;
  endereco: Endereco;
  cicloProducao: CicloProducao;
  atividadePrincipal: AtividadePrincipal;
  proprietarios: Proprietario[];
}


export const getfarms = async () => {
  try {
    const { data } = await api.get("/propriedade-prem");
    return data as Propriedade[];
  } catch (error) {
    return Promise.reject(error);
  }
};

export function useGetFarms() {
  return useQuery({
    queryKey: [QUERY_KEY_GET_FARMS],
    queryFn: () => getfarms(),
  });
}
