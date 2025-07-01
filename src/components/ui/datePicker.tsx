"use client";

import React, { useState, useEffect } from "react";

interface DatePickerProps {
  defaultValue?: Date;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  id?: string;
  className?: string;
  label?: string;
}

function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function parseDate(str: string): Date | null {
  if (!str) return null;
  const [yyyy, mm, dd] = str.split("-");
  if (!yyyy || !mm || !dd) return null;
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

const DatePicker: React.FC<DatePickerProps> = ({
  defaultValue,
  value,
  onChange,
  id,
  className,
  label,
}) => {
  const [internalDate, setInternalDate] = useState<string>("");

  // Inicializa com a data atual se não houver valor controlado
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setInternalDate(formatDate(value));
    } else if (defaultValue) {
      setInternalDate(formatDate(defaultValue));
    } else {
      setInternalDate(formatDate(new Date()));
    }
  }, [defaultValue, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalDate(e.target.value);
    if (onChange) {
      onChange(parseDate(e.target.value));
    }
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block mb-1 font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type="date"
        id={id}
        value={internalDate}
        onChange={handleChange}
        className="border rounded px-3 py-2"
      />
    </div>
  );
};

export default DatePicker;
