export interface Document {
  type: string;
  checked: boolean;
  file?: File;
  uploadDate?: string;
  nomeArquivo?: string;
  urlArquivo?: string;
}

export const DOCUMENT_LABEL_MAP: Record<string, string> = {
  LAUDO_TECNICO: "Laudo Técnico",
  ART: "ART",
  RECIBO_CAR: "Recibo CAR",
};

export const INITIAL_DOCUMENTS: Document[] = [
  {
    type: "LAUDO_TECNICO",
    checked: false,
    file: undefined,
    uploadDate: undefined,
  },
  {
    type: "ART",
    checked: false,
    file: undefined,
    uploadDate: undefined,
  },
  {
    type: "RECIBO_CAR",
    checked: false,
    file: undefined,
    uploadDate: undefined,
  },
]; 