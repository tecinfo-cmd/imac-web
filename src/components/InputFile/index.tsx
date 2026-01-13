import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { FiUpload } from "react-icons/fi";

import { Trash } from "@/icons/Trash";
import { toast } from "sonner";

// Validação de caracteres especiais em nomes de arquivo
function validateFileName(fileName: string): boolean {
  // Permite apenas: letras (com acentos), números, underscore (_), hífen (-) e ponto (.)
  const validPattern = /^[\w\-\u00C0-\u017FA-Za-z0-9._]+$/;
  return validPattern.test(fileName);
}

function getInvalidCharacters(fileName: string): string {
  // Remove caracteres válidos e retorna os inválidos
  const validChars = /[\w\-\u00C0-\u017FA-Za-z0-9._]/g;
  const invalidChars = fileName.replace(validChars, "");
  return [...new Set(invalidChars)].join("");
}

interface InputFileUploadProps {
  name: string;
  label: string;
  control: any;
  accept?: string;
  onRemove?: () => void;
  disabled?: boolean;
  onFileChange?: (files: FileList | File[] | null) => void;
}

export const InputFileUpload = ({
  name,
  label,
  control,
  accept,
  onRemove,
  disabled = false,
  onFileChange,
}: InputFileUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <label className="block text-green-700 mb-1">{label}</label>
          <div
            className={`w-full h-[48px] p-4 rounded focus:outline-none border border-[#CAC4D0] shadow-[0px_1px_3px_rgba(0,0,0,0.3)] placeholder:text-[#D7D6D7] flex items-center transition relative ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white cursor-pointer hover:bg-gray-50"
            } ${
              isDragActive && !disabled ? "border-green-600 bg-green-50" : ""
            }`}
            onClick={() => {
              if (!disabled && !field.value && inputRef.current)
                inputRef.current.click();
            }}
            onDragOver={(e) => {
              if (!disabled) {
                e.preventDefault();
                setIsDragActive(true);
              }
            }}
            onDragLeave={(e) => {
              if (!disabled) {
                e.preventDefault();
                setIsDragActive(false);
              }
            }}
            onDrop={(e) => {
              if (!disabled) {
                e.preventDefault();
                setIsDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const file = e.dataTransfer.files[0];
                  if (!validateFileName(file.name)) {
                    const invalidChars = getInvalidCharacters(file.name);
                    toast.error(
                      `Nome de arquivo inválido. Caracteres não permitidos: ${invalidChars}. Permitidos: letras, números, acentos, _ e -`,
                      { duration: 5000 }
                    );
                    return;
                  }
                  field.onChange(file);
                  onFileChange?.(e.dataTransfer.files);

                  if (inputRef.current) inputRef.current.value = "";
                }
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Selecionar arquivo"
          >
            <input
              key={`${name}-${resetKey}`}
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={(e) => {
                if (!disabled) {
                  const file = e.target.files?.[0];
                  if (file && !validateFileName(file.name)) {
                    const invalidChars = getInvalidCharacters(file.name);
                    toast.error(
                      `Nome de arquivo inválido. Caracteres não permitidos: ${invalidChars}. Permitidos: letras, números, acentos, _ e -`,
                      { duration: 5000 }
                    );
                    if (inputRef.current) inputRef.current.value = "";
                    return;
                  }
                  field.onChange(file);
                  onFileChange?.(e.target.files);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
              tabIndex={-1}
              style={{ pointerEvents: "none" }}
              disabled={disabled}
            />
            <span
              className={`flex-1 truncate z-10 ${
                disabled ? "text-gray-500" : "text-gray-700"
              }`}
            >
              {field.value?.name ||
                (disabled
                  ? "Arquivo não pode ser alterado"
                  : "Selecione um arquivo ou arraste aqui")}
            </span>
            {field.value ? (
              !disabled && (
                <button
                  type="button"
                  className="ml-2 text-red-500 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.onChange(undefined);
                    if (inputRef.current) inputRef.current.value = "";
                    setResetKey((prev) => prev + 1);
                    onRemove?.();
                  }}
                  tabIndex={0}
                  aria-label="Remover arquivo"
                >
                  <Trash />
                </button>
              )
            ) : (
              <span className="ml-2 text-gray-400 z-10">
                <FiUpload />
              </span>
            )}
          </div>
          {fieldState.error && (
            <span className="text-red-500 text-xs">
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};
