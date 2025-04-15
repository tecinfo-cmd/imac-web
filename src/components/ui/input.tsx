import * as React from "react";

import { cn } from "@/lib/utils";

interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ label, className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-2">
        <label htmlFor={props.id} className="text-sm font-medium text-gray-700">
          {label}
        </label>

        <input
          ref={ref}
          id={props.id}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:outline-none",
            "border-[#666666] bg-white text-gray-900",
            error
              ? "border-red-500 focus:ring-0 focus:border-red-500"
              : "border-gray-400 focus:ring-0 focus:ring-green-500",
            className
          )}
          {...props}
        />

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";