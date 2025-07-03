import { api } from "@/api/index";

export function useFirstAccess() {
  const firstAccess = async (
    senha: string,
    confirmacaoSenha: string,
    token: string | null
  ) => {
    try {
      await api.post("auth/primeiro-acesso", {
        senha,
        confirmacaoSenha,
        token,
      });
      return { success: true, message: "Senha definida com sucesso!" };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Erro ao definir a senha.";
      return { success: false, message };
    }
  };

  return { firstAccess };
}
