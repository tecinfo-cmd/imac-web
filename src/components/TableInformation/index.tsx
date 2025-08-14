import { ReactNode, useState } from "react";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";

interface TableInformationProps {
  children: ReactNode;
}

export function TableInformation({ children }: TableInformationProps) {
  return <div>{children}</div>;
}

interface SectionProps {
  title: string;
  children: ReactNode;
  showArrow?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
}

TableInformation.Section = function Section({
  title,
  children,
  showArrow = false,
  defaultOpen = true,
  disabled = false,
}: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  const handleClick = () => {
    if (!disabled && showArrow) {
      setOpen(!open);
    }
  };

  return (
    <div className="mb-6">
      <div
        className={`font-semibold px-4 py-2 flex items-center justify-between ${
          disabled
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-[#21801A] text-[#D7EADD] cursor-pointer"
        }`}
        onClick={handleClick}
      >
        <span>{title}</span>
        {showArrow && (
          <span>
            {open ? (
              <RiArrowUpSFill size={18} />
            ) : (
              <RiArrowDownSFill size={18} />
            )}
          </span>
        )}
      </div>
      {open && <div>{children}</div>}
    </div>
  );
};

interface RowProps {
  children: ReactNode;
  columnsPerRow?: number;
}

TableInformation.Row = function Row({ children, columnsPerRow = 4 }: RowProps) {
  const gridColsClass =
    columnsPerRow === 1
      ? "md:grid-cols-1"
      : columnsPerRow === 2
      ? "md:grid-cols-2"
      : columnsPerRow === 3
      ? "md:grid-cols-3"
      : columnsPerRow === 4
      ? "md:grid-cols-4"
      : "md:grid-cols-1";

  return <div className={`grid grid-cols-1 ${gridColsClass}`}>{children}</div>;
};

interface ColumnProps {
  children: ReactNode;
}

TableInformation.Column = function Column({ children }: ColumnProps) {
  return <div className="flex flex-col">{children}</div>;
};

interface TextProps {
  children: ReactNode;
}

TableInformation.Title = function Title({ children }: TextProps) {
  return (
    <div className="bg-[#D7EADD] text-[#0A3503] font-semibold px-3 py-2">
      {children}
    </div>
  );
};

TableInformation.Value = function Value({ children }: TextProps) {
  const content =
    children == null || children === "" ? "Não informado" : children;
  return <div className="bg-white text-[#0A3503] px-3 py-2">{content}</div>;
};
