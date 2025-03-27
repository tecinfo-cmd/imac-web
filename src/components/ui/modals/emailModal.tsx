import { FC } from "react";
import { IoCloseOutline } from "react-icons/io5";

import * as Dialog from "@radix-ui/react-dialog";

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  children: React.ReactNode;
}

const EmailModal: FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  children,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-white opacity-80" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90%] w-full sm:w-[377px] 
          max-h-[90vh] h-auto sm:h-[238px]  p-[30px] bg-white rounded-[20px] shadow-[0_8px_20px_rgba(0,0,0,0.1),0_-8px_20px_rgba(0,0,0,0.1)] "
          aria-describedby={undefined}
        >
          <Dialog.Close
            className="absolute top-10 right-10 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <IoCloseOutline className="w-8 h-8" />
          </Dialog.Close>
          <Dialog.Title className="text-lg font-bold mb-4">{""}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EmailModal;
