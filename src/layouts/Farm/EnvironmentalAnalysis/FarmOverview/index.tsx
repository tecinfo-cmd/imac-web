import { useForm } from "react-hook-form";

import { TableInformation } from "@/components/TableInformation";
import { Button } from "@/components/ui/button";

import { useGetFarmById } from "@/hooks/useFarms/useGetFarmById";
import { toast } from "sonner";

interface FarmOverviewProps {
  farmId: number;
}

export interface Section {
  title: string;
  rows: {
    columnsPerRow: number;
    columns: {
      label: string;
      value: string | undefined | null;
    }[];
  }[];
}

export const FarmOverview = ({ farmId }: FarmOverviewProps) => {
  const { data: farm } = useGetFarmById(farmId);
  const { register, watch } = useForm();
  const acceptChecked = watch("accept");

  if (!farm) return <div>Carregando...</div>;

  const owner = farm.proprietarios.find(
    (p) => p.tipoProprietario === "PROPRIETARIO"
  );

  const coOwners = farm.proprietarios.filter(
    (p) => p.tipoProprietario === "COPROPRIETARIO"
  );

  const handleSubmitRequest = () => {
    toast.custom((t) => (
      <div className="relative bg-[#DFEEE5] flex flex-col items-center text-center gap-4 py-6 px-4 shadow border border-[#0A3503] rounded-lg max-w-md w-full">
        <button
          onClick={() => toast.dismiss(t)}
          className="absolute top-2 right-3 text-[#0A3503] text-xl hover:opacity-70"
          aria-label="Fechar"
        >
          ✕
        </button>
        <h1 className="text-[#0A3503] text-xl font-semibold">
          Solicitação de Análise Socioambiental realizada com sucesso!
        </h1>
        <p className="text-sm text-[#0A3503]">
          A análise socioambiental demora até 48h. Enviaremos no seu e-mail uma
          mensagem quando estiver disponível.
        </p>
      </div>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto my-8">
      <TableInformation>
        <TableInformation.Section title="Informações Propriedades">
          <TableInformation.Row columnsPerRow={4}>
            <TableInformation.Column>
              <TableInformation.Title>
                Nome da Propriedade
              </TableInformation.Title>
              <TableInformation.Value>
                {farm.nomePropriedade}
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>Município</TableInformation.Title>
              <TableInformation.Value>
                {farm.cidade?.nome}
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>UF</TableInformation.Title>
              <TableInformation.Value>{farm.cidade?.uf}</TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>CEP</TableInformation.Title>
              <TableInformation.Value>
                {farm.endereco?.cep}
              </TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>

          <TableInformation.Row columnsPerRow={2}>
            <TableInformation.Column>
              <TableInformation.Title>Logradouro</TableInformation.Title>
              <TableInformation.Value>
                {farm.endereco?.logradouro}
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>Complemento</TableInformation.Title>
              <TableInformation.Value>
                {farm.endereco?.complemento}
              </TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>

          <TableInformation.Row columnsPerRow={3}>
            <TableInformation.Column>
              <TableInformation.Title>Longitude</TableInformation.Title>
              <TableInformation.Value>
                {String(farm.endereco?.longitude ?? "Não informado")}
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>Latitude</TableInformation.Title>
              <TableInformation.Value>
                {String(farm.endereco?.latitude ?? "Não informado")}
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>Caixa Postal</TableInformation.Title>
              <TableInformation.Value>
                {farm.endereco?.caixaPostal || "Não informado"}
              </TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>

          <TableInformation.Row columnsPerRow={3}>
            <TableInformation.Column>
              <TableInformation.Title>Módulo Fiscal</TableInformation.Title>
              <TableInformation.Value>
                {farm.moduloFiscal}
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>
                Tamanho da Propriedade
              </TableInformation.Title>
              <TableInformation.Value>{`${farm.tamanhoPropriedade} ha`}</TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>Embargo Ambiental</TableInformation.Title>
              <TableInformation.Value>
                {farm.statusVoucher ? "Sim" : "Não"}
              </TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>

          <TableInformation.Row columnsPerRow={3}>
            <TableInformation.Column>
              <TableInformation.Title>
                Atividade Principal
              </TableInformation.Title>
              <TableInformation.Value>
                {String(farm.idAtividadePrincipal)}
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>Ciclo de Produção</TableInformation.Title>
              <TableInformation.Value>
                {String(farm.idClicloProducao)}
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>
                Número de Proprietários
              </TableInformation.Title>
              <TableInformation.Value>
                {String(farm.numeroProprietarios)}
              </TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>

          <TableInformation.Row columnsPerRow={2}>
            <TableInformation.Column>
              <TableInformation.Title>
                Cadastro Ambiental Rural (CAR)
              </TableInformation.Title>
              <TableInformation.Value>{farm.carFederal}</TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>
                Código voucher PREM
              </TableInformation.Title>
              <TableInformation.Value>{farm.voucher}</TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>
        </TableInformation.Section>

        <TableInformation.Section title="Proprietário Principal">
          <TableInformation.Row columnsPerRow={3}>
            <TableInformation.Column>
              <TableInformation.Title>Nome/Razão Social</TableInformation.Title>
              <TableInformation.Value>
                {owner?.pessoa.nome}
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>CPF/CNPJ</TableInformation.Title>
              <TableInformation.Value>
                {owner?.pessoa.cpfCnpj}
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>
                RG/Inscrição Social
              </TableInformation.Title>
              <TableInformation.Value>
                {owner?.pessoa.rgInscricaoSocial || "Não informado"}
              </TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>

          <TableInformation.Row columnsPerRow={3}>
            <TableInformation.Column>
              <TableInformation.Title>
                Data de Nascimento
              </TableInformation.Title>
              <TableInformation.Value>
                {owner?.pessoa.dataNascimento}
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>Telefone</TableInformation.Title>
              <TableInformation.Value>
                {owner?.pessoa.telefone}
              </TableInformation.Value>
            </TableInformation.Column>
            <TableInformation.Column>
              <TableInformation.Title>Email</TableInformation.Title>
              <TableInformation.Value>
                {owner?.pessoa.email}
              </TableInformation.Value>
            </TableInformation.Column>
          </TableInformation.Row>
        </TableInformation.Section>

        {coOwners.map((coOwner, index) => (
          <TableInformation.Section
            key={index}
            title={`Coproprietário ${index + 1}`}
          >
            <TableInformation.Row columnsPerRow={3}>
              <TableInformation.Column>
                <TableInformation.Title>
                  Nome/Razão Social
                </TableInformation.Title>
                <TableInformation.Value>
                  {coOwner.pessoa.nome}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>CPF/CNPJ</TableInformation.Title>
                <TableInformation.Value>
                  {coOwner.pessoa.cpfCnpj}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>
                  RG/Inscrição Social
                </TableInformation.Title>
                <TableInformation.Value>
                  {coOwner.pessoa.rgInscricaoSocial || "—"}
                </TableInformation.Value>
              </TableInformation.Column>
            </TableInformation.Row>

            <TableInformation.Row columnsPerRow={3}>
              <TableInformation.Column>
                <TableInformation.Title>
                  Data de Nascimento
                </TableInformation.Title>
                <TableInformation.Value>
                  {coOwner.pessoa.dataNascimento}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>Telefone</TableInformation.Title>
                <TableInformation.Value>
                  {coOwner.pessoa.telefone}
                </TableInformation.Value>
              </TableInformation.Column>
              <TableInformation.Column>
                <TableInformation.Title>Email</TableInformation.Title>
                <TableInformation.Value>
                  {coOwner.pessoa.email}
                </TableInformation.Value>
              </TableInformation.Column>
            </TableInformation.Row>
          </TableInformation.Section>
        ))}
      </TableInformation>

      <div className="flex items-center gap-4 mt-6">
        <input
          id="accept"
          type="checkbox"
          className="accent-[#21801A] size-5"
          {...register("accept")}
        />
        <label className="text-sm text-[#0A3503]" htmlFor="accept">
          Declaro, para todos os fins de direito, e sob penas de lei, que os
          dados informados e documentos apresentados são legítimos. E que
          autorizo o compartilhamento de meus dados para consultas públicas para
          analise socioambiental perante aos órgãos necessários.
        </label>
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          variant="green"
          className="w-[253px]"
          disabled={!acceptChecked}
          onClick={handleSubmitRequest}
        >
          Solicitar
        </Button>
      </div>
    </div>
  );
};
