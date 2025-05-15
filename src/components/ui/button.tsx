import React from "react";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "green" | "dark" | "danger";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, variant = "default", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const variantClasses = {
      default: "bg-[#52A532] hover:bg-[#469029]",
      green: "bg-[#21801A] hover:bg-[#186614]",
      dark: "bg-[#0A3503] hover:bg-[#062401]",
      danger: "bg-[#F44336] hover:bg-[#FF1D0D]",
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          "z-10 px-4 py-2 rounded flex items-center gap-2 justify-center font-semibold transition text-white disabled:bg-[#A3E7B8] disabled:cursor-not-allowed",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
