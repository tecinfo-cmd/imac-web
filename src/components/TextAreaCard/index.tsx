import React from "react";
import { Controller } from "react-hook-form";

interface TextAreaCardProps {
  name: string;
  control: any;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
}

export const TextAreaCard = ({
  name,
  control,
  title,
  subtitle,
  placeholder = "Digite aqui...",
  rows = 5,
  className = "",
  disabled = false,
}: TextAreaCardProps) => {
  return (
    <div>
      {title && (
        <div className="bg-[#4A4A4A] text-white px-4 py-2 font-semibold flex justify-between items-center ">
          {title}
          {className}
        </div>
      )}
      <div className="bg-[#EBE3F3] text-[#21801A] font-semibold px-4 py-2 !m-0 text-sm">
        {subtitle}
      </div>

      <div className="p-4">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full border border-[#CAC4D0] rounded p-3 shadow resize-none focus:outline-none ${className}  ${
                disabled
                  ? "bg-gray-100 cursor-not-allowed text-gray-700"
                  : "bg-white"
              } `}
            />
          )}
        />
      </div>
    </div>
  );
};
