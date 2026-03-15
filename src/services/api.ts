export const fetchCARData = async (
  documentType: "cpf" | "cnpj" | "carEstadual",
  documentValue: string
) => {
  let formattedValue = documentValue;
  if (documentType === "cpf" || documentType === "cnpj") {
    formattedValue = documentValue.replace(/[^\w\s]/gi, "");
  }

  const url = `https://imac-api-homol-dhflh.ondigitalocean.app/mac/api/v1/elegibilidades/consulta-car?${documentType}=${formattedValue}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        "Erro ao buscar os dados. Verifique o documento informado."
      );
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Erro na requisição:", error);
    return null;
  }
};
