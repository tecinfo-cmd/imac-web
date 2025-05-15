import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";

import { Tooltip } from "@/components/Tooltip";

import { Farm, Proprietario } from "@/hooks/useFarms/useGetFarmById";
import { formatCPFOrCNPJ } from "@/utils/formatters/formatCPFOrCNPJ";
import { formatDate } from "@/utils/formatters/formatDate";
import { formatPhone } from "@/utils/formatters/formatPhone";

import { UpdateCoOwnerForm } from "../UpdateCoOwnerForm";

interface CoOwnerListProps {
  farm: Farm | undefined;
}

export const CoOwnerList = ({ farm }: CoOwnerListProps) => {
  const [showCoOwnerList, setShowCoOwnerList] = useState(true);
  const [editingCoOwner, setEditingCoOwner] = useState<Proprietario | null>(
    null
  );

  const handleEditClick = (coOwner: Proprietario) => {
    setEditingCoOwner(coOwner);
    setShowCoOwnerList(false);
  };

  const handleBack = () => {
    setEditingCoOwner(null);
    setShowCoOwnerList(true);
  };

  if (!farm) return null;

  const coOwners = farm.proprietarios.filter(
    (item) => item.tipoProprietario === "COPROPRIETARIO"
  );

  return (
    <div className="space-y-6 p-4">
      {showCoOwnerList ? (
        coOwners.map((item, index) => (
          <div key={item.id} className="flex flex-col gap-4 border-b pb-8">
            <div className="flex items-center gap-2">
              <h2 className="text-[#1A6415] text-lg font-bold">
                Co-proprietário {index + 1}
              </h2>
              <Tooltip
                message="Editar dados"
                id={`editar-${item.id}`}
                position="bottom"
              >
                <button
                  className="border-2 border-[#CAC4D0] p-1 rounded"
                  type="button"
                  onClick={() => handleEditClick(item)}
                >
                  <MdOutlineEdit size={20} color="#CAC4D0" />
                </button>
              </Tooltip>
            </div>
            <div className="flex justify-between">
              <div className="grid grid-cols-3 gap-4 w-full">
                <div>
                  <h2 className="text-[#21801A]">Nome/Razão Social</h2>
                  <p>{item.pessoa.nome || "Não informado"}</p>
                </div>
                <div>
                  <h2 className="text-[#21801A]">CPF/CNPJ</h2>
                  <p>
                    {formatCPFOrCNPJ(item.pessoa.cpfCnpj) || "Não informado"}
                  </p>
                </div>
                <div>
                  <h2 className="text-[#21801A]">RG/Inscrição Social</h2>
                  <p>{item.pessoa.rgInscricaoSocial || "Não informado"}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h2 className="text-[#21801A]">Data de nascimento</h2>
                <p>
                  {formatDate(item.pessoa.dataNascimento) || "Não informado"}
                </p>
              </div>
              <div>
                <h2 className="text-[#21801A]">Telefone</h2>
                <p>
                  {formatPhone(item.pessoa.telefone) ||
                    formatPhone(item.telefone) ||
                    "Não informado"}
                </p>
              </div>
              <div>
                <h2 className="text-[#21801A]">E-mail</h2>
                <p>{item.pessoa.email || "Não informado"}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          <Tooltip message="Voltar" id="voltar-edicao" position="bottom">
            <button
              className="border-2 border-[#CAC4D0] p-1 rounded"
              type="button"
              onClick={handleBack}
            >
              <IoArrowBack size={20} color="#CAC4D0" />
            </button>
          </Tooltip>
          <div className="flex flex-col gap-4 border-b pb-8">
            <UpdateCoOwnerForm
              farmId={farm.id}
              idProprietario={editingCoOwner?.id}
            />
          </div>
        </>
      )}
    </div>
  );
};
