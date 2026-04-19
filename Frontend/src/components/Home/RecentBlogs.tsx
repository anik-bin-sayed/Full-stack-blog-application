import { useMemo } from "react";
import { FiCalendar, FiUser, FiClock, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { formatDate } from "../../helper";
import { usePublicRecentBlogsQuery } from "../../features/blogs/blogApi";

type AuthorProfile = {
  fullname?: string;
  username?: string;
};

type Author = {
  id: number;
  username: string;
  profile?: AuthorProfile;
};

type Blog = {
  id: number;
  slug: string;
  authorName: string;
  title: string;
  readingTime: number;
  content?: string;
  body?: string;
  excerpt?: string;
  image?: string;
  created_at: string;
  author?: Author;
  preview?: string;
};

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
};

const RecentBlogs = () => {
  const { data: recentBlogs, isLoading } = usePublicRecentBlogsQuery();

  const processedBlogs = useMemo(() => {
    if (!recentBlogs) return [];

    return recentBlogs.map((post: Blog) => {
      const rawText = post.content || post.body || post.excerpt || "";
      const text = stripHtml(rawText);

      const words = text.split(/\s+/).filter(Boolean);

      let preview = words.slice(0, 25).join(" ");
      if (words.length > 25) preview += "...";

      const readingTime = Math.max(1, Math.ceil(words.length / 200));

      return {
        ...post,
        preview,
        readingTime,
        authorName:
          post.author?.profile?.fullname ||
          post.author?.username ||
          "Anonymous",
      };
    });
  }, [recentBlogs]);

  return (
    <div className="lg:w-2/3">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 inline-block relative">
          Recent Posts
          <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full mt-1"></span>
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Latest stories from our blog
        </p>
      </div>

      <div className="space-y-8">
        {processedBlogs &&
          processedBlogs.map((post: Blog) => {
            const date = formatDate(post?.created_at);

            return (
              <article
                key={post.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row border border-gray-100 hover:border-indigo-100"
              >
                <Link
                  to={`/blog/details/${post.slug}`}
                  className="md:w-48 lg:w-56 overflow-hidden relative block"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  <img
                    src={post.image || ""}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={300}
                    className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                <div className="flex-1 p-5 md:p-6 flex flex-col">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} /> {date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUser size={12} /> {post.authorName}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                      <FiClock size={10} /> {post.readingTime} min read
                    </span>
                  </div>

                  <Link to={`/blog/details/${post.slug}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                    {post.preview}
                  </p>

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

      {isLoading && (
        <div className="space-y-6 mt-6">
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
