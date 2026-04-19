import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useBlogDetailsQuery,
  useGetCommentQuery,
  useLikeBlogMutation,
  useUserIsLikeQuery,
} from "../../features/blogs/blogApi";
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
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { useAppSelector } from "../../redux/hooks";
import { showErrorToast } from "../../utils/showErrorToast";
import Comments from "../../components/Comments/index.tsx";
import CommentsWrapper from "../../components/Comments/CommentsWrapper.tsx";
import defaultProfileImage from "../../assets/default_profile_image.png";

const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const contentRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  const {
    data: blog,
    isLoading,
    isError,
  } = useBlogDetailsQuery({ slug: String(slug) });

  const [likeBlog, { isLoading: liking }] = useLikeBlogMutation();
  const { data: userLikedData, refetch: refetchUserLike } = useUserIsLikeQuery(
    blog?.id,
    { skip: !isAuthenticated || !blog?.id },
  );
  const { data: comment } = useGetCommentQuery(
    { blog_id: blog?.id },
    { skip: !blog?.id },
  );

  const comments = comment?.results;
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (blog) setLikesCount(blog.likes_count || 0);
    if (userLikedData !== undefined)
      setLiked(userLikedData.user_liked || false);
  }, [blog, userLikedData]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const winScroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (winScroll / height) * 100;
      setReadingProgress(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Copy protection
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Please don't copy. Share instead.");
    };
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
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

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: blog?.title, text: blog?.excerpt, url });
      } catch (err) {
        showErrorToast(err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like this post");
      return;
    }
    if (liking) return;
    const newLiked = !liked;
    const newCount = newLiked ? likesCount + 1 : likesCount - 1;
    setLiked(newLiked);
    setLikesCount(newCount);
    try {
      await likeBlog(blog.id).unwrap();
      refetchUserLike();
    } catch (error) {
      setLiked(!newLiked);
      setLikesCount(likesCount);
      showErrorToast(error);
    }
  };

  if (isLoading) return <Loader />;
  if (isError || !blog) return <Error />;

  const readingTime = () => {
    const text = blog.content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const currentAvatar = blog.author?.profile_images?.find(
    (img: { is_current: boolean }) => img.is_current,
  )?.image;
  const profileImage = getImageUrl(currentAvatar) || defaultProfileImage;
  const isOwnPost = blog?.author?.id === user?.id;
  const authorId = blog?.author?.id;

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 bg-amber-100 z-50">
        <div
          className="h-full bg-amber-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/40">
        <div className="fixed left-6 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col gap-4 z-30">
          <button
            onClick={handleShare}
            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 text-indigo-600 hover:bg-indigo-50 cursor-pointer group"
            title="Share"
          >
            <ShareIcon className="w-5 h-5 group-hover:rotate-12 transition" />
          </button>
          {isAuthenticated && (
            <button
              onClick={handleLike}
              disabled={liking}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 cursor-pointer group"
              title="Like"
            >
              {liked ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500 animate-pulse" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
              )}
            </button>
          )}
          <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 cursor-pointer group">
            <BookmarkIcon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 p-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition" />
            Back to blogs
          </Link>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {blog.image && (
            <div className="relative w-full border rounded shadow-md mb-8 bg-black flex justify-center items-center">
              <img
                src={blog.image || default_blog_image}
                alt={blog.title}
                loading="lazy"
                width={800}
                height={400}
                className="w-full h-auto object-contain"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            </div>
          )}

          {!blog.image && (
            <div className="bg-linear-to-r from-indigo-900 to-purple-800 py-16 md:py-24">
              <div className="max-w-4xl mx-auto px-4 text-white text-center">
                <div className="flex justify-center gap-2 mb-4">
                  {blog.is_featured && (
                    <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                      Featured
                    </span>
                  )}
                  <span className="px-3 py-1 bg-emerald-500/80 text-white text-xs font-semibold rounded-full">
                    {blog.is_publish ? "Published" : "Draft"}
                  </span>
                  <span className="px-3 py-1 bg-indigo-500/80 text-white text-xs font-semibold rounded-full">
                    {blog.category?.name}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold">{blog.title}</h1>
                <div className="flex justify-center gap-4 mt-4 text-sm text-white/70">
                  <span>{formatDate(blog.created_at)}</span>
                  <span>{readingTime()}</span>
                  <span>{likesCount} likes</span>
                  <span>{comments?.length || 0} comments</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-10 flex flex-col sm:flex-row items-center gap-6 border border-gray-100">
            <img
              src={profileImage}
              alt={blog.author?.username}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-100 shadow"
            />
            <div className="flex-1 text-center sm:text-left">
              <Link
                to={`/profile/${blog.author?.id}`}
                className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition"
              >
                {blog.author?.profile?.fullname || blog.author?.username}
              </Link>
              <p className="text-gray-500 text-sm mt-1 flex items-center justify-center sm:justify-start gap-1">
                <UserCircleIcon className="w-4 h-4" />
                Author
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
              >
                Share
              </button>
              {isOwnPost && (
                <Link
                  to={`/blogs/edit/${blog.slug}`}
                  className="px-4 py-2 bg-indigo-600 rounded-full text-sm font-medium text-white hover:bg-indigo-700 transition"
                >
                  Edit
                </Link>
              )}
            </div>
          </div>

          <div className="border bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.is_featured && (
                  <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow">
                    Featured
                  </span>
                )}
                <span className="px-3 py-1 bg-emerald-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  {blog.is_publish ? "Published" : "Draft"}
                </span>
                <span className="px-3 py-1 bg-indigo-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  {blog.category?.name}
                </span>
              </div>
              <h1 className="text-2xl text-black md:text-3xl lg:text-3xl font-semibold leading-tight drop-shadow-lg">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-black/80">
                <div className="flex items-center gap-1">
                  <CalendarDaysIcon className="w-4 h-4" />
                  {formatDate(blog.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  {readingTime()}
                </div>
                <div className="flex items-center gap-2">
                  <HeartIcon className="w-4 h-4" />
                  {likesCount} likes
                </div>
                <div className="flex items-center gap-2">
                  <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                  {comments?.length || 0} comments
                </div>
              </div>
            </div>
          </div>

          {blog.excerpt && (
            <div className="bg-amber-50/40 rounded-xl p-6 mb-8 border-l-4 border-amber-400  text-gray-700 text-base md:text-lg">
              {blog.excerpt}
            </div>
          )}

          <div
            ref={contentRef}
            className="prose prose-lg prose-indigo max-w-none wrap-break-word overflow-x-auto"
          >
            <div className="no-copy">
              {blog.content.split("\n").map((line: string, idx: number) => (
                <p key={idx} className="mb-4">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-100">
              <TagIcon className="w-5 h-5 text-gray-400 mr-1 mt-0.5" />
              {blog.tags.map((tag: string, idx: number) => {
                console.log(tag);
                return (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition cursor-default"
                  >
                    #{tag}
                  </span>
                );
              })}
            </div>
          )}

          <div className="flex justify-center my-12">
            <button
              onClick={handleLike}
              disabled={liking || !isAuthenticated}
              className={`group flex items-center gap-3 px-8 py-3 rounded-full text-lg font-medium transition-all shadow-md cursor-pointer ${
                liked
                  ? "bg-amber-50 text-red-600 hover:bg-red-100"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {liked ? (
                <HeartSolidIcon className="w-7 h-7 text-red-500 animate-pulse" />
              ) : (
                <HeartIcon className="w-7 h-7 group-hover:text-red-400 transition" />
              )}
              <span>
                {likesCount} {likesCount === 1 ? "Like" : "Likes"}
              </span>
            </button>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-indigo-500" />
              Discussion ({comments?.length || 0})
            </h3>

            {isAuthenticated && (
              <div className="mb-8 bg-white rounded-xl p-4 shadow-sm">
                <Comments blog_id={blog.id} />
              </div>
            )}

            {comments && comments.length > 0 ? (
              <CommentsWrapper authorId={authorId} blog_id={blog?.id} />
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <ChatBubbleLeftEllipsisIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
