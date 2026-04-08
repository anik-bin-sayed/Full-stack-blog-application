import React from "react";
import { Link } from "react-router-dom";

type EmptyStateProps = {
  hasFilters: string | number | undefined;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setDebouncedSearch: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  setSearchTerm,
  setDebouncedSearch,
  setSelectedCategory,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Drafts Found</h3>
      <p className="text-gray-500 max-w-md mb-6">
        {hasFilters
          ? "Try adjusting your search or filter to find what you're looking for."
          : "Your creative ideas are waiting! Start writing your first draft today."}
      </p>

      {hasFilters ? (
        <button
          onClick={() => {
            setSearchTerm("");
            setDebouncedSearch("");
            setSelectedCategory(undefined);
          }}
          className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition"
        >
          Clear Filters
        </button>
      ) : (
        <Link
          to="/blogs/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Blog
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
