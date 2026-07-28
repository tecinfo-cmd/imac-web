export type LegendaItem = {
  cor: string;
  titulo: string;
  descricao: string;
};

type LegendaProps = {
  itens?: LegendaItem[];
  titulo?: string;
  className?: string;
};

const itensPadrao: LegendaItem[] = [
  {
    cor: "#2E7D32",
    titulo: "Contestação favorável",
    descricao: "área cuja justificativa foi aceita.",
  },
  {
    cor: "#F57C00",
    titulo: "Contestação não favorável",
    descricao: "área cuja justificativa não foi aceita.",
  },
  {
    cor: "#C62828",
    titulo: "Área a regenerar",
    descricao: "área com obrigação de recuperação ambiental.",
  },
  {
    cor: "#FFFF00",
    titulo: "Perímetro do imóvel",
    descricao: "limite do território da propriedade.",
  },
];

export const Legenda = ({
  itens = itensPadrao,
  titulo = "Legenda",
  className = "",
}: LegendaProps) => {
  return (
    <section
      className={`w-full rounded-md bg-white p-4 ${className}`.trim()}
      aria-label={titulo}
    >
      <h2 className="mb-3 text-xl font-medium text-[#1A6415]">{titulo}</h2>

      <ul className="flex flex-wrap gap-x-6 gap-y-3">
        {itens.map((item) => (
          <li
            key={`${item.titulo}-${item.cor},`}
            className="flex min-w-64 flex-1 items-start gap-3"
          >
            <span
              className="mt-0.5 h-7 w-7 shrink-0 rounded border-[3px] bg-white"
              style={{ borderColor: item.cor,
                 backgroundColor: `${item.cor}40`,
               }}
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-gray-700">
              <strong className="font-semibold text-gray-900">
                {item.titulo}:
              </strong>{" "}
              {item.descricao}
              <span className="whitespace-nowrap"> </span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};
