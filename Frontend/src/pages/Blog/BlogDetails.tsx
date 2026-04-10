import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useBlogDetailsQuery } from "../../features/blogs/blogApi";
import { formatDate, getImageUrl } from "../../helper";
import default_blog_image from "../../assets/default_blog.png";
import { toast } from "react-toastify";
import {
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  ShareIcon,
  BookmarkIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { useAppSelector } from "../../redux/hooks";

const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const {
    data: blog,
    isLoading,
    isError,
    error,
  } = useBlogDetailsQuery({ slug: String(slug) });

  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Please don’t copy. Share instead.");
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && ["c", "u", "s"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        toast.error("Copying is disabled. Please share the link instead.");
      }
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Share handler
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) return <Loader />;

  if (isError || !blog) return <Error />;

  // Calculate reading time (approx 200 words per minute)
  const readingTime = () => {
    const text = blog.content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const currentAvatar = blog.author?.profile_images?.find(
    (img: any) => img.is_current,
  )?.image;
  const image = getImageUrl(blog?.image) || default_blog_image;
  const profileImage = getImageUrl(currentAvatar);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-8 px-4 sm:px-6 lg:px-8">
      {/* Sticky Share Bar */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col gap-3 z-20">
        <button
          onClick={handleShare}
          className="p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 text-white hover:bg-indigo-700 bg-indigo-600 cursor-pointer"
          title="Share"
        >
          <ShareIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setLiked(!liked)}
          className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 text-gray-700 hover:text-red-500 cursor-pointer"
          title="Like"
        >
          {liked ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500 " />
          ) : (
            <HeartIcon className="w-5 h-5" />
          )}
        </button>
        <button
          className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 text-gray-700 hover:text-indigo-600 cursor-pointer"
          title="Bookmark"
        >
          <BookmarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        {blog.image && (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 group">
            <img
              src={image}
              alt={blog.title}
              className="w-full h-[320px] sm:h-[420px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header Section */}
          <div className="p-6 sm:p-8 md:p-10">
            {/* Badge Row */}
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.is_featured && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                  Featured
                </span>
              )}
              {blog.is_publish ? (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Published
                </span>
              ) : (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                  Draft
                </span>
              )}
              <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                {blog.category?.name}
              </span>
            </div>

            {/* Title */}
            <h1 className="no-copy text-3xl sm:text-4xl lg:text-4xl font-semibold text-gray-900 leading-tight tracking-tight mb-4">
              {blog.title}
            </h1>

            {/* Meta Info Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-1">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>{formatDate(blog.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{readingTime()}</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartIcon className="w-4 h-4 text-red-500" />
                <span>{blog.likes_count} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-indigo-500" />
                <span>{blog.comments?.length || 0} comments</span>
              </div>
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="no-copy bg-indigo-50/50 rounded-xl p-5 mb-6 border-l-4 border-indigo-400 italic text-gray-700 text-base sm:text-md text-justify">
                {blog.excerpt}
              </div>
            )}

            {/* Author Info Card */}
            <div className="flex flex-col md:flex-row lg:flex-row items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-2xl mb-6">
              <img
                src={profileImage || "asdfasd"}
                alt={blog.author?.username}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-md"
              />
              <div className="flex-1">
                <Link
                  to="/profile"
                  className="font-bold hover:underline text-gray-900 text-lg"
                >
                  {blog.author?.profile?.fullname || blog.author?.username}
                </Link>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <UserCircleIcon className="w-3.5 h-3.5" />
                  Author
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer cursor-pointer"
                >
                  Share
                </button>
                <Link
                  to={`/blogs/edit/${blog.slug}`}
                  className="px-4 py-2 bg-indigo-600 rounded-full shadow-sm text-sm font-medium text-white hover:bg-indigo-700 transition cursor-pointer"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>

          <div className="no-copy px-6 sm:px-8 md:px-10 prose prose-lg prose-indigo max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: blog.content }}
              className="blog-content text-justify"
            />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="px-6 sm:px-8 md:px-10 py-4 flex flex-wrap gap-2 border-t border-gray-100 mt-6">
              <TagIcon className="w-5 h-5 text-gray-400 mr-1" />
              {blog.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {blog.author?.profile?.bio && (
            <div className="mx-6 sm:mx-8 md:mx-10 my-8 p-6 bg-gradient-to-r from-indigo-50/40 to-purple-50/40 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={profileImage || "https://via.placeholder.com/48"}
                  alt={blog.author.username}
                  className="w-12 h-12 rounded-full ring-2 ring-indigo-300"
                />
                <div>
                  <p className="font-bold text-gray-800">
                    {blog.author.profile.fullname || blog.author.username}
                  </p>
                  <p className="text-xs text-indigo-600">Writer & Creator</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {blog.author.profile.bio}
              </p>
              {blog.author.profile.social_links && (
                <div className="flex gap-3 mt-4">
                  {blog.author.profile.github && (
                    <a
                      href={blog.author.profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-800 transition"
                    >
                      GitHub
                    </a>
                  )}
                  {blog.author.profile.twitter && (
                    <a
                      href={blog.author.profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-800 transition"
                    >
                      Twitter
                    </a>
                  )}
                  {blog.author.profile.linkedin && (
                    <a
                      href={blog.author.profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-800 transition"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="px-6 sm:px-8 md:px-10 py-8 border-t border-gray-100 bg-gray-50/30">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-indigo-500" />
              Comments ({blog.comments?.length || 0})
            </h3>

            {isAuthenticated && (
              <div className="mb-8 bg-white rounded-xl p-5 shadow-sm">
                <textarea
                  rows={3}
                  placeholder="Write a comment..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                ></textarea>
                <div className="flex justify-end mt-3">
                  <button className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-sm">
                    Post Comment
                  </button>
                </div>
              </div>
            )}

            {/* Comments List */}
            {blog.comments && blog.comments.length > 0 ? (
              <div className="space-y-4">
                {blog.comments.map((comment: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {comment.author?.username?.charAt(0).toUpperCase() ||
                          "U"}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {comment.author?.username}
                          <span className="text-xs text-gray-400 ml-2">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </p>
                        <p className="text-gray-600 mt-1">{comment.content}</p>
                        <button className="text-xs text-indigo-500 mt-2 hover:underline">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-xl">
                <ChatBubbleLeftEllipsisIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">
                  No comments yet. Start the conversation!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
