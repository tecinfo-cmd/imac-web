import React, { MouseEvent } from "react";
import { Controller } from "react-hook-form";
import { FaCheck } from "react-icons/fa";

import { cn } from "@/lib/utils";

interface RadioProps {
  name: string;
  label?: string;
  value: string;
  control: any;
  className?: string;
  disabled?: boolean;
}

export const Radio = ({
  name,
  label,
  value,
  control,
  className = "",
}: RadioProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const isSelected = field.value === value;

        const onLabelClick = (e: MouseEvent<HTMLLabelElement>) => {
          e.preventDefault();

          if (isSelected) {
            field.onChange(null);
          } else {
            field.onChange(value);
          }
        };

        const onInputClick = (e: MouseEvent<HTMLInputElement>) => {
          e.stopPropagation();
        };

        return (
          <div className="flex flex-col">
            <label
              htmlFor={`${name}-${value}`}
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={onLabelClick}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  onLabelClick(e as any);
                }
              }}
            >
              <div
                className={cn(
                  "relative w-5 h-5 flex items-center justify-center border rounded-sm",
                  isSelected
                    ? "border-green-600 bg-green-600"
                    : "border-[#CAC4D0] bg-white",
                  "focus:outline-none focus:ring-2 focus:ring-green-500",
                  error && "border-red-500 focus:ring-0",
                  className
                )}
              >
                {isSelected && (
                  <FaCheck className="text-white w-4 h-4" />
                )}
              </div>

              {label && (
                <span
                  className={`text-sm ${
                    error ? "text-red-500" : "text-[#21801A]"
                  }`}
                >
                  {label}
                </span>
              )}
            </label>

            <input
              id={`${name}-${value}`}
              type="radio"
              {...field}
              value={value}
              checked={isSelected}
              onChange={() => {}}
              onClick={onInputClick}
              className="hidden"
            />

            {error && (
              <p className="text-red-500 text-xs mt-1 ml-1">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};