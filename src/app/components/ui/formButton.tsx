import React from "react";

interface ButtonProps {
  variant?: "outline" | "solid";

  onClick: () => void;
  children: React.ReactNode;
}

export const FormButton: React.FC<ButtonProps> = ({
  variant = "solid",
  onClick,
  children,
}) => {
  return (
    <button
      className={`${
        variant === "outline"
          ? "border border-gray-500"
          : "bg-blue-500 text-white"
      } px-4 py-2 rounded-lg`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
