export const maskCard = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})\d+?$/, "$1");
};

export const maskValidade = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2") 
    .slice(0, 7); 
};


export const maskCVV = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 4);
};