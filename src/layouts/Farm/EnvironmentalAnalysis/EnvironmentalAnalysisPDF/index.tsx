import { Button } from "@/components/ui/button";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";

interface EnvironmentalAnalysisPDFProps {
  farmId: number;
  onNavigateToContestation?: (farmId: number, analysisId: number) => void;
  onNavigateToSuitabilityPlan?: (farmId: number, analysisId: number) => void;
}

export const EnvironmentalAnalysisPDF = ({
  farmId,
  onNavigateToContestation,
  onNavigateToSuitabilityPlan,
}: EnvironmentalAnalysisPDFProps) => {
  const { data: farm, isLoading } = useGetFarmById(farmId);

  if (isLoading) return <p>Carregando...</p>;

  const pdfUrl = farm?.retornoAnalises?.[0]?.urlRelatorio;
  const analysisId = farm?.retornoAnalises?.[0]?.id;
  console.log(farm?.retornoAnalises[0]);

  if (!pdfUrl) {
    return <p>Nenhuma análise socioambiental disponível.</p>;
  }

  const handleConfirmDetections = () => {
    if (onNavigateToSuitabilityPlan && analysisId) {
      onNavigateToSuitabilityPlan(farmId, analysisId);
    }
  };

  const handleContestDetections = () => {
    if (onNavigateToContestation && analysisId) {
      onNavigateToContestation(farmId, analysisId);
    }
  };

  return (
    <div className="w-full h-[80vh] p-4">
      <iframe
        src={pdfUrl}
        title="Relatório Socioambiental"
        className="w-full h-full border rounded-lg shadow"
      />
      <div className="py-4 flex justify-end gap-4">
        <Button onClick={handleConfirmDetections} variant="green">
          Confirmar detecções informadas
        </Button>
        <Button onClick={handleContestDetections} variant="danger">
          Contestar detecções informadas
        </Button>
      </div>
    </div>
  );
};
