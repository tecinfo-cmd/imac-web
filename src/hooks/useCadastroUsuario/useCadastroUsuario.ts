import { useState } from "react";

import { api } from "@/api";

type CadastroPayload = {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  cep: string;
  uf: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  senha: string;
  confirmacaoSenha: string;
  aceitouTermos: boolean;
};

export function useCadastroUsuario() {
  const [isLoading, setIsLoading] = useState(false);

  const cadastrar = async (dados: CadastroPayload) => {
    setIsLoading(true);
    try {
      const response = await api.post("auth/signup", dados);
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
