interface TableProps {
  children: React.ReactNode;
}

const TableContainer = ({ children }: TableProps) => {
  return (
    <div className="overflow-x-auto pt-4">
      <table className="min-w-full table-auto border-separate border-spacing-0">
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children }: TableProps) => {
  return (
    <thead>
      <tr className="bg-[#DFEEE5]">{children}</tr>
    </thead>
  );
};

const TableRow = ({ children }: TableProps) => {
  return <tr>{children}</tr>;
};

const TableBody = ({ children }: TableProps) => {
  return <tbody>{children}</tbody>;
};

const TableCell = ({ children }: TableProps) => {
  return (
    <td className="text-[#21801A] px-4 py-2 text-left border-b border-[#DFEEE5]">
      {children}
    </td>
  );
};

const TableTitle = ({ children }: TableProps) => {
  return <th className="text-[#21801A] px-4 py-2 text-left">{children}</th>;
};

export const Table = {
  Container: TableContainer,
  Header: TableHeader,
  Row: TableRow,
  Body: TableBody,
  Cell: TableCell,
  Title: TableTitle,
};
