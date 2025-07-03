import { api } from "@/api/index";

export function useRecoverPassword() {
  const recoverPassword = async (
    senha: string,
    confirmacaoSenha: string,
    token: string | null
  ) => {
    try {
      await api.post("auth/redefinir-senha", {
        senha,
        confirmacaoSenha,
        token,
      });
      return { success: true, message: "Senha atualizada com sucesso!" };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Erro ao redefinir a senha.";
      return { success: false, message };
    }
  };

  return { recoverPassword };
}
