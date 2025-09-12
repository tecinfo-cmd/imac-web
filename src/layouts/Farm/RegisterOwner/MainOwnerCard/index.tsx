import { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";

import { Tooltip } from "@/components/Tooltip";

import { Farm } from "@/hooks/useFarms/useGetFarmById";
import { formatCPFOrCNPJ } from "@/utils/formatters/formatCPFOrCNPJ";
import { formatPhone } from "@/utils/formatters/formatPhone";

import { UpdateOwnerForm } from "../UpdateOwnerForm";
import { formatDate } from "@/utils/formatters/formatDate";

interface MainOwnerCardProps {
  farm: Farm | undefined;
}

export const MainOwnerCard = ({ farm }: MainOwnerCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingOwnerId, setEditingOwnerId] = useState<number | undefined>(
    undefined
  );

  const mainOwner = farm?.proprietarios.find(
    (item) => item.tipoProprietario === "PROPRIETARIO"
  );

  const handleEditClick = () => {
    setIsEditing((prevState) => !prevState);
    setEditingOwnerId(mainOwner?.id);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-b pb-8">
      <div className="flex items-center gap-2">
        <h2 className="text-[#1A6415] text-xl font-bold">
          Proprietário Principal
        </h2>
        <Tooltip
          message="Editar dados"
          id="Editar proprietário"
          position="bottom"
        >
          <button
            className="border-2 border-[#CAC4D0] p-1 rounded"
            type="button"
            onClick={handleEditClick}
          >
            <MdOutlineEdit size={20} color="#CAC4D0" />
          </button>
        </Tooltip>
      </div>

      {isEditing && farm?.id && editingOwnerId ? (
        <UpdateOwnerForm
          farmId={farm.id}
          idProprietario={editingOwnerId}
          onSuccess={() => setIsEditing(false)}
        />
      ) : (
        <div className="space-y-6">
          {mainOwner && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h2 className="text-[#21801A]">Nome/Razão Social</h2>
                  <p>{mainOwner.pessoa.nome || "Não informado"}</p>
                </div>
                <div>
                  <h2 className="text-[#21801A]">CPF/CNPJ</h2>
                  <p>
                    {formatCPFOrCNPJ(mainOwner.pessoa.cpfCnpj) ||
                      "Não informado"}
                  </p>
                </div>
                <div>
                  <h2 className="text-[#21801A]">RG/Inscrição Social</h2>
                  <p>{mainOwner.pessoa.rgInscricaoSocial || "Não informado"}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h2 className="text-[#21801A]">Data de nascimento</h2>
                  <p>{formatDate(mainOwner.pessoa.dataNascimento) || "Não informado"}</p>
                </div>
                <div>
                  <h2 className="text-[#21801A]">Telefone</h2>
                  <p>
                    {formatPhone(mainOwner.pessoa.telefone) ||
                      formatPhone(mainOwner.telefone) ||
                      "Não informado"}
                  </p>
                </div>
                <div>
                  <h2 className="text-[#21801A]">E-mail</h2>
                  <p>{mainOwner.pessoa.email || "Não informado"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
