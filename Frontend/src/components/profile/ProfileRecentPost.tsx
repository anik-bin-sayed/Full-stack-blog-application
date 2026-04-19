import React from "react";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";

interface Profile {
  id: number;
  username: string;
  email: string;

  cover_image?: string;
  bio?: string;
  location?: string;
  website?: string;
  created_at: string;
}
interface profileImage {
  id: number;
  image: string;
  profile: number;
}
interface Author {
  id: number;
  username: string;
  email: string;
  profile?: Profile;
  profile_images?: profileImage;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string;
  is_featured: boolean;
  is_publish: boolean;
  likes_count: number;
  created_at: string;
  author: Author;
  category: Category;
}

interface ProfileRecentPostProps {
  data: Post | Post[] | null | undefined;
  isLoading: boolean;
  error?: any;
}

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getExcerpt = (content: string, maxLength: number = 120): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + "...";
};

const ProfileRecentPost: React.FC<ProfileRecentPostProps> = ({
  data,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium">Error loading posts</p>
        <p className="text-sm">{error?.message || "Something went wrong"}</p>
      </div>
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No posts found.</p>
      </div>
    );
  }

  const posts = Array.isArray(data) ? data : [data];

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        return (
          <article
            key={post.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100"
          >
            <Link
              to={`/blog/details/${post.slug}`}
              className="flex flex-col md:flex-row"
            >
              {post.image && (
                <div className="md:w-1/3 lg:w-1/4 h-48 md:h-auto">
                  <img
                    src={post?.image || ""}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1 p-5">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                  {post.category && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {post.category.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    {formatDate(post.created_at)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {getExcerpt(post.content)}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    {post.author && (
                      <>
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">
                          {post.author.username.charAt(0).toUpperCase()}
                        </div>
                        <span>{post.author.username}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <CiHeart />
                      {post.likes_count}
                    </span>

                    <span className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Read more →
                    </span>
                  </div>
                </div>

                {post.is_featured && (
                  <div className="mt-3">
                    <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
};

export default ProfileRecentPost;
