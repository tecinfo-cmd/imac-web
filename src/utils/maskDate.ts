export const maskDate = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
};

export const formatDateToISO = (dateString: string) => {
  if (!dateString) return "";

  const str = String(dateString).trim();

  const datePart = str.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    const [y, m, d] = datePart.split("-");
    return `${d}/${m}/${y}`;
  }

  return maskDate(str);
};