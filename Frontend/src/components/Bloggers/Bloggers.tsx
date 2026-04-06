import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiMapPin,
  FiUsers,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";

interface ProfileImage {
  id?: number;
  image_url?: string;
}

interface CoverImage {
  id?: number;
  image_url?: string;
}

interface Follower {
  id: number;
  username: string;
}

interface Following {
  id: number;
  username: string;
}

interface Profile {
  bio?: string;
  phone?: string;
  birthdate?: string | null;
  gender?: string;
  language?: string;
  location?: string;
  first_name?: string;
  last_name?: string;
}

interface Blogger {
  id: number;
  username: string;
  email: string;
  profile: Profile | null;
  profile_images: ProfileImage[];
  cover_images: CoverImage[];
  followers: Follower[];
  following: Following[];
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Blogger[];
}

interface BloggersProps {
  data: ApiResponse;
  isLoading?: boolean;
  error?: string | null;
}

const DefaultBloggerImage: React.FC<{ name: string }> = ({ name }) => {
  const getGradient = (str: string) => {
    const colors = [
      "from-indigo-500 to-purple-500",
      "from-pink-500 to-rose-500",
      "from-green-500 to-emerald-500",
      "from-blue-500 to-cyan-500",
      "from-orange-500 to-red-500",
      "from-teal-500 to-green-500",
      "from-purple-500 to-indigo-500",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={`w-full h-48 bg-gradient-to-br ${getGradient(name)} flex items-center justify-center`}
    >
      <div className="text-center">
        <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <FiUser className="w-10 h-10 text-white" />
        </div>
        <p className="text-white/80 text-sm mt-3 font-medium truncate px-4">
          {name}
        </p>
      </div>
    </div>
  );
};

const Bloggers: React.FC<BloggersProps> = ({
  data,
  isLoading = false,
  error = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBloggers, setFilteredBloggers] = useState<Blogger[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Filter when search term or data changes
  useEffect(() => {
    if (data?.results) {
      const filtered = data.results.filter((blogger) => {
        const fullName =
          `${blogger.profile?.first_name || ""} ${blogger.profile?.last_name || ""}`.toLowerCase();
        return (
          blogger.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blogger.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fullName.includes(searchTerm.toLowerCase()) ||
          blogger.profile?.bio
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          blogger.profile?.location
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      });
      setFilteredBloggers(filtered);
    }
  }, [searchTerm, data]);

  // Helper: get display name (prefer profile first/last, fallback to username)
  const getDisplayName = (blogger: Blogger): string => {
    if (blogger.profile?.first_name) {
      return `${blogger.profile.first_name} ${blogger.profile.last_name || ""}`.trim();
    }
    return blogger.username;
  };

  // Helper: get avatar URL (first profile image or null)
  const getAvatarUrl = (blogger: Blogger): string | null => {
    if (blogger.profile_images && blogger.profile_images.length > 0) {
      const imgUrl = blogger.profile_images[0].image_url;
      if (imgUrl) return imgUrl;
    }
    return null;
  };

  // Helper: get follower count
  const getFollowerCount = (blogger: Blogger): number => {
    return blogger.followers?.length || 0;
  };

  // Helper: get join year (based on id or random for demo)
  const getJoinYear = (blogger: Blogger): number => {
    // In a real app, you'd have a joined date field
    // This is just for visual enhancement
    return 2020 + (blogger.id % 4);
  };

  const handleImageError = (bloggerId: number) => {
    setImageErrors((prev) => ({ ...prev, [bloggerId]: true }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">
            Discovering amazing bloggers...
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Please wait while we load the community
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Unable to Load Bloggers
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute left-0 top-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M20 0 L40 20 L20 40 L0 20 Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <FiUsers className="w-4 h-4" />
            <span className="text-sm font-medium">Community</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
            All Bloggers
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
            Meet our amazing community of writers and creators sharing their
            stories with the world
          </p>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative h-8 w-full text-gray-50 fill-current"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
            ></path>
            <path
              d="M0,0V15.81C13,21.25,27.93,25.67,44.24,28.45c69.76,13.44,147.83,15.92,220.44,7.89C400.19,21.84,496.31,5.56,582.58,18.47c68.18,10.25,135.21,31.27,204.88,31.23,67.44-.05,135.23-18.92,202.88-32.78C1029.77,8.17,1105.68,5.6,1200,15.39V0Z"
              opacity=".5"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c77.91-13.91,153.65-36.32,230.85-42.93,79.37-6.78,156.93,3.08,236,16.44,48.44,8.21,94.56,22.51,140.77,39.55C1134.5,56.19,1172.48,64.59,1200,72.53V0Z"
              opacity="1"
            ></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="mb-10">
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, username, email, bio, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-indigo-600 text-lg">
              {filteredBloggers.length}
            </span>{" "}
            blogger{filteredBloggers.length !== 1 && "s"} found
          </p>
          {searchTerm && filteredBloggers.length > 0 && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              Clear search
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>

        {/* Bloggers Grid */}
        {filteredBloggers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No bloggers match your search
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search terms
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 px-5 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBloggers.map((blogger) => {
              const avatarUrl = getAvatarUrl(blogger);
              const hasImageError = imageErrors[blogger.id];
              const displayName = getDisplayName(blogger);
              const showDefaultImage = !avatarUrl || hasImageError;
              console.log(blogger?.profile?.created_at);

              return (
                <Link
                  to={`/author/${blogger.id}`}
                  key={blogger.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group block transform hover:-translate-y-1"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden bg-gray-100">
                    {showDefaultImage ? (
                      <DefaultBloggerImage name={displayName} />
                    ) : (
                      <img
                        src={avatarUrl!}
                        alt={displayName}
                        className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        onError={() => handleImageError(blogger.id)}
                      />
                    )}

                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Stats Badge */}
                    <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1.5">
                      <FiUsers className="w-3 h-3 text-white" />
                      <span className="text-white text-xs font-medium">
                        {getFollowerCount(blogger)}
                      </span>
                    </div>

                    {/* Join Year Badge */}
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md rounded-full px-2 py-0.5">
                      <span className="text-white text-[11px] font-medium">
                        since {blogger?.profile?.created_at?.split("-")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-gray-800 truncate">
                        {displayName}
                      </h3>
                      <p className="text-sm text-indigo-600 font-medium">
                        @{blogger.username}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-500 text-sm">
                        <FiMail
                          className="mr-2 flex-shrink-0 text-gray-400"
                          size={14}
                        />
                        <span className="truncate">{blogger.email}</span>
                      </div>

                      {blogger.profile?.location && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiMapPin
                            className="mr-2 flex-shrink-0 text-gray-400"
                            size={14}
                          />
                          <span className="truncate">
                            {blogger.profile.location}
                          </span>
                        </div>
                      )}

                      {blogger.profile?.phone && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiPhone
                            className="mr-2 flex-shrink-0 text-gray-400"
                            size={14}
                          />
                          <span className="truncate">
                            {blogger.profile.phone}
                          </span>
                        </div>
                      )}
                    </div>

                    {blogger.profile?.bio && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {blogger.profile.bio}
                        </p>
                      </div>
                    )}

                    {/* View Profile Button */}
                    <div className="mt-4 pt-2">
                      <div className="text-indigo-600 text-sm font-medium group-hover:text-indigo-700 transition-colors flex items-center gap-1">
                        View Profile
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bloggers;
