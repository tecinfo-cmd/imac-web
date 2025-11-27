// src/components/ConfirmBox.tsx

import { useState } from "react";
import { MdPauseCircleFilled, MdPlayCircleFilled } from "react-icons/md";

import { Trash } from "@/icons/Trash";
import { useUserRoleStore } from "@/store/useUserRoleStore";

interface ConfirmBoxProps {
  onConfirm: () => void;
  onActivate?: () => void;
  status: string;
}

export function ConfirmBox({ onConfirm, onActivate, status }: ConfirmBoxProps) {
  const [showBox, setShowBox] = useState(false);
  const { role } = useUserRoleStore();

  const isAdmin = role === "ADMINISTRATIVO";
  const isActive = status === "ATIVO";

  const handleClick = () => {
    if (status === "ATIVO") {
      setShowBox(true);
    } else if (status === "INATIVO" && onActivate) {
      setShowBox(true);
    }
  };

  const handleConfirm = () => {
    if (isActive ){
    onConfirm();
    setShowBox(false);
    } else {
      if (onActivate) {
        onActivate();
      }
      setShowBox(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button onClick={handleClick} className="text-[#21801A] hover:underline">
        {isAdmin ? (
          status === "ATIVO" ? (
            <MdPauseCircleFilled size={24} />
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
            Tem certeza que deseja {isActive ? "pausar" : "ativar"}?
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
