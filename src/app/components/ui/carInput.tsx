import { useRef, useEffect } from "react";

import { Input } from "@/app/components/ui/input";

import { cn } from "@/lib/utils";
import IMask from "imask";

interface CARInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CARInput = ({ value, onChange }: CARInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const maskOptions = {
        mask: "AA-0000000-****************",
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
        Número do CAR*
      </label>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="UF-0000000-00000000000000000"
        className={cn(
          "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none",
          "border-[#666666] dark:border-[#666666] bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        )}
        label={""}
      />
    </div>
  );
};

export default CARInput;
