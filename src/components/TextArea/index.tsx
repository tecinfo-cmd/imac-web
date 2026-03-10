import { TextareaHTMLAttributes } from "react";
import { Controller } from "react-hook-form";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  control: any;
  className?: string;
}

export const TextArea = ({
  name,
  label,
  placeholder,
  control,
  className = "",
  ...rest
}: TextAreaProps) => {
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
          <textarea
            {...field}
            placeholder={placeholder}
            {...rest}
            className={`w-full min-h-[130px] p-4 rounded focus:outline-none border border-[#CAC4D0] shadow-[0px_1px_3px_rgba(0,0,0,0.3)] placeholder:text-[#D7D6D7] resize-none ${className}`}
          />
        </div>
      )}
    />
  );
};
