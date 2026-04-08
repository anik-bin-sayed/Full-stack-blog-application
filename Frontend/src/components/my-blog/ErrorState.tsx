import React from "react";

type ErrorStateProps = {
  error: any;
  refetch: () => void;
};

const ErrorState = ({ error, refetch }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Failed to Load Drafts
      </h3>
      <p className="text-gray-500 mb-6 max-w-md">
        {(error as any)?.message || "Something went wrong. Please try again."}
      </p>
      <button
        onClick={() => refetch()}
        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-sm"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
