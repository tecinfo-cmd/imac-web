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

    const formattedValue = (() => {
      if (documentType === "cpf" || documentType === "cnpj") {
        return documentValue.replace(/[^\w\s]/gi, "");
      } else {
        return documentValue;
      }
    })();

    const result = await fetchCARData(documentType, formattedValue);

    if (result && Array.isArray(result) && result.length > 0) {
      const formattedData = {
        nome: result[0].nome || "Nome não encontrado",
        carFederal: result[0].carFederal || "CAR Federal não disponível",
      };

      setData(formattedData);
      setLoading(false);
      return formattedData;
    } else {
      setError("Nenhum dado encontrado para este CNPJ.");
      setData(null);
    }

    setLoading(false);
  };

  return { data, loading, error, fetchData };
}
