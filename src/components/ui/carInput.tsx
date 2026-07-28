import { useRef, useEffect } from "react";

import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import IMask from "imask";

interface CARInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  setError: (error: string | null) => void;
  inputClassName: string;
}

const CARInput = ({ value, onChange, error }: CARInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const maskOptions = {
        mask: `AA-0000000-${"*".repeat(32)}`,
        definitions: {
          A: /[A-Z]/,
          "*": /[A-Z0-9]/,
        },
        prepare: (str: string) => str.toUpperCase(),
      };

      const mask = IMask(inputRef.current, maskOptions);

      mask.on("accept", () => {
        if (mask.value !== value) {
          onChange(mask.value);
        }
      });

      return () => mask.destroy();
    }
  }, [onChange, value]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Número do CAR federal*
      </label>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="UF-0000000-00000000000000000"
        className={cn(
          "w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-[#CAC4D0]",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-0 focus:outline-none"
            : "border-[#CAC4D0]"
        )}
        label={""}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CARInput;
