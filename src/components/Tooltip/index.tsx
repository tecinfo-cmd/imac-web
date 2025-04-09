import { useEffect, useState } from "react";

import { useTooltipStore } from "@/store/useTooltipStore";

interface TooltipProps {
  children: React.ReactNode;
  message: string;
  id: string;
}

export const Tooltip = ({ children, message, id }: TooltipProps) => {
  const { visibleTooltip, showTooltip, hideTooltip } = useTooltipStore();
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(-5);

  useEffect(() => {
    if (visibleTooltip === id) {
      setOpacity(1);
      setTranslateY(0);
    } else {
      setOpacity(0);
      setTranslateY(-5);
    }
  }, [visibleTooltip, id]);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => showTooltip(id)}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visibleTooltip === id && (
        <div
          style={{
            opacity,
            transform: `translateY(${translateY}px)`,
            transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
            whiteSpace: "nowrap",
          }}
          className="absolute left-1/2 transform -translate-x-1/2 -top-10 p-2 bg-white border border-[#CAC4D0] rounded-lg rounded-bl-none shadow-md"
        >
          <p className="font-light text-xs">{message}</p>
        </div>
      )}
    </div>
  );
};
