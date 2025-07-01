import dynamic from "next/dynamic";
import { JSX } from "react";
import { Controller } from "react-hook-form";
import { RiArrowDownSFill } from "react-icons/ri";

const DynamicSelect = dynamic(() => import("react-select"), { ssr: false });

interface InputSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  control: any;
  options:
    | { value: string | number; label: string; color?: string }[]
    | undefined;
  isSearchable?: boolean;
  formatOptionLabel?: (option: any) => JSX.Element;
}

export const InputSelect = ({
  name,
  label,
  placeholder,
  control,
  options,
  isSearchable = true,
  ...rest
}: InputSelectProps) => {
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
          <div className="relative w-full">
            <DynamicSelect
              {...field}
              onChange={(selectedOption: any) =>
                field.onChange(selectedOption?.value)
              }
              value={
                options?.find((option) => option.value === field.value) || null
              }
              options={options}
              isSearchable={isSearchable}
              placeholder={placeholder}
              {...rest}
              classNamePrefix="custom-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  height: "48px",
                  borderColor: "#CAC4D0",
                  boxShadow: state.isFocused
                    ? "0px 1px 3px rgba(0, 0, 0, 0.3)"
                    : "0px 1px 3px rgba(0, 0, 0, 0.3)",
                  borderRadius: "0.25rem",
                  fontSize: "1rem",
                  outline: "none",
                  borderWidth: "1px",
                  "&:hover": {
                    borderColor: "#CAC4D0",
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.3)",
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#D7D6D7",
                }),
                indicatorSeparator: (base) => ({
                  ...base,
                  display: "none",
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: "0.25rem",
                  borderColor: "#CAC4D0",
                }),
                menuList: (base) => ({
                  ...base,
                  padding: 0,
                  borderRadius: "0.25rem",
                  backgroundColor: "#FFFFFF",
                }),
                option: (base, { isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? "#21801A" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#333333",
                  padding: "10px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#DFEEE5",
                    color: "#333333",
                  },
                }),
              }}
              components={{
                DropdownIndicator: () => (
                  <RiArrowDownSFill
                    size={24}
                    color="#CAC4D0"
                    className="m-2 cursor-pointer"
                  />
                ),
              }}
            />
          </div>
        </div>
      )}
    />
  );
};
