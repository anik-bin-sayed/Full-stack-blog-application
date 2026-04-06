import React from "react";
import type { SubmitButtonProps } from "../types/ButtonPropsTypes";

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading = false,
  loadingText = "Please wait...",
  text,
  onClick,
  type = "submit",
  disabled = false,
  className = "",
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-full bg-gradient-to-r from-indigo-600 to-purple-600 
        text-white font-bold py-3 px-4 rounded-lg 
        hover:from-indigo-700 hover:to-purple-700 
        focus:outline-none focus:ring-4 focus:ring-indigo-300 
        transition-all duration-200 transform hover:scale-[1.02] 
        shadow-md disabled:opacity-60 disabled:cursor-not-allowed 
        disabled:hover:scale-100 flex items-center justify-center gap-2
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default SubmitButton;
