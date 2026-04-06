import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiCalendar,
  FiUser,
  FiTag,
  FiArrowRight,
} from "react-icons/fi";

// Sample blog posts data (replace with your actual API data)
const allPosts = [
  {
    id: 1,
    title: "The Future of Web Development in 2025",
    excerpt:
      "Explore the latest trends, tools, and technologies shaping the future of web development...",
    author: "Sarah Johnson",
    date: "April 1, 2026",
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format",
    slug: "future-web-development-2025",
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS: Tips & Tricks",
    excerpt:
      "Learn how to build stunning UIs faster with Tailwind CSS utility-first framework...",
    author: "Michael Chen",
    date: "March 28, 2026",
    category: "CSS",
    image:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&auto=format",
    slug: "mastering-tailwind-css",
  },
  {
    id: 3,
    title: "10 Productivity Hacks for Developers",
    excerpt:
      "Boost your coding efficiency with these practical tips and tools...",
    author: "Emily Rodriguez",
    date: "March 25, 2026",
    category: "Productivity",
    image:
      "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format",
    slug: "productivity-hacks-developers",
  },
  {
    id: 4,
    title: "Getting Started with React 19",
    excerpt: "Discover the new features and improvements in React 19...",
    author: "David Kim",
    date: "March 22, 2026",
    category: "React",
    image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format",
    slug: "getting-started-react-19",
  },
  {
    id: 5,
    title: "State Management in 2026: Redux vs Zustand",
    excerpt: "Compare the most popular state management libraries...",
    author: "Lisa Wang",
    date: "March 20, 2026",
    category: "State Management",
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format",
    slug: "state-management-redux-zustand",
  },
  {
    id: 6,
    title: "Building Accessible Web Apps",
    excerpt: "A guide to making your applications usable by everyone...",
    author: "James Wilson",
    date: "March 18, 2026",
    category: "Accessibility",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format",
    slug: "building-accessible-web-apps",
  },
  {
    id: 7,
    title: "TypeScript Best Practices",
    excerpt:
      "Improve your TypeScript code quality with these proven patterns...",
    author: "Anna Lee",
    date: "March 15, 2026",
    category: "TypeScript",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format",
    slug: "typescript-best-practices",
  },
  {
    id: 8,
    title: "GraphQL vs REST: Which to Choose?",
    excerpt:
      "A comprehensive comparison to help you decide the right API approach...",
    author: "Tom Harris",
    date: "March 12, 2026",
    category: "API",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format",
    slug: "graphql-vs-rest",
  },
  {
    id: 9,
    title: "UX Design Principles for Developers",
    excerpt: "Essential UX concepts every developer should know...",
    author: "Maria Garcia",
    date: "March 10, 2026",
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format",
    slug: "ux-design-principles",
  },
];

const categories = [
  "All",
  "Technology",
  "CSS",
  "Productivity",
  "React",
  "State Management",
  "Accessibility",
  "TypeScript",
  "API",
  "Design",
];

const Blogs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Sync state with URL params on mount
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const formatted =
        categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
      if (categories.includes(formatted)) setSelectedCategory(formatted);
    }
    const searchParam = searchParams.get("search");
    if (searchParam) setSearchTerm(searchParam);
    const pageParam = searchParams.get("page");
    if (pageParam) setCurrentPage(Number(pageParam));
  }, [searchParams]);

  // Filter posts
  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage,
  );

  // Update URL when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedCategory !== "All")
      params.category = selectedCategory.toLowerCase();
    if (searchTerm) params.search = searchTerm;
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params);
  }, [selectedCategory, searchTerm, currentPage, setSearchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            All Blogs
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            Explore our collection of articles, tutorials, and insights
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search Box */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <FiSearch className="mr-2 text-indigo-600" /> Search
                </h3>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search posts..."
                      className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-600"
                    >
                      <FiSearch />
                    </button>
                  </div>
                </form>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        selectedCategory === cat
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory !== "All" || searchTerm) && (
                <div className="bg-indigo-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold text-indigo-800">
                      Active Filters
                    </h4>
                    <button
                      onClick={clearFilters}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory !== "All" && (
                      <span className="inline-flex items-center px-2 py-1 bg-indigo-200 text-indigo-800 rounded-md text-xs">
                        Category: {selectedCategory}
                        <button
                          onClick={() => handleCategoryChange("All")}
                          className="ml-1 hover:text-indigo-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {searchTerm && (
                      <span className="inline-flex items-center px-2 py-1 bg-indigo-200 text-indigo-800 rounded-md text-xs">
                        Search: {searchTerm}
                        <button
                          onClick={() => setSearchTerm("")}
                          className="ml-1 hover:text-indigo-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content - Blog Grid */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold">{currentPosts.length}</span> of{" "}
                <span className="font-semibold">{filteredPosts.length}</span>{" "}
                posts
              </p>
            </div>

            {/* Blog Cards */}
            {currentPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {currentPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex flex-col"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center text-xs text-gray-500 mb-2 space-x-3">
                        <span className="flex items-center">
                          <FiCalendar className="mr-1" size={12} /> {post.date}
                        </span>
                        <span className="flex items-center">
                          <FiUser className="mr-1" size={12} /> {post.author}
                        </span>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-indigo-600 transition line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="inline-flex items-center text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                          <FiTag className="mr-1" size={12} /> {post.category}
                        </span>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition flex items-center"
                        >
                          Read more <FiArrowRight className="ml-1" size={14} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500 text-lg">
                  No posts found matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === 1
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300"
                  } transition`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-indigo-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === totalPages
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300"
                  } transition`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
