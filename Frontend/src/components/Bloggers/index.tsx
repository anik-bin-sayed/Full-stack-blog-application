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
  FiHeart,
  FiBookmark,
} from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../Loader";
import { getImageUrl, getInitials } from "../../helper";
import Error from "../Error";
import BloggersSkeleton from "../Skeletons/BloggersSkeleton";

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

  const getDisplayName = (b: Blogger) => b.profile?.fullname || b.username;
  const getLocation = (b: Blogger) => {
    if (!b.profile) return null;
    return [b.profile.city, b.profile.country].filter(Boolean).join(", ");
  };
  const getJoinYear = (b: Blogger) => {
    if (!b.profile?.created_at) return null;
    return new Date(b.profile.created_at).getFullYear();
  };
  const getBioPreview = (b: Blogger) => {
    if (!b.profile?.bio) return null;
    return b.profile.bio.length > 80
      ? `${b.profile.bio.substring(0, 80)}...`
      : b.profile.bio;
  };

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const clearSearch = () => setSearchTerm("");

  const handleFollowToggle = (e: React.MouseEvent, bloggerId: number) => {
    e.preventDefault();
    setFollowedUsers((prev) => ({ ...prev, [bloggerId]: !prev[bloggerId] }));
  };

  const totalBloggers = bloggers.length;
  const totalFollowers = useMemo(
    () => bloggers.reduce((sum, b) => sum + getFollowerCount(b), 0),
    [bloggers, getFollowerCount],
  );

  if (isLoading) return <BloggersSkeleton />;
  if (error) return <Error />;

  const showEmptyState = processedBloggers.length === 0;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Bloggers Hub
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Connect with talented writers & creators
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 shadow-inner">
                <FiUsers size={14} className="text-indigo-500" />
                <span className="font-semibold text-gray-800">
                  {totalBloggers}
                </span>
                <span className="text-gray-500">bloggers</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 shadow-inner">
                <FiTrendingUp size={14} className="text-purple-500" />
                <span className="font-semibold text-gray-800">
                  {totalFollowers}
                </span>
                <span className="text-gray-500">followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search + Sort Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-4 mb-8 flex flex-col md:flex-row md:items-center gap-4 sticky top-20 z-10 border border-gray-100">
          <div className="flex-1 relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, username, bio, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-white rounded-full p-0.5"
              >
                <RxCross1 size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium mr-1">
              Sort by:
            </span>
            <div className="flex gap-1.5">
              {[
                { value: "followers", label: "Popular", icon: FiAward },
                { value: "newest", label: "Newest", icon: FiCalendar },
                { value: "name", label: "Name", icon: FiArrowUp },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as SortOption)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    sortBy === option.value
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <option.icon size={12} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        {!showEmptyState && searchTerm && (
          <div className="text-sm text-gray-500 mb-5 flex items-center gap-2">
            <FiSearch size={12} />
            <span>
              {processedBloggers.length} result
              {processedBloggers.length !== 1 && "s"} found
            </span>
          </div>
        )}

        {/* Cards Grid */}
        {showEmptyState ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser size={36} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No bloggers found
            </h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any bloggers matching your search.
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-7">
            <AnimatePresence>
              {processedBloggers.map((blogger) => {
                const avatarUrl = getImageUrl(
                  blogger?.profile_images?.[0]?.image,
                );
                const name = getDisplayName(blogger);
                const location = getLocation(blogger);
                const followerCount = getFollowerCount(blogger);
                const isFollowed = followedUsers[blogger.id] || false;
                const initials = getInitials(name);
                const joinYear = getJoinYear(blogger);
                const bioPreview = getBioPreview(blogger);

                return (
                  <motion.div
                    key={blogger.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-indigo-100"
                  >
                    <Link
                      to={`/bloggers/${blogger.id}`}
                      className="block overflow-hidden"
                    >
                      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={() => handleImageError(blogger.id)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                              {initials}
                            </div>
                          </div>
                        )}
                        {/* Follower Badge Overlay */}
                        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1.5 text-white text-xs font-medium">
                          <FiUsers size={10} />
                          <span>{followerCount}</span>
                        </div>
                      </div>
                    </Link>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="text-center">
                        <Link to={`/bloggers/${blogger.id}`}>
                          <h3 className="font-bold text-gray-800 hover:text-indigo-600 transition text-lg line-clamp-1">
                            {name}
                          </h3>
                        </Link>
                        <p className="text-gray-400 text-sm mt-0.5">
                          @{blogger.username}
                        </p>
                      </div>

                      {/* Bio Preview */}
                      {bioPreview && (
                        <p className="text-gray-500 text-xs text-center mt-3 line-clamp-2 leading-relaxed">
                          {bioPreview}
                        </p>
                      )}

                      {/* Details Row */}
                      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-4 text-xs text-gray-400">
                        {location && (
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                            <FiMapPin size={11} /> {location}
                          </span>
                        )}
                        {joinYear && (
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                            <FiCalendar size={11} /> {joinYear}
                          </span>
                        )}
                      </div>

                      {/* Follow Button */}
                      <div className="mt-5 pt-1">
                        <button
                          onClick={(e) => handleFollowToggle(e, blogger.id)}
                          className={`cursor-pointer w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                            isFollowed
                              ? "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:shadow-sm"
                              : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95"
                          }`}
                        >
                          {isFollowed ? (
                            <>
                              <FiHeart size={14} className="fill-current" />{" "}
                              Following
                            </>
                          ) : (
                            <>
                              <FiUserPlus size={14} /> Follow
                            </>
                          )}
                        </button>
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
