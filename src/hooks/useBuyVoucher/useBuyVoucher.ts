import { useCallback, useState } from "react";

import { api } from "@/api";
import { parseCookies } from "nookies";

interface Propriedade {
  carFederal: string;
  id: number;
  nomePropriedade: string;
}

type PagamentoPayload = {
  select: string;
  nomeCompleto: string;
  numeroCartao: string;
  validade: string;
  CVV: string;
  cep: string;
  pais: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
};

export function useBuyVoucher() {
  const [userData, setUserData] = useState<any | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cookies = parseCookies();
  const email = cookies.email;

  const buscarPropriedadesSalvas = useCallback(async (): Promise<
    Propriedade[]
  > => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("propriedade-prem?statusVoucher=false");

      const data = response.data.data;

      if (Array.isArray(data) && data.length > 0) {
        const props: Propriedade[] = data.map((item: any) => ({
          id: item.id,
          nomePropriedade: item.nomePropriedade,
          carFederal: item.carFederal,
        }));

        setPropriedades(props);
        return props;
      } else {
        setError("Nenhuma propriedade encontrada para o CAR.");
        setPropriedades([]);
        return [];
      }
    } catch (err: any) {
      console.error("Erro ao buscar propriedades:", err);
      setError("Erro ao buscar propriedades.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserData = useCallback(async () => {
    setIsLoadingUserData(true);
    try {
      const cookies = parseCookies();
      const email = cookies.email;

      if (!email) {
        throw new Error("Email não encontrado nos cookies.");
      }

      const response = await api.get(`/usuario/email/${email}`);
      setUserData(response.data);
    } catch (err) {
      console.error("Erro ao carregar dados do usuário", err);
    } finally {
      setIsLoadingUserData(false);
    }
  }, []);
  const pagar = async (dados: PagamentoPayload) => {
    if (!userData) {
      throw new Error("Usuário não autenticado");
    }
    setIsLoading(true);
    try {
      const [month, year] = dados.validade.split("/");

      const propriedadeResponse = await api.get(
        "propriedade-prem/proprietario",
        {
          params: {
            email: email,
          },
        }
      );

      const propriedades = propriedadeResponse.data;
      if (!propriedades || propriedades.length === 0) {
        throw new Error("Nenhuma propriedade encontrada para o CAR informado.");
      }

      const idSolicitacao = propriedades[0].solicitacaoElegibilidade?.id;

      if (!idSolicitacao) {
        throw new Error("ID da solicitação de elegibilidade não encontrado.");
      }

      const payload = {
        buyer: {
          select: dados.select,
          name: userData.pessoa.nome,
          email: userData.pessoa.email,
          phone: userData.pessoa.telefone,
          document: {
            type: "CPF",
            number: userData.pessoa.cpfCnpj,
          },
          address: {
            street: dados.endereco,
            number: dados.numero,
            complement: dados.complemento,
            neighborhood: dados.bairro,
            city: dados.cidade,
            state: "MT",
            zipCode: dados.cep,
            country: dados.pais,
          },
        },
        payment: {
          installments: 1,
          card: {
            holder_name: dados.nomeCompleto,
            number: dados.numeroCartao.replace(/\s/g, ""),
            expiry_month: parseInt(month),
            expiry_year: parseInt(year),
            cvv: parseInt(dados.CVV),
          },
        },
      };

      const response = await api.post(
        `agrotools/voucher/pagamento/${idSolicitacao}`,
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pagar,
    isLoading,
    loadUserData,
    userData,
    isLoadingUserData,
    propriedades,
    error,
    buscarPropriedadesSalvas,
  };
}
