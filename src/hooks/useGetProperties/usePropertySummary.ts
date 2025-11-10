import { useParams } from "next/navigation";

import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface Pessoa {
  nome: string;
  cpfCnpj: string;
  rgInscricaoSocial: string;
  dataNascimento: string;
  telefone: string;
  email: string;
}

interface Documento {
  descricao: string;
  dataUpload: string;
  url: string;
}
interface Endereco {
  municipio: string;
  estado: string;
}

interface PropertySummary {
  nomePropriedade: string;
  municipio: string;
  uf: string;
  cep: string;
  logradouro: string;
  complemento: string;
  longitude: string;
  latitude: string;
  caixaPostal: string;
  moduloFiscal: string;
  tamanhoPropriedade: string;
  atividadePrincipal: string;
  cicloProducao: string;
  numeroProprietarios: string;
  cadastroAmbientalRural: string;
  codigoVoucherPrem: string;
  proprietarioPrincipal: Pessoa;
  coproprietarios: Pessoa[];
  documentos: Documento[];
  relatorioUrl?: string | null;
  endereco?: Endereco;
}

const formatPessoa = (p: any): Pessoa => ({
  nome: p.pessoa?.nome ?? "-",
  cpfCnpj: p.pessoa?.cpfCnpj ?? "-",
  rgInscricaoSocial: p.pessoa?.rgInscricaoSocial ?? "-",
  dataNascimento: p.pessoa?.dataNascimento
    ? new Date(p.pessoa.dataNascimento).toLocaleDateString("pt-BR")
    : "-",
  telefone: p.telefone ?? "-",
  email: p.pessoa?.email ?? "-",
});

const mapResponseToPropertySummary = (prop: any): PropertySummary => {
  const proprietarios = prop.proprietarios ?? [];
  const proprietarioPrincipal = proprietarios.find(
    (p: any) => p.tipoProprietario === "PROPRIETARIO"
  );
  const coproprietarios = proprietarios.filter(
    (p: any) => p.tipoProprietario === "COPROPRIETARIO"
  );

  const documentos = (prop.documentos || []).map((doc: any) => ({
    descricao: doc.tipo ?? "Documento",
    dataUpload: new Date(
      doc.dataCriacao ?? prop.dataCriacao
    ).toLocaleDateString("pt-BR"),
    url: doc.urlArquivo,
  }));

  const endereco = prop.endereco ?? {};
  const cidade = prop.cidade ?? {};
  const relatorioUrl =
    prop?.retornoAnalises?.[0]?.urlRelatorio ?? null;

  return {
    nomePropriedade: prop.nomePropriedade ?? "-",
    municipio: cidade.nome ?? "-",
    uf: cidade.uf ?? "-",
    cep: endereco.cep ?? "-",
    logradouro: endereco.logradouro ?? "-",
    complemento: endereco.complemento ?? "-",
    longitude: endereco.longitude ?? "-",
    latitude: endereco.latitude ?? "-",
    caixaPostal: endereco.caixaPostal ?? "-",
    moduloFiscal: prop.moduloFiscal ?? "-",
    tamanhoPropriedade: `${prop.tamanhoPropriedade} ha`,
    atividadePrincipal: String(prop.atividadePrincipal.descricao ?? "-"),
    cicloProducao: String(prop.cicloProducao.descricao ?? "-"),
    numeroProprietarios: String(proprietarios.length),
    cadastroAmbientalRural: prop.carFederal ?? "-",
    codigoVoucherPrem: prop.voucher ?? "-",
    proprietarioPrincipal: formatPessoa(proprietarioPrincipal),
    coproprietarios: coproprietarios.map(formatPessoa),
    documentos,
    relatorioUrl,
    endereco: endereco,
  };
};

export const usePropertySummary = () => {
  const { id } = useParams();

  return useQuery<PropertySummary>({
    queryKey: ["property-summary", id],
    queryFn: async () => {
      const response = await api.get(`/propriedade-prem/${id}`);
      return mapResponseToPropertySummary(response.data);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
