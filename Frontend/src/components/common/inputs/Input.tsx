import React from "react";
import type { InputProps } from "../../../types/InputPropsType";

const Input: React.FC<InputProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  label,
  required = false,
  type = "text",
  placeholder,
  autoComplete,
  className = "",
  ...rest
}) => {
  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${className}`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
