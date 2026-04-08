import React from "react";
import { useParams } from "react-router-dom";
import { useBlogDetailsQuery } from "../../features/blogs/blogApi";
import { getImageUrl } from "../../helper";
import default_blog_image from "../../assets/default_blog.png";

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: blog,
    isLoading,
    isError,
    error,
  } = useBlogDetailsQuery({ id: Number(id) });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-xl shadow-md">
          Error loading blog: {error?.data?.message || "Something went wrong"}
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get current profile image
  const currentAvatar = blog.author?.profile_images?.find(
    (img: any) => img.is_current,
  )?.image;

  const image = getImageUrl(blog?.image) || default_blog_image;

  const profileImage = getImageUrl(currentAvatar);
  console.log(profileImage);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {blog.image && (
          <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
            <img
              src={image}
              alt={blog.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Blog Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with badges */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.is_featured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                  Featured
                </span>
              )}
              {blog.is_publish ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  Published
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded-full">
                  Draft
                </span>
              )}
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-full">
                {blog.category?.name}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

            <p className="text-gray-600 text-lg italic border-l-4 border-indigo-400 pl-4 my-4">
              {blog.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
              <img
                src={profileImage || "https://via.placeholder.com/60"}
                alt={blog.author?.username}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-200"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {blog.author?.profile?.fullname || blog.author?.username}
                </p>
                <p className="text-sm text-gray-500">
                  Published on {formatDate(blog.created_at)}
                </p>
              </div>
              <div className="ml-auto flex gap-4 text-sm text-gray-500">
                <span>❤️ {blog.likes_count} likes</span>
                <span>💬 {blog.comments?.length || 0} comments</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="px-6 sm:px-8 pb-4 flex flex-wrap gap-2">
              {blog.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Bio Section */}
          {blog.author?.profile?.bio && (
            <div className="m-6 sm:m-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={profileImage || "https://via.placeholder.com/40"}
                  alt={blog.author.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    About {blog.author.profile.fullname || blog.author.username}
                  </p>
                  <p className="text-xs text-gray-500">Author</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">{blog.author.profile.bio}</p>
              {blog.author.profile.social_links && (
                <div className="flex gap-2 mt-3">
                  {blog.author.profile.github && (
                    <a
                      href={blog.author.profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-800"
                    >
                      GitHub
                    </a>
                  )}
                  {blog.author.profile.twitter && (
                    <a
                      href={blog.author.profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-800"
                    >
                      Twitter
                    </a>
                  )}
                  {blog.author.profile.linkedin && (
                    <a
                      href={blog.author.profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-800"
                    >
                      Linkedin
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Comments Section (placeholder) */}
          <div className="p-6 sm:p-8 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Comments ({blog.comments?.length || 0})
            </h3>
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((comment: any, idx: number) => (
                <div key={idx} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{comment.author?.username}</p>
                  <p className="text-gray-600 text-sm">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
