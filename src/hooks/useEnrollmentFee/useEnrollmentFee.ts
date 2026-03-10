import { api } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const getAddressByCep = async (cep: string) => {
  const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  return data;
};

const checkElegibilidade = async (id: number) => {
  const { data } = await api.get(`/elegibilidades/buscar-por-id/${id}`);
  console.log("Resposta do endpoint elegibilidade:", data);
  return data?.retornoAgrotools?.isEligible;
};


export const useEnrollmentFee = () => {
  const queryClient = useQueryClient();

  const { data: propriedades, isLoading } = useQuery({
    queryKey: ["solicitacoes-pagamento"],
    queryFn: async () => {
      const { data } = await api.get("/boletos/boletos/solicitacoes-pagamento");
      console.log("Propriedades fetched:", data);
      return data;
    },
  });


  const gerarBoleto = useMutation({
    mutationFn: async ({
      idSolicitacao,
      cep,
      endereco,
      cidade,
      uf,
    }: {
      idSolicitacao: number;
      cep: string;
      endereco: string;
      bairro?: string;
      cidade?: string;
      uf?: string;
    }) => {
      const prop = propriedades?.find((p: any) => p.id === idSolicitacao);
      if (!prop) throw new Error("Propriedade não encontrada");

      const payload = {
        pagador: {
          cep,
          cidade: cidade || "",
          documento: prop.pessoa.cpfCnpj,
          nome: prop.pessoa.nome,
          tipoPessoa: "PESSOA_FISICA",
          endereco,
          uf: uf || "",
        },
        informativos: [prop.carFederal, prop.nomePropriedade],
      };

      console.log("Payload enviado para API:", idSolicitacao, payload);

      return api.post(`/boletos/voucher/${idSolicitacao}`, payload);
    },
    onSuccess: (_, { idSolicitacao }) => {
      queryClient.invalidateQueries({
        queryKey: ["pagamento-voucher", idSolicitacao],
      });
    },
  });

const { data: propriedadesElegiveis, isLoading: isLoadingElegiveis } = useQuery({
  queryKey: ["propriedadesElegiveis", propriedades],
  queryFn: async () => {
    if (!propriedades) return [];
    const results = await Promise.all(
      propriedades.map(async (p: any) => {
        const idSolicitacao = p.id;
        if (!idSolicitacao) return null;
        const isEligible = await checkElegibilidade(idSolicitacao);
        return isEligible ? p : null;
      })
    );
    return results.filter(Boolean);
  },
  enabled: !!propriedades,
});


  const imprimirBoleto = async (linhaDigitavel: string) => {
    const { data } = await api.get(`/boletos/imprimir/${linhaDigitavel}`);
    if (data?.pdf) {
      const pdfWindow = window.open();
      if (pdfWindow) {
        pdfWindow.document.write(
          `<iframe width='100%' height='100%' src='data:application/pdf;base64,${data.pdf}'></iframe>`
        );
      }
    } else {
      alert("Não foi possível obter o PDF do boleto.");
    }
  };

  return {
    propriedades: propriedadesElegiveis,
    isLoading: isLoading || isLoadingElegiveis,
    gerarBoleto: gerarBoleto.mutateAsync,
    isPaying: gerarBoleto.isPending,
    imprimirBoleto,
  };
};


export const usePagamentoVoucher = (idSolicitacao?: number) => {
  return useQuery({
    queryKey: ["pagamento-voucher", idSolicitacao],
    queryFn: async () => {
      if (!idSolicitacao) return null;
      const { data } = await api.get(
        `/boletos/pagamento-voucher/${idSolicitacao}`
      );
      return data;
    },
    enabled: !!idSolicitacao,
  });
};
