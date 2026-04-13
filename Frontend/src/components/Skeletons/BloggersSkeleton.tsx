import React from "react";

const BloggersSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse border border-gray-100">
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200" />
      <div className="p-5">
        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
        <div className="flex justify-center gap-3 mb-4">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-9 bg-gray-200 rounded-xl w-full" />
      </div>
    </div>
  );
};

export default BloggersSkeleton;
