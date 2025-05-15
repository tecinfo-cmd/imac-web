export const formatCurrency = (value: number | undefined) => {
  if (!value) return
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
};