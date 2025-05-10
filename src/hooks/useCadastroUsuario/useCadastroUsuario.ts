import { useState } from "react";

import axios from "axios";

type CadastroPayload = {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
  aceitouTermos: boolean;
};

export function useCadastroUsuario() {
  const [isLoading, setIsLoading] = useState(false);

  const apiCadastro = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImR1a2UubmRzZ0BnbWFpbC5jb20iLCJjYXJnbyI6IlBST0RVVE9SIiwiaWF0IjoxNzQ2NzQ5MjQyLCJleHAiOjE3NDY4MzU2NDJ9.-nw4M8VoTIvUtwWbFCypSBYSVT3j4xp19D25Ign69AQ",
    },
  });

  const cadastrar = async (dados: CadastroPayload) => {
    setIsLoading(true);
    try {
      const response = await apiCadastro.post("auth/signup", dados);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { cadastrar, isLoading };
}
