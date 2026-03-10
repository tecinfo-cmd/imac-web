import * as React from "react";
import { FaCheck } from "react-icons/fa";

import { cn } from "@/lib/utils";
import * as Checkbox from "@radix-ui/react-checkbox";

export const CheckboxComponent = React.forwardRef<
  React.ElementRef<typeof Checkbox.Root>,
  React.ComponentProps<typeof Checkbox.Root> & {
    error?: string;
  }
>(({ className, children, onCheckedChange, error, ...props }, ref) => {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        <Checkbox.Root
          ref={ref}
          className={cn(
            "w-5 h-5 flex items-center justify-center border border-[#CAC4D0] bg-white",
            "focus:outline-none focus:ring-2 focus:ring-green-500",
            "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600",
            error
              ? "border-red-500 focus:ring-0 focus:border-red-500"
              : "border-[#CAC4D0] focus:ring-2 focus:ring-green-500",
            className
          )}
          onCheckedChange={onCheckedChange}
          {...props}
        >
          <Checkbox.Indicator className="text-white">
            <FaCheck className="w-4 h-4" />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span
          className={`text-sm ${error ? "text-red-500" : "text-[#666666]"}`}
        >
          {children}
        </span>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});

CheckboxComponent.displayName = "CheckboxComponent";

export { Checkbox };
