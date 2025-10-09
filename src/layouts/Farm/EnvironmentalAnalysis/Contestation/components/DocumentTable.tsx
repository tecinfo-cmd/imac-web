"use client";
import Link from "next/link";
import { FiEye, FiUpload } from "react-icons/fi";
import { IoTrashSharp } from "react-icons/io5";

import { Table } from "@/components/Table";

import { Document } from "../types";

interface DocumentTableProps {
  documents: Document[];
  onCheckboxChange: (index: number) => void;
  onFileChange: (index: number, file: File) => void;
  onRemoveFile: (index: number) => void;
  labelMap: Record<string, string>;
  disabled?: boolean;
}

export const DocumentTable = ({
  documents,
  onCheckboxChange,
  onFileChange,
  onRemoveFile,
  labelMap,
  disabled = false,
}: DocumentTableProps) => {
  return (
    <div className="mt-8">
      <h3 className="text-[#21801A] text-lg font-semibold mb-4">
        Anotação de responsabilidade técnica
      </h3>
      <span>
        Anexe Recibo do CAR da propriedade Comprovante de pagamento de taxa.
      </span>
      <Table.Container>
        <Table.Header>
          <Table.Title className="text-[#21801A] font-normal">
            Descrição do documento
          </Table.Title>
          <Table.Title className="text-[#21801A] font-normal">
            Data de Upload
          </Table.Title>
          <Table.Title className="text-[#21801A] font-normal">{""}</Table.Title>
        </Table.Header>
        <Table.Body>
          {documents.map((doc, index) => (
            <Table.Row key={index}>
              <Table.Cell className="border-none text-gray-900">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-[#21801A]"
                    checked={doc.checked}
                    onChange={() => onCheckboxChange(index)}
                    disabled={disabled}
                  />
                  {labelMap[doc.type] || "Documento"}
                </label>
              </Table.Cell>
              <Table.Cell className="border-none">
                {doc.uploadDate || "-"}
              </Table.Cell>
              <Table.Cell className="border-none flex gap-2 items-center">
                {doc.urlArquivo ? (
                  <Link
                    href={doc.urlArquivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Visualizar documento"
                  >
                    <FiEye size={18} />
                  </Link>
                ) : doc.checked && !doc.file && !disabled ? (
                  <label className="cursor-pointer">
                    <FiUpload size={18} />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files && onFileChange(index, e.target.files[0])
                      }
                      disabled={disabled}
                    />
                  </label>
                ) : null}

                {doc.file && (
                  <button
                    type="button"
                    onClick={() => onRemoveFile(index)}
                    className="text-red-600"
                  >
                    <IoTrashSharp size={18} />
                  </button>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>
    </div>
  );
};
