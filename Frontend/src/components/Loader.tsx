import React, { memo } from "react";

interface LoaderProps {
  message?: string;
}

const Loader = memo(({ message = "Loading..." }: LoaderProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white backdrop-blur-sm">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>

      {/* Pulsing Dots */}
      <div className="flex space-x-2 mt-6">
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
      </div>

      {/* Message */}
      <p className="mt-4 text-gray-600 text-sm font-medium tracking-wide">
        {message}
      </p>
    </div>
  );
});

Loader.displayName = "Loader";

export default Loader;
