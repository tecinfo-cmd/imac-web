import * as yup from "yup";

const validationMessages = {
  required: "Este campo é obrigatório",
  emailRequired: "O e-mail é obrigatório",
  email: "Digite um e-mail válido",
  min: (min: number) => `O campo deve ter pelo menos ${min} caracteres`,
  max: (max: number) => `O campo deve ter no máximo ${max} caracteres`,
};

yup.setLocale({
  mixed: {
    required: (params) =>
      params.path === "email" ? validationMessages.emailRequired : validationMessages.required,
  },
  string: {
    email: validationMessages.email,
    min: ({ min }: { min: number }) => validationMessages.min(min),
    max: ({ max }: { max: number }) => validationMessages.max(max),
  },
});

export { yup };
