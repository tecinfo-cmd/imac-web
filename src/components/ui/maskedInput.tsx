import React, { useRef, useEffect } from "react";

import { cn } from "@/lib/utils";
import IMask from "imask";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
  label: string;
  error?: string;
}

const MaskedInput: React.FC<MaskedInputProps> = ({
  mask,
  label,
  error,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const maskRef = useRef<InstanceType<typeof IMask.InputMask> | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      maskRef.current = IMask(inputRef.current, { mask });

      return () => {
        maskRef.current?.destroy();
      };
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
          "border-[#666666] dark:border-[#666666] bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
          error
            ? "border-red-500 focus:ring-0 focus:border-red-500"
            : "border-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500", 
          props.className
        )}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default MaskedInput;

