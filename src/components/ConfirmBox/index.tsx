// src/components/ConfirmBox.tsx

import { useState } from "react";

import { Trash } from "@/icons/Trash";
import { toast } from "sonner";

interface ConfirmBoxProps {
  onConfirm: () => void;
  status: string; 
}

export function ConfirmBox({ onConfirm , status}: ConfirmBoxProps) {
  const [showBox, setShowBox] = useState(false);

  const handleClick = () => {
    console.log("STATUS RECEBIDO:", status);
    if (status !== "ATIVO") {
      toast.warning("Este usuário já está inativo."); 
      return;
    }

    setShowBox(true);
  };

  const handleConfirm = () => {
    onConfirm();
    setShowBox(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={ handleClick }
        className="text-[#21801A] hover:underline"
      >
        <Trash />
      </button>

      {showBox && (
        <div className="absolute z-10 top-full mt-2 right-0 w-64 bg-white border border-gray-300 rounded shadow-lg p-4 text-center">
          <p className="text-gray-700 mb-4">Tem certeza que deseja inativar?</p>
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
