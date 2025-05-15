export const formatPhone = (value: string | undefined | null) => {
  if (!value) return;
  const formattedPhone = value.replace(/\D/g, "");

  if (formattedPhone.length > 10) {
    return formattedPhone.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return formattedPhone.replace(/^(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
};