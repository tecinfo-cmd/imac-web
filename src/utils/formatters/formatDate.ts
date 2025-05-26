export const formatDate = (date: string | undefined | null) => {
  if (!date) return;
  const formattedDate = new Date(date);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(formattedDate);
};