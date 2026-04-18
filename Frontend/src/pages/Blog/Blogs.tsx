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
import Loader from "../../components/Loader";

const Blogs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "All">(
    "All",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { data: categoryData } = useGetCategoriesQuery();
  const categories = categoryData || [];

  const { data, isLoading } = useGetBlogsQuery({
    page: currentPage,
    search: searchTerm,
    category: selectedCategory !== "All" ? String(selectedCategory) : "",
  });

  const allPosts = data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / 9);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const pageParam = searchParams.get("page");

    if (categoryParam) setSelectedCategory(Number(categoryParam));
    if (searchParam) setSearchTerm(searchParam);
    if (pageParam) setCurrentPage(Number(pageParam));
  }, []);

  useEffect(() => {
    const params: any = {};

    if (selectedCategory !== "All") params.category = String(selectedCategory);
    if (searchTerm) params.search = searchTerm;
    if (currentPage > 1) params.page = String(currentPage);

    setSearchParams(params);
  }, [selectedCategory, searchTerm, currentPage]);

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

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* HERO HEADER - cleaner gradient */}
      <div className="relative bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700 text-white py-16 px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            All Blogs
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            Explore articles, tutorials & insights from our community
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR - improved styling */}
          <aside className="lg:w-72 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="flex items-center gap-2 text-md font-semibold text-gray-800 mb-3">
                <FiSearch className="text-indigo-500" size={18} /> Search
              </h3>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg py-2 pl-4 pr-10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                    placeholder="Search blogs..."
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                  >
                    <FiSearch size={16} />
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="flex items-center gap-2 text-md font-semibold text-gray-800 mb-3">
                <FiFilter className="text-indigo-500" size={18} /> Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange("All")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    selectedCategory === "All"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {categories.map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      selectedCategory === cat.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {(searchTerm || selectedCategory !== "All") && (
              <button
                onClick={clearFilters}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-lg transition flex items-center justify-center gap-1 text-sm cursor-pointer"
              >
                <FiX size={14} /> Clear Filters
              </button>
            )}
          </aside>

          <div className="flex-1">
            {allPosts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                <p className="text-gray-500">No blogs found.</p>
                <button
                  onClick={clearFilters}
                  className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  Clear filters and try again
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {allPosts.map((post: any) => {
                    return (
                      <article
                        key={post.id}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full"
                      >
                        <Link
                          to={`/blog/details/${post.slug}`}
                          className="block overflow-hidden"
                        >
                          <img
                            src={post.image || ""}
                            alt={post.title}
                            className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        <div className="p-4 flex flex-col flex-grow">
                          <Link to={`/blog/details/${post.slug}`}>
                            <h2 className="font-bold text-md text-gray-800 line-clamp-2 hover:text-indigo-600 transition">
                              {post.title}
                            </h2>
                          </Link>

                          <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                            {post.excerpt || post.content?.slice(0, 80) + "..."}
                          </p>

                          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <FiUser size={12} />{" "}
                              {post.author?.username || "Anonymous"}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiCalendar size={12} />{" "}
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
                            className="mt-3 text-indigo-600 text-xs font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                          >
                            Read more <FiArrowRight size={12} />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-10">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                        }`}
                      >
                        Prev
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
                          if (pageNum < 1 || pageNum > totalPages) return null;
                          if (
                            (idx === 0 && pageNum !== 1) ||
                            (idx === 1 && pageNum === 1) ||
                            (idx === 3 && pageNum === currentPage) ||
                            (idx === 4 &&
                              pageNum === totalPages &&
                              totalPages <= currentPage + 1)
                          ) {
                            return null;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                                currentPage === pageNum
                                  ? "bg-indigo-600 text-white shadow-sm"
                                  : "bg-white text-gray-700 hover:bg-indigo-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })
                        .filter(Boolean)}

                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
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
