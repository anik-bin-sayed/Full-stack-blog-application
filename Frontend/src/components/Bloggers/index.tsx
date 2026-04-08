import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiMapPin,
  FiUsers,
  FiBookOpen,
  FiCalendar,
  FiUserPlus,
  FiUserCheck,
  FiArrowUp,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// Types (same as original, but enhanced with sorting options)
// ============================================================================

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

// ============================================================================
// Improved Skeleton Card (matches new design)
// ============================================================================

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
      <div className="pt-6 pb-2 px-4 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-200" />
        <div className="mt-3 h-5 w-32 bg-gray-200 rounded-full" />
        <div className="mt-1 h-4 w-24 bg-gray-200 rounded-full" />
      </div>
      <div className="pb-4 px-4">
        <div className="mt-2 h-10 w-full bg-gray-200 rounded-lg" />
        <div className="mt-3 space-y-2">
          <div className="h-4 w-40 bg-gray-200 rounded-full mx-auto" />
          <div className="h-4 w-32 bg-gray-200 rounded-full mx-auto" />
        </div>
        <div className="mt-3 h-4 w-24 bg-gray-200 rounded-full mx-auto" />
        <div className="mt-4 h-10 w-full bg-gray-200 rounded-lg" />
        <div className="mt-3 h-4 w-28 bg-gray-200 rounded-full mx-auto" />
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

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

  // Helper: get follower count
  const getFollowerCount = useCallback(
    (b: Blogger) => b.followers?.length || 0,
    [],
  );

  // Sorting + filtering
  const processedBloggers = useMemo(() => {
    // 1. Filter
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

    // 2. Sort
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

  // Stats for header
  const totalBloggers = bloggers.length;
  const totalFollowers = useMemo(
    () => bloggers.reduce((sum, b) => sum + getFollowerCount(b), 0),
    [bloggers, getFollowerCount],
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
            <FiUserPlus size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Unable to load bloggers
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
          >
            Try again
          </button>
        </motion.div>
      </div>
    );
  }

  const showEmptyState = processedBloggers.length === 0;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* MODERN HERO SECTION with animated gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-12 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-white/50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 animate-pulse" />
          <div className="relative px-6 py-10 text-center">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-5xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-3"
            >
              Bloggers Hub
            </motion.h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Connect with talented writers, share ideas, and grow your network
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-5 py-2 text-indigo-700 font-medium shadow-sm">
                <FiUsers size={18} />
                <span>{totalBloggers} active bloggers</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-5 py-2 text-purple-700 font-medium shadow-sm">
                <FiTrendingUp size={18} />
                <span>{totalFollowers} total followers</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SEARCH + SORT BAR */}
        <div className="mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search bloggers by name, username, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <RxCross1 size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-gray-100">
            <span className="text-sm text-gray-500 px-2">Sort by:</span>
            {[
              { value: "followers", label: "Most Followers", icon: FiAward },
              { value: "newest", label: "Newest", icon: FiCalendar },
              { value: "name", label: "Name", icon: FiArrowUp },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  sortBy === option.value
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <option.icon size={14} />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {!showEmptyState && searchTerm && (
          <div className="text-center -mt-6 mb-6 text-sm text-gray-500">
            Found {processedBloggers.length} blogger
            {processedBloggers.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* BLOGGERS GRID - Premium Cards */}
        {showEmptyState ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 text-gray-400 mb-4">
              <FiUser size={48} />
            </div>
            <h3 className="text-2xl font-medium text-gray-700 mb-2">
              No bloggers found
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Try adjusting your search or clear the filters
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition transform hover:scale-105"
              >
                Clear search
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            <AnimatePresence>
              {processedBloggers.map((blogger, idx) => {
                const avatarUrl = getAvatarUrl(
                  blogger.profile_images,
                  blogger.id,
                );
                const name = getDisplayName(blogger);
                const location = getLocation(blogger);
                const year = getJoinYear(blogger);
                const followerCount = getFollowerCount(blogger);
                const isFollowed = followedUsers[blogger.id] || false;
                const initials = getInitials(name);

                return (
                  <motion.div
                    key={blogger.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    whileHover={{ y: -6 }}
                    className="group"
                  >
                    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
                      {/* Subtle gradient top bar */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

                      {/* AVATAR SECTION */}
                      <div className="relative pt-8 pb-3 px-4 flex flex-col items-center">
                        <div className="relative">
                          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 p-1 shadow-lg group-hover:shadow-indigo-200 transition-shadow">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={name}
                                className="w-full h-full rounded-full object-cover"
                                onError={() => handleImageError(blogger.id)}
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                                {initials || <FiUser size={32} />}
                              </div>
                            )}
                          </div>
                          {/* Decorative online indicator with pulse */}
                          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white ring-2 ring-green-300 animate-pulse" />
                        </div>

                        <div className="mt-4 text-center">
                          <h3 className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors">
                            <Link to={`/bloggers/${blogger.id}`}>{name}</Link>
                          </h3>
                          <p className="text-gray-500 text-sm mt-0.5">
                            @{blogger.username}
                          </p>
                        </div>
                      </div>

                      {/* CONTENT CARD */}
                      <div className="pb-5 px-5">
                        {blogger.profile?.bio && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2 text-center leading-relaxed">
                            {blogger.profile.bio}
                          </p>
                        )}

                        <div className="mt-4 space-y-2 text-sm text-gray-500">
                          <div className="flex items-center  gap-2 truncate">
                            <FiMail
                              size={14}
                              className="flex-shrink-0 text-gray-400"
                            />
                            <span className="truncate">{blogger.email}</span>
                          </div>
                          {location && (
                            <div className="flex items-center  gap-2 truncate">
                              <FiMapPin
                                size={14}
                                className="flex-shrink-0 text-gray-400"
                              />
                              <span className="truncate">{location}</span>
                            </div>
                          )}
                          {year && (
                            <div className="flex items-center  gap-2">
                              <FiCalendar size={14} className="text-gray-400" />
                              <span>Joined {year}</span>
                            </div>
                          )}
                        </div>

                        {/* Follower count with nicer formatting */}
                        <div className="mt-4 flex items-center gap-1.5 text-sm">
                          <FiUsers size={16} className="text-indigo-400" />
                          <span className="font-semibold text-gray-800">
                            {followerCount.toLocaleString()}
                          </span>
                          <span className="text-gray-500">
                            {followerCount === 1 ? "follower" : "followers"}
                          </span>
                        </div>

                        {/* FOLLOW BUTTON with animation */}
                        <motion.div className="mt-4" whileTap={{ scale: 0.97 }}>
                          <button
                            onClick={(e) => handleFollowToggle(e, blogger.id)}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${
                              isFollowed
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg"
                            }`}
                          >
                            {isFollowed ? (
                              <>
                                <FiUserCheck
                                  size={16}
                                  className="text-green-600"
                                />{" "}
                                Following
                              </>
                            ) : (
                              <>
                                <FiUserPlus size={16} /> Follow
                              </>
                            )}
                          </button>
                        </motion.div>

                        <div className="mt-4 text-center">
                          <Link
                            to={`/bloggers/${blogger.id}`}
                            className="inline-flex items-center gap-1.5 text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-all group/link"
                          >
                            View full profile{" "}
                            <FiBookOpen
                              size={14}
                              className="group-hover/link:translate-x-1 transition-transform"
                            />
                          </Link>
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
