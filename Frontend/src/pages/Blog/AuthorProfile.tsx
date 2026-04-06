import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiTwitter,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiBookOpen,
  FiUsers,
  FiHeart,
  FiMessageCircle,
  FiArrowLeft,
} from "react-icons/fi";

// Sample full author data (replace with API call)

const AuthorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (id && authorsData[Number(id)]) {
        setAuthor(authorsData[Number(id)]);
      } else {
        // Author not found
        setAuthor(null);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Author Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The blogger you're looking for doesn't exist.
          </p>
          <Link
            to="/authors"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to all bloggers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
        <img
          src={author.coverImage}
          alt={`${author.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 md:-mt-24">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <img
                src={author.avatar}
                alt={author.name}
                className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                      {author.name}
                    </h1>
                    <p className="text-indigo-600 font-medium mt-1">
                      {author.role}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 transition"
                  >
                    <FiArrowLeft /> Back
                  </button>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                  {author.company && (
                    <span className="flex items-center gap-1">
                      <FiBriefcase size={14} /> {author.company}
                    </span>
                  )}
                  {author.location && (
                    <span className="flex items-center gap-1">
                      <FiMapPin size={14} /> {author.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FiCalendar size={14} /> Joined {author.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
              {author.socials.twitter && (
                <a
                  href={author.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-600 rounded-full transition text-sm"
                >
                  <FiTwitter size={16} /> Twitter
                </a>
              )}
              {author.socials.github && (
                <a
                  href={author.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-600 rounded-full transition text-sm"
                >
                  <FiGithub size={16} /> GitHub
                </a>
              )}
              {author.socials.linkedin && (
                <a
                  href={author.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-600 rounded-full transition text-sm"
                >
                  <FiLinkedin size={16} /> LinkedIn
                </a>
              )}
              {author.socials.email && (
                <a
                  href={`mailto:${author.socials.email}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-600 rounded-full transition text-sm"
                >
                  <FiMail size={16} /> Email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Bio Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Posts</p>
              <p className="text-3xl font-bold text-gray-800">
                {author.postCount}
              </p>
            </div>
            <FiBookOpen className="w-10 h-10 text-indigo-400" />
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Followers</p>
              <p className="text-3xl font-bold text-gray-800">
                {author.followerCount}
              </p>
            </div>
            <FiUsers className="w-10 h-10 text-indigo-400" />
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Following</p>
              <p className="text-3xl font-bold text-gray-800">
                {author.followingCount}
              </p>
            </div>
            <FiHeart className="w-10 h-10 text-indigo-400" />
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            About {author.name}
          </h2>
          <p className="text-gray-600 leading-relaxed">{author.bio}</p>
          {author.longBio && (
            <p className="text-gray-600 leading-relaxed mt-3">
              {author.longBio}
            </p>
          )}
        </div>

        {/* Recent Posts Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Recent Posts by {author.name}
          </h2>
          <div className="space-y-4">
            {author.recentPosts.map((post: any) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5"
              >
                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition">
                      {post.title}
                    </h3>
                  </Link>
                  <span className="text-xs text-gray-500 flex items-center">
                    <FiCalendar className="mr-1" size={12} /> {post.date}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{post.excerpt}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-indigo-600 text-sm hover:text-indigo-800 flex items-center"
                  >
                    Read more <FiMessageCircle className="ml-1" size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
