"use client";

import { FC } from "react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const handleClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4 text-sm">
      <button
        onClick={() => handleClick(1)}
        disabled={currentPage === 1}
        className={cn(
          "px-2 py-1 rounded hover:bg-gray-100",
          currentPage === 1 && "cursor-not-allowed opacity-50"
        )}
      >
        «
      </button>

      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "px-2 py-1 rounded hover:bg-gray-100",
          currentPage === 1 && "cursor-not-allowed opacity-50"
        )}
      >
        ‹
      </button>

      <span className="px-2">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "px-2 py-1 rounded hover:bg-gray-100",
          currentPage === totalPages && "cursor-not-allowed opacity-50"
        )}
      >
        ›
      </button>

      <button
        onClick={() => handleClick(totalPages)}
        disabled={currentPage === totalPages}
        className={cn(
          "px-2 py-1 rounded hover:bg-gray-100",
          currentPage === totalPages && "cursor-not-allowed opacity-50"
        )}
      >
        »
      </button>
    </div>
  );
};
