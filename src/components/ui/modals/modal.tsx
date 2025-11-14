import { FC } from "react";
import { IoCloseOutline } from "react-icons/io5";

import * as Dialog from "@radix-ui/react-dialog";

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeIcon?: React.ReactNode;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  children,
  className,
  closeIcon,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-white opacity-80" />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw] sm:max-w-[400px] lg:max-w-[449px] max-h-[90vh] p-6 overflow-auto rounded-[20px] shadow-[0_8px_20px_rgba(0,0,0,0.1),0_-8px_20px_rgba(0,0,0,0.1)] ${
            className ?? "bg-white"
          }`}
          aria-describedby={undefined}
        >
          <Dialog.Close
            className="absolute top-10 right-10 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            {closeIcon || <IoCloseOutline className="w-6 h-6 sm:w-8 sm:h-8" />}
          </Dialog.Close>
          <Dialog.Title className="text-lg font-bold mb-4">{""}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
