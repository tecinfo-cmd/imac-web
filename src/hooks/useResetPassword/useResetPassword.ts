import { api } from "@/api/index";

export function useResetPassword() {
  const sendResetEmail = async (email: string) => {
    try {
      await api.post("auth/solicitar-redefinicao-senha", {
        email,
      });

      return { success: true, message: "E-mail enviado com sucesso!" };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Erro ao enviar e-mail de redefinição";
      return { success: false, message };
    }
  };

  return {
    sendResetEmail,
  };
}
