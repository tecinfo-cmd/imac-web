import { useParams } from "next/navigation";

import { api } from "@/api";
import { useQuery, useMutation } from "@tanstack/react-query";

interface Deteccao {
  id: number;
  tipo: string;
  area_ha: string;
  idAgrotools: string;
}

interface DocumentoTecnicoData {
  id: number;
  descricao: string;
  url: string;
}

interface PlanoDocumento {
  id: number;
  nomeArquivo: string;
  nomeArquivoOriginal: string;
  urlArquivo: string;
  tipo: string;
}

interface PlanoResponsavelTecnico {
  id: number;
  nome: string;
  cpf: string;
  profissao: string;
  registroCrea: string;
  telefone: string;
  email: string;
}

interface PlanoAdequacao {
  id: number;
  motivo: string | null;
  situacao: string | null;
  observacao: string | null;
  idAnalise: number;
  idResponsavelTecnico: number | null;
  dataCriacao?: string;
  dataAtualizacao?: string;
  responsavelTecnico?: PlanoResponsavelTecnico | null;
  documentos: PlanoDocumento[];
}

interface ObjectionData {
  tecnico: {
    nome: string;
    cpf: string;
    profissao: string;
    registroCrea: string;
    telefone: string;
    email: string;
  } | null;

  autorizacoes: {
    id: number;
    dataEmissao: string;
    validade: string;
    tipo: string;
    orgao: string;
    area: number;
    url: string;
  }[];

  farmData: {
    car: string;
    voucher: string;
    nome: string;
    municipio: string;
    estado: string;
    etapa: string;
    status: string;
  };

  justificativaSupressao: string | null;
  justificativaLaudo: string | null;
  documentosSupressao: DocumentoTecnicoData[];
  documentosLaudo: DocumentoTecnicoData[];
  deteccoes: Deteccao[];
  idAnalise?: number;
  planoAdequacao?: PlanoAdequacao | null;
  documentosPlano: DocumentoTecnicoData[]; // mapeados para a tabela
}

interface SubmitObjectionProps {
  status: string;
  deteccoes: { pdf: File; tipo: string }[];
  poligonos: {
    tipo: string;
    poligono: string;
    idTad: number | string;
    areaARegenerar: number | string;
  }[];
  parametros: { nome: string; tipo: string }[];
  valorDesconto?: number;
  idAnalise?: number;
  valorMulta?: number;
}

function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("pt-BR");
  } catch {
    return "-";
  }
}

export const useObjectionData = () => {
  const { id: idPropriedade } = useParams<{ id: string }>();

  const query = useQuery<ObjectionData, Error>({
    queryKey: ["objection-data", idPropriedade],
    queryFn: async () => {
      const response = await api.get<any>(`propriedade-prem/${idPropriedade}`);
      const data = response.data;
      if (!data) throw new Error("Dados da propriedade não encontrados");

      const idAnalise = data.retornoAnalises?.[0]?.id;

      const analiseRelevante = data.retornoAnalises?.find(
        (analise: any) =>
          analise.contestacaoAutorizacaoSupressao ||
          analise.contestacaoLaudo ||
          analise.planoAdequacao
      );

      const contestacaoSupressao =
        analiseRelevante?.contestacaoAutorizacaoSupressao;
      const contestacaoLaudo = analiseRelevante?.contestacaoLaudo;
      const deteccoes: Deteccao[] = analiseRelevante?.deteccoes || [];

      const planoAdequacao: PlanoAdequacao | null =
        analiseRelevante?.planoAdequacao
          ? {
              id: analiseRelevante.planoAdequacao.id,
              motivo: analiseRelevante.planoAdequacao.motivo ?? null,
              situacao: analiseRelevante.planoAdequacao.situacao ?? null,
              observacao: analiseRelevante.planoAdequacao.observacao ?? null,
              idAnalise: analiseRelevante.planoAdequacao.idAnalise,
              idResponsavelTecnico:
                analiseRelevante.planoAdequacao.idResponsavelTecnico ?? null,
              dataCriacao: analiseRelevante.planoAdequacao.dataCriacao,
              dataAtualizacao: analiseRelevante.planoAdequacao.dataAtualizacao,
              responsavelTecnico:
                analiseRelevante.planoAdequacao.responsavelTecnico ?? null,
              documentos: analiseRelevante.planoAdequacao.documentos ?? [],
            }
          : null;

      const documentosPlano: DocumentoTecnicoData[] = (
        planoAdequacao?.documentos || []
      ).map((doc: PlanoDocumento) => ({
        id: doc.id,
        descricao: doc.tipo || doc.nomeArquivoOriginal || doc.nomeArquivo,
        url: doc.urlArquivo || "#",
      }));

      const farmData = {
        car: data.carFederal || "-",
        voucher: data.voucher || "-",
        nome: data.nomePropriedade || "-",
        municipio: data.cidade?.nome || "-",
        estado: data.cidade?.uf || "-",
        etapa: data.etapa || "-",
        status: data.status || "-",
      };


      const tecnicoFromPlano = planoAdequacao?.responsavelTecnico
        ? {
            nome: planoAdequacao.responsavelTecnico.nome,
            cpf: planoAdequacao.responsavelTecnico.cpf,
            profissao: planoAdequacao.responsavelTecnico.profissao,
            registroCrea: planoAdequacao.responsavelTecnico.registroCrea,
            telefone: planoAdequacao.responsavelTecnico.telefone,
            email: planoAdequacao.responsavelTecnico.email,
          }
        : null;

      const tecnicoFromContestacoes =
        contestacaoSupressao?.responsavelTecnico ||
        contestacaoLaudo?.responsavelTecnico ||
        null;

      return {
        tecnico: tecnicoFromPlano || tecnicoFromContestacoes || null,
        autorizacoes: (contestacaoSupressao?.autorizacoesSupressoes || []).map(
          (auth: any, index: number) => ({
            id: auth.id || index + 1,
            dataEmissao: formatDate(auth.dataEmissao),
            validade: formatDate(auth.dataValidade),
            tipo: auth.tipo?.nome || "-",
            orgao: auth.orgaoEmissor?.nome || "-",
            area: parseFloat(auth.areaAutorizadaParaSupressaoHa || "0") || 0,
            url: auth.documentos?.[0]?.urlArquivo || "#",
          })
        ),
        documentosSupressao: (contestacaoSupressao?.documentos || []).map(
          (doc: any, index: number) => ({
            id: doc.id || index + 1,
            descricao: doc.tipo || `Documento ${index + 1}`,
            url: doc.urlArquivo || "#",
          })
        ),
        documentosLaudo: (contestacaoLaudo?.documentos || []).map(
          (doc: any, index: number) => ({
            id: doc.id || index + 1,
            descricao: doc.tipo || `Documento ${index + 1}`,
            url: doc.urlArquivo || "#",
          })
        ),
        farmData,
        justificativaSupressao: contestacaoSupressao?.motivo || "",
        justificativaLaudo: contestacaoLaudo?.motivo || "",

        deteccoes,
        idAnalise,


        planoAdequacao,
        documentosPlano,
      } as ObjectionData;
    },
    enabled: !!idPropriedade,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const mutation = useMutation({
    mutationFn: async (payload: SubmitObjectionProps) => {
      const idAnalise = query.data?.idAnalise;
      if (!idPropriedade || !idAnalise) {
        throw new Error("IDs obrigatórios não informados");
      }

      const formData = new FormData();
      formData.append("status", payload.status);

      if (payload.poligonos?.length) {
        formData.append("poligonos", JSON.stringify(payload.poligonos));
      }

      if (payload.valorDesconto !== undefined) {
        formData.append("valorDesconto", String(payload.valorDesconto));
      }

      const parametrosArray: { nome: string; tipo: string }[] = [];

      payload.deteccoes.forEach((d) => {
        if (d.pdf instanceof File && d.tipo) {
          parametrosArray.push({ nome: d.pdf.name, tipo: d.tipo });
          formData.append("arquivos", d.pdf);
        }
      });

      if ((payload as any).parecerTecnico?.pdf instanceof File) {
        const parecerFile = (payload as any).parecerTecnico.pdf as File;
        parametrosArray.push({
          nome: parecerFile.name,
          tipo: "PARECER_TECNICO",
        });
        formData.append("arquivos", parecerFile);
      }

      if (!parametrosArray.length) {
        throw new Error("Nenhum arquivo para enviar");
      }

      formData.append("parametros", JSON.stringify(parametrosArray));

      // debug
      console.log("--- DADOS A SEREM ENVIADOS ---");
      for (const [key, value] of (formData as any).entries()) {
        console.log(`${key}:`, value);
      }
      console.log("------------------------------");

      const url = `propriedade-prem/${idPropriedade}/analise-socioambiental/${idAnalise}/parecer-contestacao`;
      const response = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
  });

  return {
    ...query,
    submitObjection: mutation.mutate,
    submitObjectionAsync: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
  };
};
