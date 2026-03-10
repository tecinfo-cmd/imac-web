import { useForm } from "react-hook-form";
import { IoSearchSharp } from "react-icons/io5";

import { Input } from "@/components/Input";
import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";

import { useGetCities } from "@/hooks/useAddress/useGetCities";

type FilterUsersProps = {
  onFilter: (filters: any) => void;
};
export const unmaskCPFOrCNPJ = (value: string) => {
  return value.replace(/\D/g, "");
};

export const FilterProperties = ({ onFilter }: FilterUsersProps) => {
  const { control, handleSubmit, reset } = useForm();
  const { data: cities } = useGetCities();

  const handleFilterFarm = (data: any) => {
    console.log("Dados do formulário:", data);
    const formattedData = {
      ...data,
      nomePropriedade: data.nome,
      codigoMunicipio: data.codigoMunicipio?.value,
      status: data.status?.value,
      carFederal: data.carFederal?.toUpperCase().trim(),
      analista: data.analista?.toUpperCase().trim(),
    };
    onFilter(formattedData);
  };

  const clearFilter = () => {
    reset({
      nome: "",
      carFederal: "",
      codigoMunicipio: null,
      status: null,
    });
    onFilter({});
  };

  return (
    <form
      className="flex items-center gap-4 py-6 px-4"
      onSubmit={handleSubmit(handleFilterFarm)}
    >
      <Input
        name="nome"
        label="Nome da Propriedade"
        placeholder="Digite o nome"
        control={control}
      />

      <InputSelect
        name="codigoMunicipio"
        label="Município"
        placeholder="Município"
        control={control}
        options={
          cities?.map((city) => ({
            label: city.nome,
            value: city.codigo,
          })) || []
        }
      />
      <Input
        name="carFederal"
        label="CAR Federal"
        placeholder="Digite o CAR Federal"
        control={control}
      />
      
      <Input
        name="carEstadual"
        label="CAR Estadual"
        placeholder="Digite o CAR Estadual"
        control={control}
      />

      <Input
        name="analista"
        label="Analista"
        placeholder="Digite o nome do analista"
        control={control}
      />

      <InputSelect
        name="status"
        label="Status"
        placeholder="Selecione"
        control={control}
        options={[
          { label: "Ativo", value: "ATIVO", color: "#21801A" },
          { label: "Inativo", value: "INATIVO", color: "#F44336" },
          {
            label: "Voucher Adquirido",
            value: "VOUCHER_ADQUIRIDO",
            color: "#21801A",
          },
          {
            label: "Análise Solicitada",
            value: "ANALISE_SOLICITADA",
            color: "#F3BF45",
          },
          {
            label: "Desistiu do PREM",
            value: "DESISTIU_PREM",
            color: "#F44336",
          },
          {
            label: "Análise Socioambiental Solicitada",
            value: "ANALISE_SOCIOAMBIENTAL_SOLICITADA",
            color: "#F3BF45",
          },
          {
            label: "Contestação Solicitada",
            value: "CONTESTACAO_SOLICITADA",
            color: "#F3BF45",
          },
          {
            label: "Contestação Pendente",
            value: "CONTESTACAO_PENDENTE",
            color: "#F44336",
          },
          {
            label: "Contestação Analisada",
            value: "CONTESTACAO_ANALISADA",
            color: "#21801A",
          },
          {
            label: "Estratégia de Adequação Solicitado",
            value: "ESTRATEGIA_ADEQUACAO_SOLICITADO",
            color: "#F3BF45",
          },
          {
            label: "Estratégia de Adequação Pendente",
            value: "ESTRATEGIA_ADEQUACAO_PENDENTE",
            color: "#F44336",
          },
          {
            label: "Estratégia de Adequação Analisada",
            value: "ESTRATEGIA_ADEQUACAO_ANALISADA",
            color: "#21801A",
          },
          {
            label: "Plano de Adequação Solicitado",
            value: "PLANO_ADEQUACAO_SOLICITADO",
            color: "#F3BF45",
          },
          {
            label: "Plano de Adequação Aceito",
            value: "PLANO_ADEQUACAO_ACEITO",
            color: "#21801A",
          },
          {
            label: "Termo de Adequação Assinado",
            value: "TERMO_ADEQUACAO_ASSINADO",
            color: "#21801A",
          },
          {
            label: "Valores da multa aceitado",
            value: "VALORES_MULTA_ACEITO",
            color: "#21801A",
          },
          {
            label: "Autovistoria Realizada",
            value: "AUTOVISTORIA_REALIZADA",
            color: "#21801A",
          },
          {
            label: "Autovistoria Não Realizada",
            value: "AUTOVISTORIA_NAO_REALIZADA",
            color: "#F44336",
          },
          {
            label: "Autorização de Comercialização Ativo (AC Ativa)",
            value: "AC_ATIVA",
            color: "#21801A",
          },
          {
            label: "Autorização de Comercialização Bloqueado (AC Bloqueada)",
            value: "AC_BLOQUEADA",
            color: "#F44336",
          },
        ]}
        formatOptionLabel={(option: any) => (
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: option.color }}
            />
            <span>{option.label}</span>
          </div>
        )}
      />

      <div className="pt-4 flex items-center gap-4">
        <Button type="submit" variant="green" className="mt-4">
          Buscar <IoSearchSharp size={20} />
        </Button>
        <Button
          type="submit"
          variant="danger"
          className="mt-4"
          onClick={clearFilter}
        >
          Limpar
        </Button>
      </div>
    </form>
  );
};
