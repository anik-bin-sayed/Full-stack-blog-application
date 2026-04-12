import React from "react";
import { FiCalendar, FiUser, FiClock, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getImageUrl, formatDate } from "../../helper";
import { usePublicRecentBlogsQuery } from "../../features/blogs/blogApi";

const RecentBlogs = () => {
  const { data: recentBlogs, isLoading } = usePublicRecentBlogsQuery();

  // Helper to extract plain text from HTML content
  const getPlainText = (html: string) => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Get content preview (first 60 words)
  const getContentPreview = (post: any) => {
    const rawContent = post.content || post.body || post.excerpt || "";
    const plainText = getPlainText(rawContent);
    const words = plainText.split(/\s+/).filter((w) => w.length > 0);
    const previewWords = words.slice(0, 25);
    let preview = previewWords.join(" ");
    if (words.length > 25) preview += "...";
    return preview || "No preview available";
  };

  // Estimate reading time
  const getReadingTime = (content: string) => {
    const plainText = getPlainText(content);
    const wordsPerMinute = 200;
    const wordCount = plainText.split(/\s+/).filter((w) => w.length > 0).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes > 0 ? minutes : 1;
  };

  return (
    <div className="lg:w-2/3">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 inline-block relative">
          Recent Posts
          <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-1"></span>
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Latest stories from our blog
        </p>
      </div>

      <div className="space-y-8">
        {recentBlogs &&
          recentBlogs.map((post) => {
            const image = getImageUrl(post.image);
            const date = formatDate(post?.created_at);
            const authorName =
              post.author?.profile?.fullname ||
              post.author?.username ||
              "Anonymous";
            const contentPreview = getContentPreview(post);
            const readingTime = getReadingTime(post.content || post.body || "");

            return (
              <article
                key={post.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row border border-gray-100 hover:border-indigo-100"
              >
                {/* Image section with zoom effect */}
                <Link
                  to={`/blog/details/${post.slug}`}
                  className="md:w-48 lg:w-56 overflow-hidden relative block"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <img
                    src={image}
                    alt={post.title}
                    className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Content section */}
                <div className="flex-1 p-5 md:p-6 flex flex-col">
                  {/* Meta info row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} /> {date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUser size={12} /> {authorName}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                      <FiClock size={10} /> {readingTime} min read
                    </span>
                  </div>

                  {/* Title */}
                  <Link to={`/blog/details/${post.slug}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Content preview (actual blog content) */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                    {contentPreview}
                  </p>

                  {/* Read more link */}
                  <Link
                    to={`/blog/details/${post.slug}`}
                    className="inline-flex items-center text-indigo-600 text-sm font-semibold hover:text-indigo-800 transition group/link mt-auto pt-2"
                  >
                    Read full article
                    <FiArrowRight
                      className="ml-1 transition-transform duration-200 group-hover/link:translate-x-1"
                      size={14}
                    />
                  </Link>
                </div>
              </article>
            );
          })}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row animate-pulse"
            >
              <div className="md:w-48 lg:w-56 h-48 bg-gray-200"></div>
              <div className="flex-1 p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentBlogs;
