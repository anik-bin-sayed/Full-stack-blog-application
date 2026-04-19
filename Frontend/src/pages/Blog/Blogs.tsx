import React, { useState, useEffect, useMemo, useCallback } from "react";
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

import BloggersSkeleton from "../../components/Skeletons/BloggersSkeleton";
import type { CategoryType } from "../../types/category/categoryMap";

type PostType = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string;
  created_at: string;
  preview?: string;
  authorName?: string;
  date?: string;
  author?: {
    username: string;
  };
};

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
};

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
    const params: Record<string, string> = {};

    if (selectedCategory !== "All") params.category = String(selectedCategory);
    if (searchTerm) params.search = searchTerm;
    if (currentPage > 1) params.page = String(currentPage);

    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchTerm, currentPage, setSearchParams]);

  const handleCategoryChange = useCallback((id: number | "All") => {
    setSelectedCategory(id);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("All");
    setCurrentPage(1);
  }, []);

  const processedPosts = useMemo(() => {
    return allPosts.map((post: PostType) => {
      const text = stripHtml(post.content || post.excerpt || "");

      return {
        ...post,
        preview: text.length > 80 ? text.slice(0, 80) + "..." : text,
        authorName: post.author?.username || "Anonymous",
        date: new Date(post.created_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };
    });
  }, [allPosts]);

  if (isLoading) return <BloggersSkeleton />;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="relative bg-linear-to-r from-indigo-700 via-purple-700 to-indigo-700 text-white py-16 px-4">
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
                    className="w-full border border-gray-200 rounded-lg py-2 pl-4 pr-10 focus:ring-2 focus:ring-indigo-400 text-sm"
                    placeholder="Search blogs..."
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <FiSearch size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* CATEGORY */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="flex items-center gap-2 text-md font-semibold text-gray-800 mb-3">
                <FiFilter className="text-indigo-500" size={18} /> Categories
              </h3>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange("All")}
                  className={`px-3 py-1 rounded-full text-xs hover:outline outline-indigo-600 cursor-pointer ${
                    selectedCategory === "All"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  All
                </button>

                {categories.map((cat: CategoryType) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id || 0)}
                    className={`px-3 py-1 rounded-full text-xs hover:outline outline-indigo-600 cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100"
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
                className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm flex items-center justify-center gap-1 cursor-pointer hover:bg-red-100 transition"
              >
                <FiX /> Clear Filters
              </button>
            )}
          </aside>

          {/* POSTS */}
          <div className="flex-1">
            {processedPosts.length === 0 ? (
              <div className="bg-white p-10 text-center">No blogs found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {processedPosts.map((post: PostType) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <Link to={`/blog/details/${post.slug}`}>
                      <img
                        src={post.image || ""}
                        className="h-44 w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>

                    <div className="p-4">
                      <h2 className="font-bold line-clamp-2">{post.title}</h2>

                      <p className="text-xs text-gray-500 mt-2">
                        {post.preview}
                      </p>

                      <div className="flex justify-between text-xs mt-3 text-gray-400">
                        <span>
                          <FiUser size={12} /> {post.authorName}
                        </span>
                        <span>
                          <FiCalendar size={12} /> {post.date}
                        </span>
                      </div>

                      <Link
                        to={`/blog/details/${post.slug}`}
                        className="text-indigo-600 text-xs mt-3 inline-flex items-center"
                      >
                        Read more <FiArrowRight size={12} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  >
                    Prev
                  </button>
                  <button onClick={() => setCurrentPage((p) => p + 1)}>
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
