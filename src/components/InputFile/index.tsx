import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { FiUpload } from "react-icons/fi";

import { Trash } from "@/icons/Trash";

interface InputFileUploadProps {
  name: string;
  label: string;
  control: any;
  accept?: string;
}

export const InputFileUpload = ({
  name,
  label,
  control,
  accept,
}: InputFileUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <label className="block text-green-700 mb-1">{label}</label>
          <div
            className={`w-full h-[48px] p-4 rounded focus:outline-none border border-[#CAC4D0] shadow-[0px_1px_3px_rgba(0,0,0,0.3)] placeholder:text-[#D7D6D7] flex items-center bg-white cursor-pointer hover:bg-gray-50 transition relative ${
              isDragActive ? "border-green-600 bg-green-50" : ""
            }`}
            onClick={() => {
              if (!field.value && inputRef.current) inputRef.current.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                field.onChange(e.dataTransfer.files[0]);
                if (inputRef.current) inputRef.current.value = "";
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Selecionar arquivo"
          >
            <input
              key={field.value ? field.value.name : "empty"}
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={(e) => field.onChange(e.target.files?.[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
              tabIndex={-1}
              style={{ pointerEvents: "none" }} // impede clique direto no input, só pelo container
            />
            <span className="flex-1 text-gray-700 truncate z-10">
              {field.value?.name || "Selecione um arquivo ou arraste aqui"}
            </span>
            {field.value ? (
              <button
                type="button"
                className="ml-2 text-red-500 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  field.onChange(undefined);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                tabIndex={0}
                aria-label="Remover arquivo"
              >
                <Trash />
              </button>
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
