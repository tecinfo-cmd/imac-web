import { FC } from "react";

import Modal from "@/components/ui/modals/modal";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  data: any;
}

export const TechnicalDetail: FC<Props> = ({
  isOpen,
  onOpenChange,
  onClose,
  data,
}) => {
  if (!data) return null;

  return (
    <Modal
      className="bg-[#DFEEE5] border-[1px] border-[#cac8c8]"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      <div className="text-[#0A3503] space-y-2">
        <h2 className="text-center font-bold text-xl">Detalhes do Técnico</h2>
        <div>
          <strong className="text-[#21801A]">Nome:</strong> {data.nome}
        </div>
        <div>
          <strong className="text-[#21801A]">CPF:</strong> {data.cpf}
        </div>
        <div>
          <strong className="text-[#21801A]">Profissão:</strong> {data.profissao}
        </div>
        <div>
          <strong className="text-[#21801A]">Registro CREA:</strong> {data.registroCrea}
        </div>
        <div>
          <strong className="text-[#21801A]">Telefone:</strong> {data.telefone}
        </div>
        <div>
          <strong className="text-[#21801A]">Email:</strong> {data.email}
        </div>
        <div>
          <strong className="text-[#21801A]">Data de Criação:</strong>{" "}
          {new Date(data.dataCriacao).toLocaleString()}
        </div>
        <div>
          <strong className="text-[#21801A]">Endereço:</strong>
          <div>Município: {data.endereco?.municipio}</div>
          <div>Estado: {data.endereco?.estado}</div>
          <div>Logradouro: {data.endereco?.logradouro}</div>
          <div>Complemento: {data.endereco?.complemento}</div>
          <div>CEP: {data.endereco?.cep}</div>
        </div>
      </div>
    </Modal>
  );
};
