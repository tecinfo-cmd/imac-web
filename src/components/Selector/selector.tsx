"use client";

import { useState, useRef, useEffect } from "react";
import { Controller } from "react-hook-form";
import { FaSortDown } from "react-icons/fa";

import { cn } from "@/lib/utils";

interface RegisterSelectProps {
  name: string;
  label?: string;
  placeholder: string;
  control: any;
  options: { value: string; label: string }[];
  isLoading?: boolean;
}

const Selector: React.FC<RegisterSelectProps> = ({
  name,
  label,
  placeholder,
  control,
  options,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [dropUp, setDropUp] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    setIsOpen(true);

    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setDropUp(spaceBelow < 200 && spaceAbove > spaceBelow);
    }
  };

  const isSelectorInput =
    name === "pais" ||
    name === "cidade" ||
    name === "bairro" ||
    name === "select";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="relative w-full flex flex-col gap-3" ref={inputRef}>
          <div className="flex justify-between mx-1">
            {label && (
              <label
                htmlFor={name}
                className="block font-medium text-[#21801A]"
              >
                {label}
              </label>
            )}
            {error && (
              <div className="p-2 bg-white border border-[#CAC4D0] rounded-lg rounded-bl-none">
                <p className="text-[#F12929] font-light text-xs">
                  {error.message}
                </p>
              </div>
            )}
          </div>

          <input
            id={name}
            type="text"
            value={
              selectedValue
                ? options.find((o) => o.value === selectedValue)?.label
                : searchTerm
            }
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={handleFocus}
            placeholder={isLoading ? "Carregando..." : placeholder}
            className={cn(
              "w-full min-w-[130px] h-[55px] p-4 rounded focus:outline-none text-black border-[#CAC4D0] shadow-sm placeholder:text-[#D7D6D7] cursor-pointer",
              error ? "border-[#F12929]" : ""
            )}
            readOnly={isLoading}
          />

          {isOpen && (
            <div
              className={cn(
                "absolute z-10 w-full bg-white border border-[#CAC4D0] rounded-md shadow-md max-h-48 overflow-y-auto",
                dropUp ? "bottom-full mb-2" : "top-full mt-2"
              )}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className="p-3 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      field.onChange(option.value);
                      setSelectedValue(option.value);
                      setSearchTerm("");
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <p className="p-3 text-gray-500">Nenhuma opção encontrada</p>
              )}
            </div>
          )}

          {isSelectorInput && (
            <span className="absolute inset-y-0 mt-8 right-4 flex items-center text-gray-300">
              <FaSortDown size={20} />
            </span>
          )}
        </div>
      )}
    />
  );
};

export default Selector;
