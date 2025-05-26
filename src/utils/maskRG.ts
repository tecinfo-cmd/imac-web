export const maskRG = (value: string) => {
  const digits = value.replace(/\D/g, "");

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
    .substring(0, 12);
};
