"use client";
import React, { useRef } from "react";
import { IoTrashSharp } from "react-icons/io5";

import { Table } from "@/components/Table";
import { Tooltip } from "@/components/Tooltip";

import { Eye } from "@/icons/Eye";
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

type Documento = {
  id: number;
  nomeArquivo: string;
  nomeArquivoOriginal: string;
  urlArquivo: string;
  tipo: string;
};

export const PropertieDocument = ({
  files,
  setFiles,
}: {
  files: (Documento | File)[];
  setFiles: React.Dispatch<React.SetStateAction<(Documento | File)[]>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const fileArr = Array.from(newFiles);

    // Validar nomes de arquivos
    const invalidFiles = fileArr.filter((file) => !validateFileName(file.name));
    if (invalidFiles.length > 0) {
      invalidFiles.forEach((file) => {
        const invalidChars = getInvalidCharacters(file.name);
        toast.error(
          `Arquivo "${file.name}" rejeitado. Caracteres não permitidos: ${invalidChars}. Permitidos: letras, números, acentos, _ e -`,
          { duration: 5000 }
        );
      });
      // Filtrar apenas arquivos válidos
      const validFiles = fileArr.filter((file) => validateFileName(file.name));
      if (validFiles.length === 0) return;
    }

    const validFiles = fileArr.filter((file) => validateFileName(file.name));
    const merged = [...files, ...validFiles].slice(0, 3);
    setFiles(merged);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (files.length < 3) handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (files.length < 3) inputRef.current?.click();
  };

  const handleRemove = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <>
      <div
        onDragOver={(e) => files.length < 3 && e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="bg-[#21801A] text-white px-4 py-2 mt-8 font-semibold">
          <h3>Documentos da propriedade</h3>
          <span className="text-sm font-normal">
            (Matricula do imóvel, recibo CAR, contrato de compra e venda /
            locação, documentos de identificação e comprovante de endereço)
          </span>
        </div>
        <Table.Container className="!pt-0">
          <Table.Header>
            <Table.Title>Nome do arquivo</Table.Title>
            <Table.Title>Ações</Table.Title>
          </Table.Header>
          <Table.Body>
            {files.map((file, idx) => {
              if ("urlArquivo" in file) {
                // Documento do backend
                return (
                  <Table.Row key={file.id}>
                    <Table.Cell>
                      <a
                        href={file.urlArquivo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.nomeArquivoOriginal}
                      </a>
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip
                        message="Visualizar arquivo"
                        id={`view-${file.id}`}
                      >
                        <a
                          href={file.urlArquivo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye size={30} />
                        </a>
                      </Tooltip>
                    </Table.Cell>
                  </Table.Row>
                );
              } else {
                // Novo arquivo
                return (
                  <Table.Row key={idx}>
                    <Table.Cell>{file.name}</Table.Cell>
                    <Table.Cell>
                      <button type="button" onClick={() => handleRemove(idx)}>
                        <IoTrashSharp className="text-red-500" />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                );
              }
            })}
            {files.length === 0 && (
              <Table.Row>
                <Table.Cell className="!px-0 !py-0" colspan={4}>
                  <div
                    className="bg-gray-200 w-full py-8 flex flex-col items-center justify-center cursor-pointer"
                    onClick={handleClick}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <span className="text-lg text-black mb-2">
                      Arraste os arquivos para fazer upload ou clique para
                      selecionar
                    </span>
                    <span className="text-sm text-gray-600">
                      Máximo de 3 arquivos
                    </span>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
            {files.length > 0 && files.length < 3 && (
              <Table.Row>
                <Table.Cell colspan={4}>
                  <div
                    className="w-full py-4 flex flex-col items-center justify-center cursor-pointer border border-dashed border-gray-400"
                    onClick={handleClick}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <span className="text-sm text-gray-600">
                      Clique ou arraste para adicionar mais arquivos (máximo 3)
                    </span>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Container>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
          accept="*"
        />
      </div>
    </>
  );
};
