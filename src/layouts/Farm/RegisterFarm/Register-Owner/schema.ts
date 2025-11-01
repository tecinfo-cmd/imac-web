
import * as yup from "yup";

export const farmSchema = yup.object().shape({
  cep: yup.string().required("!"),
  logradouro: yup.string().required("!"),
  atividadePrincipal: yup.object({
    value: yup.number().required(),
    label: yup.string().required(),
  }).required("!"),
  cicloProducao: yup.object({
    value: yup.number().required(),
    label: yup.string().required(),
  }).required("!"),
  numeroProprietarios: yup
    .number()
    .transform((value, originalValue) => {
      // Se o valor original for string vazia, retorna undefined
      return originalValue === "" ? undefined : value;
    })
    .required("!"),
});

export const ownerSchema = yup.object().shape({
  nome: yup.string().required("!"),
  cpfCnpj: yup.string().required("!"),
  rgInscricaoSocial: yup.string().required("!"),
  dataNascimento: yup.string().required("!"),
  telefone: yup.string().required("!"),
  email: yup.string().email("!").required("!"),
  setAsMainOwner: yup.boolean(),
});