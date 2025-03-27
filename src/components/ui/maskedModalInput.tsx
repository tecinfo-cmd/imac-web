/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

import { cn } from "@/lib/utils";
import IMask, { InputMask } from "imask";

interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  documentType?: "cpf" | "cnpj" | "carEstadual";
}

export const MaskedModalInput = React.forwardRef<
  HTMLInputElement,
  InputWithLabelProps
>(({ label, className, error, documentType, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const maskInstanceRef = React.useRef<InputMask<any> | null>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      if (maskInstanceRef.current) {
        maskInstanceRef.current.destroy();
      }

      const maskOptions = {
        cpf: {
          mask: "000.000.000-00",
        },
        cnpj: {
          mask: "00.000.000/0000-00",
        },
        carEstadual: {
          mask: "AA00000/0000",
          definitions: {
            A: /[A-Z]/,
            0: /\d/,
          },
          prepare: (str: string) => str.toUpperCase(),
        },
      };

      if (documentType && maskOptions[documentType]) {
        maskInstanceRef.current = IMask(
          inputRef.current,
          maskOptions[documentType]
        );
      }
    }

    return () => {
      maskInstanceRef.current?.destroy();
    };
  }, [documentType]);

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={props.id} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        ref={(el) => {
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
          inputRef.current = el;
        }}
        id={props.id}
        className={cn(
          "border border-[#222222] focus:outline-none placeholder-[#A2A2A2] bg-white",
          " bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
          error
            ? "border-red-500 focus:ring-0 focus:border-red-500"
            : "border-gray-400 focus:ring-2 focus:ring-green-500",
          className
        )}
        {...props}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});

MaskedModalInput.displayName = "MaskedModalInput";
