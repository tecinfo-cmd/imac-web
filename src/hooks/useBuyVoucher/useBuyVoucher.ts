import { useState } from "react";

import axios from "axios";

type PagamentoPayload = {
  nomeCompleto: string;
  numeroCartao: string;
  validade: string;
  CVV: string;
  CEP: string;
  pais: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
};

export function useBuyVoucher() {
  const [isLoading, setIsLoading] = useState(false);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImR1a2UubmRzZ0BnbWFpbC5jb20iLCJjYXJnbyI6IlBST0RVVE9SIiwiaWF0IjoxNzQ2NzQ5MjQyLCJleHAiOjE3NDY4MzU2NDJ9.-nw4M8VoTIvUtwWbFCypSBYSVT3j4xp19D25Ign69AQ",
    },
  });
  const pagar = async (dados: PagamentoPayload) => {
    setIsLoading(true);
    try {
      const [month, year] = dados.validade.split("/");

      const payload = {
        buyer: {
          address: {
            street: dados.endereco,
            number: dados.numero,
            complement: dados.complemento,
            neighborhood: dados.bairro,
            city: dados.cidade,
            zipCode: dados.CEP,
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

      const idSolicitacao = localStorage.getItem("userIdElegibilidade");

      if (!idSolicitacao) {
        throw new Error(
          "ID da solicitação não encontrado. Você confirmou o e-mail?"
        );
      }

      const response = await api.post(
        `agrotools/voucher/pagamento/${idSolicitacao}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { pagar, isLoading };
}
