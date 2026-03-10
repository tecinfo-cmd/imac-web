import { useState } from "react";
import { LiaRandomSolid } from "react-icons/lia";
import { MdPauseCircleFilled, MdPlayCircleFilled } from "react-icons/md";

import { Trash } from "@/icons/Trash";
import { useUserRoleStore } from "@/store/useUserRoleStore";

interface ConfirmBoxProps {
  onConfirm?: () => void;
  onActivate?: () => void;
  status: string;
  onRedistribute?: () => void;
  disabled?: boolean;
  className?: string;
  mode?: "default" | "simple";
  icon?: React.ReactNode;
}

export function ConfirmBox({
  onConfirm,
  onActivate,
  status,
  onRedistribute,
  disabled = false,
  className = "",
  mode = "default",
  icon,
}: ConfirmBoxProps) {
  const [showBox, setShowBox] = useState(false);
  const { role } = useUserRoleStore();

  const isAdmin = role === "ADMINISTRATIVO";
  const isActive = status === "ATIVO";

  const handleClick = () => {
    if (mode === "simple") {
      setShowBox(true);
      return;
    }

    if (status === "ATIVO") {
      setShowBox(true);
    } else if (status === "INATIVO" && onActivate) {
      setShowBox(true);
    } else if (onRedistribute) {
      setShowBox(true);
    }
  };

  const handleConfirm = () => {
    if (mode === "simple") {
      onConfirm?.();
      setShowBox(false);
      return;
    }

    if (isActive && onConfirm) {
      onConfirm();
      setShowBox(false);
    } else if (status === "INATIVO" && onActivate) {
      onActivate();
      setShowBox(false);
    } else if (onRedistribute) {
      onRedistribute();
      setShowBox(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`text-[#21801A] hover:underline ${className}`}
      >
        {icon ? (
          icon
        ) : isAdmin ? (
          status === "ATIVO" ? (
            <MdPauseCircleFilled size={24} />
          ) : status === "REDISTRIBUIR" ? (
            <LiaRandomSolid size={20} />
          ) : (
            <MdPlayCircleFilled size={24} />
          )
        ) : (
          <Trash />
        )}
      </button>

      {showBox && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-white border border-gray-300 rounded shadow-lg p-4 text-center">
          <p className="text-[#21801A] mb-4">
            {mode === "simple"
              ? "Tem certeza que deseja deseja inativar?"
              : status === "REDISTRIBUIR"
              ? "Tem certeza que deseja redistribuir? Essa ação não poderá ser desfeita"
              : `Tem certeza que deseja ${
                  isActive ? (isAdmin ? "pausar" : "inativar") : "ativar"
                }?`}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleConfirm}
              className="bg-[#21801A] hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Sim
            </button>
            <button
              onClick={() => setShowBox(false)}
              className="bg-[#F44336] hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
