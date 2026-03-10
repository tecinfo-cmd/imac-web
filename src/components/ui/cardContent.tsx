import * as React from "react";

import { cn } from "@/lib/utils";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-2", className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";
