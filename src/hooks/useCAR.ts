import { useState } from "react";

import { fetchCARData } from "../services/api";

export function useCAR() {
  const [data, setData] = useState<{ nome: string; carFederal: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (
    documentType: "cpf" | "cnpj" | "carEstadual",
    documentValue: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const formattedValue =
        documentType === "cpf" || documentType === "cnpj"
          ? documentValue.replace(/[^\w\s]/gi, "")
          : documentValue;

      const result = await fetchCARData(documentType, formattedValue);

      if (!result || !Array.isArray(result) || result.length === 0) {
        throw new Error("Nenhum dado encontrado para este documento.");
      }

      const formattedData = {
        nome: result[0]?.nomePropriedade || "Nome não encontrado",
        carFederal: result[0]?.carFederal || "CAR Federal não disponível",
      };

      setData(formattedData);
      return formattedData;
    } catch {
      setError("Nenhum dado encontrado para este documento.");
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
}
