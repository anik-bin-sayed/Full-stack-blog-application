import React from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiBookOpen,
  FiMessageCircle,
  FiHeart,
  FiArrowRight,
  FiUser,
  FiStar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { formatDate, getImageUrl } from "../../helper";

interface Post {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  image?: string; // added to match your code
  published_date?: string;
  created_at?: string; // used in formatDate
  read_time?: number;
  comment_count?: number;
  like_count?: number;
  likes_count?: number; // your original field
  category?: { name: string };
  author?: { username: string };
  is_featured?: boolean;
  content?: string;
}

interface AuthorProfilePostProps {
  authorProfileRecentPost?: Post[];
}

// Helper to extract plain text excerpt from HTML content
const getExcerpt = (html?: string, length = 120) => {
  if (!html) return "";
  const plainText = html.replace(/<[^>]*>/g, "");
  return plainText.length > length
    ? plainText.slice(0, length) + "..."
    : plainText;
};

const AuthorProfilePost: React.FC<AuthorProfilePostProps> = ({
  authorProfileRecentPost = [],
}) => {
  if (!authorProfileRecentPost || authorProfileRecentPost.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-sm p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-400 mb-4">
          <FiBookOpen size={32} />
        </div>
        <h3 className="text-lg font-medium text-gray-700">No posts yet</h3>
        <p className="text-gray-500 text-sm mt-1">
          This author hasn't published any posts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {authorProfileRecentPost.map((post, idx) => {
        const postThumbnail = getImageUrl(post?.image);
        return (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
          >
            <Link
              to={`/blog/details/${post.slug}`}
              className="flex flex-col md:flex-row"
            >
              {/* Post Image - enhanced with overlay and scale on hover */}
              {post.image && (
                <div className="md:w-1/3 lg:w-1/4 h-48 md:h-auto overflow-hidden bg-gray-100 relative">
                  <img
                    src={postThumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}

              {/* Post Content - enhanced spacing and typography */}
              <div className="flex-1 p-5 md:p-6">
                {/* Category & Date Row */}
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
                  {post.category && (
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">
                      {post.category.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <FiCalendar size={12} />
                    {formatDate(post?.created_at)}
                  </span>
                </div>

                {/* Title - larger and bolder on hover */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                  {post.title}
                </h3>

                {/* Excerpt - cleaner */}
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
                  {getExcerpt(post.content)}
                </p>

                {/* Footer row - author, stats, read more */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    {post.author && (
                      <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full">
                        <span className="text-gray-700 text-sm font-medium">
                          {post.author.username}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Likes */}
                    <span className="flex items-center gap-1 text-red-500">
                      <FiHeart size={14} className="fill-red-100" />
                      <span className="text-gray-600 text-sm">
                        {post.likes_count || post.like_count || 0}
                      </span>
                    </span>

                    {/* Comments (optional) */}
                    {post.comment_count !== undefined && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <FiMessageCircle size={14} />
                        <span>{post.comment_count}</span>
                      </span>
                    )}

                    {/* Read more - with animated arrow */}
                    <span className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 transition-all group-hover:gap-2">
                      Read more
                      <FiArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </div>

                {/* Featured Badge */}
                {post.is_featured && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs px-2.5 py-1 rounded-full border border-yellow-200">
                      <FiStar size={12} />
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
};

export default AuthorProfilePost;
