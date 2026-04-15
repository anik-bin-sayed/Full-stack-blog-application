import React, { useEffect, useState } from "react";
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
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { useAppSelector } from "../../redux/hooks";
import { showErrorToast } from "../../utils/showErrorToast";
import Comments from "../../components/Comments/index.tsx";
import CommentsWrapper from "../../components/Comments/CommentsWrapper.tsx";

import defaultProfileImaeg from "../../assets/default_profile_image.png";

const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);

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

  const { data: comment, isLoading: GettingBlog } = useGetCommentQuery(
    {
      blog_id: blog?.id,
    },
    { skip: !blog?.id },
  );

  const comments = comment?.results;

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (blog) {
      setLikesCount(blog.likes_count || 0);
    }
    if (userLikedData !== undefined) {
      setLiked(userLikedData.user_liked || false);
    }
  }, [blog, userLikedData]);

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

  // Helper: reading time
  const readingTime = () => {
    const text = blog.content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Author avatar
  const currentAvatar = blog.author?.profile_images?.find(
    (img: any) => img.is_current,
  )?.image;
  const image = getImageUrl(blog?.image) || default_blog_image;
  const profileImage = getImageUrl(currentAvatar) || defaultProfileImaeg;

  const isOwnPost = blog?.author?.id === user?.id;
  const authorId = blog?.author?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col gap-3 z-20">
        <button
          onClick={handleShare}
          className="p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
          title="Share"
        >
          <ShareIcon className="w-5 h-5" />
        </button>

        {isAuthenticated && (
          <button
            onClick={handleLike}
            disabled={liking}
            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 text-gray-700 hover:text-red-500 cursor-pointer"
            title="Like"
          >
            {liked ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
          </button>
        )}

        <button
          className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 text-gray-700 hover:text-indigo-600 cursor-pointer"
          title="Bookmark"
        >
          <BookmarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Hero Image */}
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
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.is_featured && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-md">
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
            <h1 className="no-copy text-3xl sm:text-4xl lg:text-3xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
              {blog.title}
            </h1>

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
                <span>{likesCount} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-indigo-500" />
                <span>{comments?.count || 0} comments</span>
              </div>
            </div>

            {blog.excerpt && (
              <div className="no-copy bg-indigo-50/50 rounded-xl p-5 mb-6 border-l-4 border-indigo-400 italic text-gray-700 text-base sm:text-md text-justify">
                {blog.excerpt}
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-2xl mb-6">
              <img
                src={profileImage || "/default-avatar.png"}
                alt={blog.author?.username}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-md"
              />
              <div className="flex-1 text-center md:text-left">
                <Link
                  to={`/profile/${blog.author?.id}`}
                  className="font-bold hover:underline text-gray-900 text-lg"
                >
                  {blog.author?.profile?.fullname || blog.author?.username}
                </Link>
                <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1">
                  <UserCircleIcon className="w-3.5 h-3.5" />
                  Author
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
                >
                  Share
                </button>
                {isOwnPost && (
                  <Link
                    to={`/blogs/edit/${blog.slug}`}
                    className="px-4 py-2 bg-indigo-600 rounded-full shadow-sm text-sm font-medium text-white hover:bg-indigo-700 transition cursor-pointer"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="no-copy px-6 sm:px-8 md:px-10 prose prose-lg prose-indigo max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: blog.content }}
              className="blog-content text-justify"
            />
          </div>

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

          <div className="px-6 sm:px-8 md:px-10 py-6 flex justify-center border-t border-gray-100 mt-4">
            <div className="relative group inline-block">
              <button
                onClick={handleLike}
                disabled={liking || !isAuthenticated}
                className={`flex items-center gap-3 px-8 py-3 rounded-full text-lg font-medium transition-all shadow-md cursor-pointer ${
                  liked
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {liked ? (
                  <HeartSolidIcon className="w-7 h-7 text-red-500" />
                ) : (
                  <HeartIcon className="w-7 h-7 group-hover:text-red-400" />
                )}
                <span>
                  {likesCount} {likesCount === 1 ? "Like" : "Likes"}
                </span>
              </button>

              {!isAuthenticated && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                  Please login to like and comment
                </div>
              )}
            </div>
          </div>

          <div className="px-6 sm:px-8 md:px-10 py-8 border-t border-gray-100 bg-gray-50/30">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-indigo-500" />
              Comments ({comments?.length || 0})
            </h3>

            {isAuthenticated && <Comments blog_id={blog.id} />}

            {comments && comments.length > 0 && (
              <CommentsWrapper authorId={authorId} blog_id={blog?.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
