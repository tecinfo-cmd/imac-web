import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modals/modal";

interface ActionConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ActionConfirmationModal({
  isOpen,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
  onClose,
  onConfirm,
}: ActionConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      onClose={onClose}
      className="bg-white"
    >
      <div className="pt-6 text-center">
        <h2 className="text-xl font-semibold text-[#1A6415] mb-4">{title}</h2>

        <p className="text-[#0A3503] text-sm mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex justify-center gap-4">
          <Button
            type="button"
            variant="green"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? "Salvando..." : confirmText}
          </Button>

          <Button
            type="button"
            variant="danger"
            disabled={isLoading}
            onClick={onClose}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
