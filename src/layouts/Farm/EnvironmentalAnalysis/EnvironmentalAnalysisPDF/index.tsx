import { useState } from "react";

import { ActionConfirmationModal } from "@/components/ConfirmationModal";
import { Button } from "@/components/ui/button";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { useUpdateFarmActions } from "@/hooks/useFarms/useUpdateFarmActions";
import { customToast } from "@/utils/customToast";

interface EnvironmentalAnalysisPDFProps {
  farmId: number;
  onNavigateToContestation?: (farmId: number, analysisId: number) => void;
  onNavigateToSuitabilityPlan?: (farmId: number, analysisId: number) => void;
  onAnalysisClick: () => void;
}

type SelectedAction = "confirmDetections" | "contestDetections" | null;

export const EnvironmentalAnalysisPDF = ({
  farmId,
  onNavigateToContestation,
  onNavigateToSuitabilityPlan,
  onAnalysisClick,
}: EnvironmentalAnalysisPDFProps) => {
  const { data: farm, isLoading, refetch } = useGetFarmById(farmId);
  const updateFarmActions = useUpdateFarmActions();

  const [selectedAction, setSelectedAction] = useState<SelectedAction>(null);

  if (isLoading) return <p>Carregando...</p>;

  const currentAnalysis = farm?.retornoAnalises?.[0];
  const pdfUrl = currentAnalysis?.urlRelatorio;
  const analysisId = currentAnalysis?.id;

  const hasDecision =
    !!farm?.confirmarDeteccoes ||
    !!farm?.contestarDeteccoes ||
    !!farm?.proporNovaArea ||
    !!farm?.confirmarEstrategia ||
    !!farm?.termoAssinado;

  if (!pdfUrl) {
    return <p>Nenhuma análise socioambiental disponível.</p>;
  }

  const closeModal = () => {
    setSelectedAction(null);
  };

  const handleOpenConfirmDetectionsModal = () => {
    setSelectedAction("confirmDetections");
  };

  const handleOpenContestDetectionsModal = () => {
    setSelectedAction("contestDetections");
  };

  const handleConfirmAction = async () => {
    if (!analysisId || !selectedAction) return;

    try {
      if (selectedAction === "confirmDetections") {
        await updateFarmActions.mutateAsync({
          idPropriedade: farmId,
          confirmarDeteccoes: true,
          contestarDeteccoes: false,
          proporNovaArea: true,
          confirmarEstrategia: false,
          termoAssinado: false,
        });

        await refetch();

        onAnalysisClick?.();
        onNavigateToSuitabilityPlan?.(farmId, analysisId);
      }

      if (selectedAction === "contestDetections") {
        await updateFarmActions.mutateAsync({
          idPropriedade: farmId,
          contestarDeteccoes: true,
          confirmarDeteccoes: false,
          proporNovaArea: false,
          confirmarEstrategia: false,
          termoAssinado: false,
        });

        await refetch();

        onAnalysisClick?.();
        onNavigateToContestation?.(farmId, analysisId);
      }

      closeModal();
    } catch {
      customToast.error("Erro ao salvar a ação. Tente novamente.");
    }
  };

  const modalContent = {
    confirmDetections: {
      title: "Confirmar detecções informadas?",
      description:
        "Ao confirmar as detecções informadas, você seguirá para a Estratégia de Adequação e não poderá voltar para contestar essas detecções.",
    },
    contestDetections: {
      title: "Contestar detecções informadas?",
      description:
        "Ao contestar as detecções informadas, você seguirá para a página de Contestação e não poderá voltar para confirmar diretamente essas detecções.",
    },
  };

  const currentModalContent = selectedAction
    ? modalContent[selectedAction]
    : null;

  return (
    <div className="w-full h-[80vh] p-4">
      <iframe
        src={pdfUrl}
        title="Relatório Socioambiental"
        className="w-full h-full border rounded-lg shadow"
      />

      <div className="py-4 flex justify-end gap-4">
        <Button
          onClick={handleOpenConfirmDetectionsModal}
          variant="green"
          disabled={hasDecision || updateFarmActions.isPending}
        >
          Confirmar detecções informadas
        </Button>

        <Button
          onClick={handleOpenContestDetectionsModal}
          variant="danger"
          disabled={hasDecision || updateFarmActions.isPending}
        >
          Contestar detecções informadas
        </Button>
      </div>

      {currentModalContent && (
        <ActionConfirmationModal
          isOpen={!!selectedAction}
          title={currentModalContent.title}
          description={currentModalContent.description}
          confirmText="Sim, continuar"
          cancelText="Cancelar"
          isLoading={updateFarmActions.isPending}
          onClose={closeModal}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
};
