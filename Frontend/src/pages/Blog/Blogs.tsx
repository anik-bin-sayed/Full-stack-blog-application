import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiCalendar,
  FiUser,
  FiArrowRight,
  FiX,
  FiFilter,
} from "react-icons/fi";

import {
  useGetBlogsQuery,
  useGetCategoriesQuery,
} from "../../features/blogs/blogApi";
import { getImageUrl } from "../../helper";

const Blogs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "All">(
    "All",
  );
  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // CATEGORY API
  // =========================
  const { data: categoryData } = useGetCategoriesQuery();
  const categories = categoryData || [];

  // =========================
  // BLOGS API
  // =========================
  const { data, isLoading } = useGetBlogsQuery({
    page: currentPage,
    search: searchTerm,
    category: selectedCategory !== "All" ? String(selectedCategory) : "",
  });

  const allPosts = data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / 8);

  // =========================
  // URL SYNC (on load)
  // =========================
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const pageParam = searchParams.get("page");

    if (categoryParam) setSelectedCategory(Number(categoryParam));
    if (searchParam) setSearchTerm(searchParam);
    if (pageParam) setCurrentPage(Number(pageParam));
  }, []);

  // =========================
  // URL UPDATE
  // =========================
  useEffect(() => {
    const params: any = {};

    if (selectedCategory !== "All") params.category = String(selectedCategory);
    if (searchTerm) params.search = searchTerm;
    if (currentPage > 1) params.page = String(currentPage);

    setSearchParams(params);
  }, [selectedCategory, searchTerm, currentPage]);

  // =========================
  // HANDLERS
  // =========================
  const handleCategoryChange = (id: number | "All") => {
    setSelectedCategory(id);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setCurrentPage(1);
  };

  // =========================
  // LOADING
  // =========================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* HERO HEADER */}
      <div className="relative bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold italic mb-4 tracking-tight">
            All Blogs
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Explore articles, tutorials & insights from our community
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR - improved styling */}
          <aside className="lg:w-80 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                <FiSearch className="text-indigo-500" /> Search
              </h3>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                    placeholder="Search blogs..."
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                  >
                    <FiSearch />
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                <FiFilter className="text-indigo-500" /> Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange("All")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === "All"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {categories.map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {(searchTerm || selectedCategory !== "All") && (
              <button
                onClick={clearFilters}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <FiX /> Clear Filters
              </button>
            )}
          </aside>

          {/* BLOG LIST - 3 COLUMN GRID ON LG */}
          <div className="flex-1">
            {allPosts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg">No blogs found.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-indigo-600 hover:text-indigo-800"
                >
                  Clear filters and try again
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {allPosts.map((post: any) => {
                    const thumbnailImage = getImageUrl(post.image);
                    return (
                      <article
                        key={post.id}
                        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                      >
                        <Link
                          to={`/blog/details/${post.slug}`}
                          className="block overflow-hidden"
                        >
                          <img
                            src={thumbnailImage}
                            alt={post.title}
                            className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        <div className="p-5 flex flex-col flex-grow">
                          <Link to={`/blog/details/${post.slug}`}>
                            <h2 className="font-bold text-xl text-gray-800 line-clamp-2 hover:text-indigo-600 transition">
                              {post.title}
                            </h2>
                            <p className="text-gray-500 text-sm mt-3 line-clamp-3">
                              {post.excerpt ||
                                post.content?.slice(0, 100) + "..."}
                            </p>
                          </Link>

                          <div className="flex items-center justify-between mt-4 text-xs text-gray-500 border-t pt-3">
                            <span className="flex items-center gap-1">
                              <FiUser className="text-indigo-400" />{" "}
                              {post.author?.username || "Anonymous"}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiCalendar className="text-indigo-400" />{" "}
                              {new Date(post.created_at).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>

                          <Link
                            to={`/blog/details/${post.slug}`}
                            className="mt-4 text-indigo-600 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                          >
                            Read more <FiArrowRight className="text-sm" />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* PAGINATION - modern style */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <nav className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                        }`}
                      >
                        Previous
                      </button>

                      {Array.from({ length: Math.min(totalPages, 5) })
                        .map((_, idx) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = idx + 1;
                          } else {
                            const current = currentPage;
                            if (idx === 0) pageNum = 1;
                            else if (idx === 1)
                              pageNum = Math.max(2, current - 1);
                            else if (idx === 2) pageNum = current;
                            else if (idx === 3)
                              pageNum = Math.min(totalPages - 1, current + 1);
                            else pageNum = totalPages;
                          }
                          // avoid duplicates
                          if (pageNum < 1 || pageNum > totalPages) return null;
                          if (
                            pageNum ===
                            (idx === 0
                              ? 1
                              : idx === 1
                                ? Math.max(2, current - 1)
                                : idx === 2
                                  ? current
                                  : idx === 3
                                    ? Math.min(totalPages - 1, current + 1)
                                    : totalPages)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-10 h-10 rounded-xl text-sm font-medium transition ${
                                  currentPage === pageNum
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-white text-gray-700 hover:bg-indigo-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          return null;
                        })
                        .filter(Boolean)}

                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
