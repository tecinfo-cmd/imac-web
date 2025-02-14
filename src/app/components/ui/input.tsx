import * as React from "react";

import { cn } from "@/lib/utils";

interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-2">
        <label htmlFor={props.id} className="text-sm font-medium text-gray-700">
          {label}
        </label>

        <input
          ref={ref}
          id={props.id}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none",
            "border-[#666666] dark:border-[#666666] bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
