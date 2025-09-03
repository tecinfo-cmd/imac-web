import React from "react";
import { MdClose } from "react-icons/md";

import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const ModalContainer = ({
  isOpen,
  onClose,
  children,
  className,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-white shadow-lg w-full max-w-lg overflow-hidden relative",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const ModalHeader = ({ children, className }: SectionProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-4 py-3 border-b border-gray-200",
        className
      )}
    >
      <h2 className="text-lg font-semibold text-white">{children}</h2>
    </div>
  );
};

const ModalBody = ({ children, className }: SectionProps) => {
  return (
    <div className={cn("px-4 py-3 text-gray-700", className)}>{children}</div>
  );
};

const ModalFooter = ({ children, className }: SectionProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200",
        className
      )}
    >
      {children}
    </div>
  );
};

const ModalCloseButton = ({ onClose }: { onClose: () => void }) => {
  return (
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
    >
      <MdClose className="w-5 h-5" />
    </button>
  );
};

export const Modal = {
  Container: ModalContainer,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  CloseButton: ModalCloseButton,
};
