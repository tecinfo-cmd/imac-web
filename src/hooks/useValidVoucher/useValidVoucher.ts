import { useState } from "react";

import { api } from "@/api/index";
import { parseCookies } from "nookies";

interface Propriedade {
  id: string;
  nome: string;
  carFederal: string;
}

const cookies = parseCookies();
const email = cookies.email;

export function useValidVoucher() {
  const [loading, setLoading] = useState(false);
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [voucherValido, setVoucherValido] = useState<boolean | null>(null);

  async function buscarPropriedadesSalvas() {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("propriedade-prem/proprietario", {
        params: { email },
      });

      const props = response.data
        .filter(
          (item: any) =>
            item.solicitacaoElegibilidade?.status === "APROVADO" &&
            item.statusVoucher === false
        )
        .map((item: any) => ({
          idSolicitacaoElegibilidade: item.idSolicitacaoElegibilidade,
          nomePropriedade: item.nomePropriedade,
          carFederal: item.carFederal,
        }));
      setPropriedades(props);

      console.log("Propriedades carregadas:", props);
    } catch (error) {
      console.error("Erro ao buscar propriedades:", error);
    }
  }

  async function validarVoucher(voucher: string, idPropriedade: number) {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("agrotools/voucher/validar", {
        params: {
          voucher,
          idPropriedade,
        },
      });

      setVoucherValido(true);
      return response.data;
    } catch (err: any) {
      console.error("Erro ao validar voucher:", err);
      setVoucherValido(false);
      setError("Voucher inválido ou erro na validação.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    propriedades,
    loading,
    error,
    voucherValido,
    buscarPropriedadesSalvas,
    validarVoucher,
  };
}
