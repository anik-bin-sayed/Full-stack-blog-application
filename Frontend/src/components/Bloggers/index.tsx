import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiUsers,
  FiCalendar,
  FiUserPlus,
  FiArrowUp,
  FiTrendingUp,
  FiAward,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";

interface Profile {
  fullname: string;
  bio?: string;
  phone?: string;
  city?: string;
  country?: string;
  created_at: string;
  website?: string;
}

interface ProfileImage {
  id: number;
  image: string;
  is_current: boolean;
  uploaded_at: string;
}

type UserBasic = {
  id: number;
  username: string;
  email: string;
};

type Follower = {
  id: number;
  created_at: string;
  follower: UserBasic;
  following: UserBasic;
};

type Followers = Follower[];

interface Blogger {
  id: number;
  username: string;
  email: string;
  profile: Profile | null;
  profile_images: ProfileImage[];
  followers: Followers;
}

interface BloggersProps {
  bloggers?: Blogger[];
  isLoading?: boolean;
  error?: string | null;
}

type SortOption = "newest" | "followers" | "name";

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="p-6 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-gray-200" />
        <div className="mt-4 h-5 bg-gray-200 rounded w-32" />
        <div className="mt-1 h-4 bg-gray-200 rounded w-24" />
        <div className="mt-3 h-10 bg-gray-200 rounded w-full" />
        <div className="mt-3 flex justify-center gap-3">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="mt-3 h-9 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
};

const Bloggers: React.FC<BloggersProps> = ({
  bloggers = [],
  isLoading = false,
  error = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [followedUsers, setFollowedUsers] = useState<Record<number, boolean>>(
    {},
  );
  const [sortBy, setSortBy] = useState<SortOption>("followers");

  const getFollowerCount = useCallback(
    (b: Blogger) => b.followers?.length || 0,
    [],
  );

  const processedBloggers = useMemo(() => {
    let filtered = bloggers;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = bloggers.filter((b) => {
        const name = b.profile?.fullname?.toLowerCase() || "";
        return (
          b.username.toLowerCase().includes(term) ||
          b.email.toLowerCase().includes(term) ||
          name.includes(term) ||
          b.profile?.bio?.toLowerCase().includes(term) ||
          b.profile?.city?.toLowerCase().includes(term)
        );
      });
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case "newest":
        sorted.sort((a, b) => {
          const dateA = a.profile?.created_at
            ? new Date(a.profile.created_at).getTime()
            : 0;
          const dateB = b.profile?.created_at
            ? new Date(b.profile.created_at).getTime()
            : 0;
          return dateB - dateA;
        });
        break;
      case "followers":
        sorted.sort((a, b) => getFollowerCount(b) - getFollowerCount(a));
        break;
      case "name":
        sorted.sort((a, b) => {
          const nameA = a.profile?.fullname || a.username;
          const nameB = b.profile?.fullname || b.username;
          return nameA.localeCompare(nameB);
        });
        break;
    }
    return sorted;
  }, [bloggers, searchTerm, sortBy, getFollowerCount]);

  const getAvatarUrl = (images: ProfileImage[], bloggerId: number): string => {
    if (!images?.length || imageErrors[bloggerId]) return "";
    const current = images.find((img) => img.is_current);
    const imagePath = current?.image || images[0]?.image;
    if (!imagePath) return "";
    return `https://res.cloudinary.com/dtuxqsiuc/${imagePath}`;
  };

  const getDisplayName = (b: Blogger) => b.profile?.fullname || b.username;
  const getLocation = (b: Blogger) => {
    if (!b.profile) return null;
    return [b.profile.city, b.profile.country].filter(Boolean).join(", ");
  };
  const getJoinYear = (b: Blogger) => {
    if (!b.profile?.created_at) return null;
    return new Date(b.profile.created_at).getFullYear();
  };

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const clearSearch = () => setSearchTerm("");

  const handleFollowToggle = (e: React.MouseEvent, bloggerId: number) => {
    e.preventDefault();
    setFollowedUsers((prev) => ({ ...prev, [bloggerId]: !prev[bloggerId] }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const totalBloggers = bloggers.length;
  const totalFollowers = useMemo(
    () => bloggers.reduce((sum, b) => sum + getFollowerCount(b), 0),
    [bloggers, getFollowerCount],
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
          <FiUserPlus size={32} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Unable to load bloggers
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Try again
        </button>
      </div>
    );
  }

  const showEmptyState = processedBloggers.length === 0;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bloggers Hub</h1>
              <p className="text-sm text-gray-500">
                Connect with talented writers
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1.5">
                <FiUsers size={14} className="text-indigo-500" />
                <span className="font-medium">{totalBloggers}</span>
                <span className="text-gray-500">bloggers</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1.5">
                <FiTrendingUp size={14} className="text-purple-500" />
                <span className="font-medium">{totalFollowers}</span>
                <span className="text-gray-500">followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search + Sort Bar */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-6 flex flex-wrap items-center gap-3 sticky top-16 z-10">
          <div className="flex-1 min-w-[200px] relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search bloggers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <RxCross1 size={12} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 mr-1">Sort:</span>
            {[
              { value: "followers", label: "Popular", icon: FiAward },
              { value: "newest", label: "Newest", icon: FiCalendar },
              { value: "name", label: "Name", icon: FiArrowUp },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  sortBy === option.value
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <option.icon size={12} />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!showEmptyState && searchTerm && (
          <div className="text-sm text-gray-500 mb-4">
            {processedBloggers.length} result
            {processedBloggers.length !== 1 && "s"}
          </div>
        )}

        {/* Cards Grid - Large profile image, no cover */}
        {showEmptyState ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FiUser size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">
              No bloggers found
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your search
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {processedBloggers.map((blogger, idx) => {
                const avatarUrl = getAvatarUrl(
                  blogger.profile_images,
                  blogger.id,
                );
                const name = getDisplayName(blogger);
                const location = getLocation(blogger);
                const followerCount = getFollowerCount(blogger);
                const isFollowed = followedUsers[blogger.id] || false;
                const initials = getInitials(name);
                const joinYear = getJoinYear(blogger);

                return (
                  <motion.div
                    key={blogger.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    className="h-full"
                  >
                    <div className="bg-white hover:outline outline-indigo-50 rounded-md shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full max-w-2xs">
                      <div className="flex justify-center">
                        <Link to={`/bloggers/${blogger.id}`}>
                          <div className=" overflow-hidden bg-gradient-to-tr from-indigo-100 to-purple-100 shadow-md">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={name}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(blogger.id)}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                {initials}
                              </div>
                            )}
                          </div>
                        </Link>
                      </div>
                      <div className="mt-4 ">
                        <div className="text-center">
                          <Link to={`/bloggers/${blogger.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition text-lg">
                              {name}
                            </h3>
                          </Link>
                          <p className="text-gray-500 text-sm">
                            @{blogger.username}
                          </p>
                        </div>

                        {/* Details row */}
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                          {location && (
                            <span className="flex items-center gap-1">
                              <FiMapPin size={12} /> {location}
                            </span>
                          )}
                          {joinYear && (
                            <span className="flex items-center gap-1">
                              <FiCalendar size={12} /> Joined {joinYear}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <FiUsers size={12} /> {followerCount} followers
                          </span>
                        </div>

                        {/* Follow Button */}
                        <div className="my-4 px-4">
                          <button
                            onClick={(e) => handleFollowToggle(e, blogger.id)}
                            className={`cursor-pointer w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
    ${
      isFollowed
        ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:shadow-sm"
        : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
    }`}
                          >
                            {isFollowed ? <>✓ Following</> : <>+ Follow</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bloggers;
