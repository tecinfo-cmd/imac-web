import { InputHTMLAttributes, useState } from "react";
import { Controller } from "react-hook-form";
import { BiLogoMastercard } from "react-icons/bi";
import { HiMiniCreditCard } from "react-icons/hi2";
import { IoMdCalendar } from "react-icons/io";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  control: any;
  className?: string;
  mask?: (value: string) => string;
}

export const Input = ({
  name,
  label,
  placeholder,
  control,
  type = "text",
  mask,
  className = "",
  ...rest
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isDateInput = name === "validade" || name === "data";
  const isCardInput = name === "numeroCartao";
  const isCvvInput = name === "CVV";

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col">
          <div className="flex justify-between mx-1 my-1">
            {label && (
              <label
                htmlFor={name}
                className={`block font-medium ${
                  error ? "text-[#F12929]" : "text-[#21801A]"
                }`}
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
          <div className="relative w-full">
            <input
              {...field}
              value={mask ? mask(field.value ?? "") : field.value ?? ""}
              type={inputType}
              placeholder={placeholder}
              {...rest}
              className={`w-full h-[48px] p-4 rounded focus:outline-none border border-[#CAC4D0] shadow-[0px_1px_3px_rgba(0,0,0,0.3)] placeholder:text-[#D7D6D7] ${className}`}
            />

            {isDateInput && (
              <span className="absolute inset-y-0 right-2 flex items-center text-gray-300">
                <IoMdCalendar size={20} />
              </span>
            )}

            {isCardInput && (
              <span className="absolute inset-y-0 right-4 flex items-center text-gray-300">
                <BiLogoMastercard size={20} />
              </span>
            )}
            {isCvvInput && (
              <span className="absolute inset-y-0 right-4 flex items-center text-gray-300">
                <HiMiniCreditCard size={20} />
              </span>
            )}

            {isPassword && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-4 flex items-center text-gray-300 cursor-pointer ml-1"
              >
                {showPassword ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </button>
            )}
          </div>
        </div>
      )}
    />
  );
};
