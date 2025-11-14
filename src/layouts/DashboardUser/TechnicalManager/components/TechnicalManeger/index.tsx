import { FC } from "react";

import Modal from "@/components/ui/modals/modal";

import { X } from "@/icons/X";

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
      className="bg-[#ffff] border-[1px] border-[#cac8c8] !w-full !max-w-4xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      closeIcon={<X/>}
    >
      <div className="p-6">
        <div className="bg-[#21801A] text-white text-center px-4 py-2 font-semibold mt-4">
          Informações do Responsável Técnico
        </div>
        <div className="mb-6 mt-4">
          <h3 className="font-bold text-lg mb-4 text-[#0A3503]">
            DADOS PESSOAIS
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <span className="text-[#21801A] font-medium">Nome</span>
              <div className="text-[#0A3503]">{data.nome}</div>
            </div>
            <div>
              <span className="text-[#21801A] font-medium">CPF</span>
              <div className="text-[#0A3503]">{data.cpf}</div>
            </div>
            <div>
              <span className="text-[#21801A] font-medium">Registro CREA</span>
              <div className="text-[#0A3503]">{data.registroCrea}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-[#21801A] font-medium">Profissão</span>
              <div className="text-[#0A3503]">{data.profissao}</div>
            </div>
            <div>
              <span className="text-[#21801A] font-medium">Telefone</span>
              <div className="text-[#0A3503]">{data.telefone}</div>
            </div>
            <div>
              <span className="text-[#21801A] font-medium">E-mail</span>
              <div className="text-[#0A3503]">{data.email}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-[#0A3503]">ENDEREÇO</h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <span className="text-[#21801A] font-medium">CEP</span>
              <div className="text-[#0A3503]">{data.endereco?.cep}</div>
            </div>
            <div>
              <span className="text-[#21801A] font-medium">Logradouro</span>
              <div className="text-[#0A3503]">{data.endereco?.logradouro}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-[#21801A] font-medium">
                Complemento (Opcional)
              </span>
              <div className="text-[#0A3503]">{data.endereco?.complemento}</div>
            </div>
            <div>
              <span className="text-[#21801A] font-medium">Município</span>
              <div className="text-[#0A3503]">{data.endereco?.municipio}</div>
            </div>
            <div>
              <span className="text-[#21801A] font-medium">UF</span>
              <div className="text-[#0A3503]">{data.endereco?.estado}</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
