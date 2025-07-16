import { cn } from "@/lib/utils";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

const TableContainer = ({ children, className }: TableProps) => {
  return (
    <div className={cn("overflow-x-auto pt-4", className)}>
      <table className="min-w-full table-auto border-separate border-spacing-0">
        {children}
      </table>
    </div>
  );
};

interface TableHeaderProps extends TableProps {
  noBackground?: boolean;
}

const TableHeader = ({
  children,
  className,
  noBackground = false,
}: TableHeaderProps) => {
  return (
    <thead className={cn(className)}>
      <tr className={`${!noBackground ? "bg-[#DFEEE5]" : ""}`}>{children}</tr>
    </thead>
  );
};

const TableRow = ({ children, className }: TableProps) => {
  return <tr className={cn(className)}>{children}</tr>;
};

const TableBody = ({ children, className }: TableProps) => {
  return <tbody className={cn(className)}>{children}</tbody>;
};

const TableCell = ({ children, className }: TableProps) => {
  return (
    <td
      className={cn(
        "text-[#21801A] px-4 py-2 text-left border-b border-[#DFEEE5]",
        className
      )}
    >
      {children}
    </td>
  );
};

const TableTitle = ({ children, className }: TableProps) => {
  return (
    <th className={cn("text-[#21801A] px-4 py-2 text-left", className)}>
      {children}
    </th>
  );
};

export const Table = {
  Container: TableContainer,
  Header: TableHeader,
  Row: TableRow,
  Body: TableBody,
  Cell: TableCell,
  Title: TableTitle,
};
