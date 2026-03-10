import { TechnicalResponsible } from "@/hooks/useEnvironmentalAnalysis/useGetTechnicalResponsible";

interface TechnicalResponsibleDisplayProps {
  technicalResponsible: TechnicalResponsible;
}

export const TechnicalResponsibleDisplay = ({
  technicalResponsible,
}: TechnicalResponsibleDisplayProps) => {
  return (
    <div className="p-4">
      <h2 className="text-[#21801A] text-xl font-bold mb-6">
        Informações do Responsável Técnico
      </h2>

      <div className="grid grid-cols-3 gap-8 p-4">
        <div>
          <h2 className="text-[#21801A]">Nome</h2>
          <p>{technicalResponsible.nome}</p>
        </div>
        <div>
          <h2 className="text-[#21801A]">CPF</h2>
          <p>{technicalResponsible.cpf}</p>
        </div>
        <div>
          <h2 className="text-[#21801A]">Profissão</h2>
          <p>{technicalResponsible.profissao}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 p-4">
        <div>
          <h2 className="text-[#21801A]">Registro CREA</h2>
          <p>{technicalResponsible.registroCrea}</p>
        </div>
        <div>
          <h2 className="text-[#21801A]">Telefone</h2>
          <p>{technicalResponsible.telefone}</p>
        </div>
        <div>
          <h2 className="text-[#21801A]">E-mail</h2>
          <p>{technicalResponsible.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8 p-4 mt-6">
        <div>
          <h2 className="text-[#21801A]">CEP</h2>
          <p>{technicalResponsible.endereco.cep}</p>
        </div>
        <div>
          <h2 className="text-[#21801A]">Logradouro</h2>
          <p>{technicalResponsible.endereco.logradouro}</p>
        </div>
        <div>
          <h2 className="text-[#21801A]">Complemento</h2>
          <p>{technicalResponsible.endereco.complemento || "—"}</p>
        </div>
        <div>
          <h2 className="text-[#21801A]">Município</h2>
          <p>{technicalResponsible.endereco.municipio}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 p-4">
        <div>
          <h2 className="text-[#21801A]">Estado</h2>
          <p>{technicalResponsible.endereco.estado}</p>
        </div>
      </div>
    </div>
  );
};
