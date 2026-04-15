import React, { useState } from "react";
import type { PasswordInputProps } from "../../../types/InputPropsType";
import { RxEyeOpen } from "react-icons/rx";
import { VscEyeClosed } from "react-icons/vsc";

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder = "••••••••",
  label,
  required = false,
  autoComplete = "new-password",
  showStrength = false,
  strength,
  strengthScore = 0,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getStrengthStyle = () => {
    if (!strength || value.length === 0)
      return { width: "0%", color: "bg-gray-200" };
    switch (strength) {
      case "Weak":
        return { width: "25%", color: "bg-red-500" };
      case "Fair":
        return { width: "50%", color: "bg-orange-500" };
      case "Good":
        return { width: "75%", color: "bg-yellow-500" };
      case "Strong":
        return { width: "100%", color: "bg-green-500" };
      default:
        return { width: "0%", color: "bg-gray-200" };
    }
  };

  const strengthStyle = getStrengthStyle();

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
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 rounded-lg border ${
            error ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 pr-10`}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600 focus:outline-none"
        >
          {showPassword ? <RxEyeOpen /> : <VscEyeClosed />}
        </button>
      </div>

      {/* Password Strength Meter (optional) */}
      {showStrength && value && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strengthStyle.color}`}
              style={{ width: strengthStyle.width }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-600">Strength:</span>
            <span
              className={`text-xs font-semibold ${
                strength === "Strong"
                  ? "text-green-600"
                  : strength === "Good"
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {strength || "Weak"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use 8+ chars, upper & lower case, number & symbol
          </p>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PasswordInput;
