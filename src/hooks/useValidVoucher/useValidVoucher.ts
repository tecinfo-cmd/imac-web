import { useState } from "react";

import { api } from "@/api/index"; 


interface Propriedade {
  id: string;
  nome: string;
}

export function useValidVoucher() {
  const [loading, setLoading] = useState(false);
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [voucherValido, setVoucherValido] = useState<boolean | null>(null);


  async function buscarPropriedadesSalvas() {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("propriedade-prem", {
        params: { carFederal: localStorage.getItem("carValue") },
      });

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const props: Propriedade[] = data.map((item) => ({
          id: item.id,
          nome: item.nomePropriedade,
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
      setLoading(false);
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
