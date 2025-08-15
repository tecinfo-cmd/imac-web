type InfoItem = {
  label: string;
  value: string | number | null | undefined;
};

type InfoGridProps = {
  data: InfoItem[];
  columns?: number;
  rows: InfoItem[][];
};

export const InfoGrid: React.FC<InfoGridProps> = ({ rows }) => {
  return (
    <div className="bg-white border border-[#CAC4D0] rounded-lg p-4 mb-6">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${
            rowIndex !== rows.length - 1 ? "mb-2" : ""
          }`}
        >
          {row.map((item, colIndex) => (
            <div key={colIndex}>
              <span className="text-sm sm:text-base font-semibold">
                {item.label}
              </span>
              <p className="text-xs sm:text-sm">
                {item.value || "-"}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};