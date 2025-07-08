import { FC } from "react";

import Modal from "@/components/ui/modals/modal";

import { useGetElegibilityDetail } from "@/hooks/useGetElegibilities/useGetElegibilityDetail";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  id: number | null;
  cpfCnpj?: string;
  carFederal?: string;
}

const formatDateTime = (value: string) => {
  const date = new Date(value);
  const data = date.toLocaleDateString("pt-BR");
  const hora = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${data} - ${hora}`;
};

export const ElegibilityDetail: FC<Props> = ({
  isOpen,
  onOpenChange,
  onClose,
  id,
  cpfCnpj,
  carFederal,
}) => {
  const { data, isLoading } = useGetElegibilityDetail(id || "", isOpen && !!id);

  if (isLoading || !data || data.length === 0) return null;

  const item = data;
  const retorno = item?.retornoAgrotools ?? {};

  return (
    <Modal
      className="bg-[#DFEEE5] border-[1px] border-[#cac8c8]"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      <div className="text-[#0A3503] space-y-2">
        <h2 className="text-center font-bold text-xl">ELEGIBILIDADE</h2>

        <div>
          <strong className="text-[#21801A]">Nome da Propriedade</strong>
          <br />
          {item.nomePropriedade}
        </div>
        {cpfCnpj && (
          <div>
            <strong className="text-[#21801A]">CPF do solicitante</strong>
            <br />
            {cpfCnpj}
          </div>
        )}
        <div>
          <strong className="text-[#21801A]">Telefone do solicitante</strong>
          <br />
          {item.telefone}
        </div>
        <div>
          <strong className="text-[#21801A]">E-mail do Solicitante</strong>
          <br />
          {item.email}
        </div>
        <div>
          <strong className="text-[#21801A]">Data / hora da Solicitação</strong>
          <br />
          {formatDateTime(item.dataCriacao)}
        </div>

        <div className="pt-2">
          <strong className="text-[#21801A]">Resultado da Elegibilidade</strong>
          <ul className="list-disc ml-5">
            {carFederal && (
              <li>
                CAR: <span className="text-black">{carFederal}</span>
              </li>
            )}
            <li>
              {retorno.deteccoes && retorno.deteccoes.length > 0 ? (
                retorno.deteccoes.map((detec: any) => (
                  <li key={detec.id}>
                    {detec.tipo}: <strong className="text-black">{detec.area_ha}</strong>
                  </li>
                ))
              ) : (
                <span className="text-black ml-2">N/A</span>
              )}
            </li>
            <li>
              Sobreposição com área de RL ou APP:{" "}
              <span className="text-black">
                {retorno?.hasDocuments === false ? "Não" : "Sim"}
              </span>
            </li>
            <li>
              Propriedade:{" "}
              <strong>
                <span className="text-black">
                  {item.status === "APROVADO" ? "ELEGÍVEL " : "NÃO ELEGÍVEL "}
                </span>
              </strong>
              <span>a participar do PREM</span>
            </li>
            <li>
              Área de desmatamento total:{" "}
              <span className="text-black">
                {retorno?.areas_desmatamento_total ?? "N/A"}
              </span>
            </li>
            <li>
              Número de Módulos Fiscais:{" "}
              <span className="text-black">
                {retorno?.modulo_fiscal ?? "N/A"}
              </span>
            </li>
            <li>
              <strong>
                Valor da multa indenizatória: R${" "}
                <span className="text-black">
                  {retorno?.vlr_multa !== undefined
                    ? retorno.vlr_multa.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "N/A"}
                </span>
              </strong>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
