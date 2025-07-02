import React, { useRef, useEffect } from "react";

import { cn } from "@/lib/utils";
import IMask from "imask";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
  label: string;
  error?: string;
}

const MaskedInput: React.FC<MaskedInputProps> = ({ mask, error, label, ...props }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    if (inputRef.current) {
      IMask(inputRef.current, { mask });
    }
  }, [mask]);

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        ref={inputRef}
        {...props}
        className={cn(
          "w-full px-4 py-2 border rounded-lg focus:outline-none",
          "border-[#CAC4D0] bg-white text-gray-900",
           error
            ? "border-red-500 focus:ring-0 focus:border-red-500"
            : " border-[#CAC4D0]",
          props.className
        )}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default MaskedInput;
