import React, { useState, useMemo } from "react";
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
} from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonCard from "./SkeletonCard";

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

const Bloggers: React.FC<BloggersProps> = ({
  bloggers = [],
  isLoading = false,
  error = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const filteredBloggers = useMemo(() => {
    if (!searchTerm.trim()) return bloggers;

    const term = searchTerm.toLowerCase();

    return bloggers.filter((b) => {
      const name = b.profile?.fullname?.toLowerCase() || "";
      return (
        b.username.toLowerCase().includes(term) ||
        b.email.toLowerCase().includes(term) ||
        name.includes(term) ||
        b.profile?.bio?.toLowerCase().includes(term) ||
        b.profile?.city?.toLowerCase().includes(term)
      );
    });
  }, [bloggers, searchTerm]);

  const getAvatarUrl = (images: ProfileImage[], bloggerId: number): string => {
    if (!images || images.length === 0) return "";
    if (imageErrors[bloggerId]) return "";

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
  const getFollowerCount = (b: Blogger) => b.followers?.length || 0;

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const clearSearch = () => setSearchTerm("");

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
        <div className="text-center">
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
      </div>
    );
  }

  const showEmptyState = filteredBloggers.length === 0;
  const totalBloggers = bloggers.length;
  const showingCount = filteredBloggers.length;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl bg-clip-text text-black italic font-medium mb-3">
            Bloggers Hub
          </h1>
          <p
            className="text-lg text-black max-w-2xl mx-auto"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            Discover amazing bloggers and connect with like-minded creators from
            around the world
          </p>
          {!showEmptyState && (
            <div className="mt-3 text-sm text-gray-500">
              Showing {showingCount} of {totalBloggers} bloggers
            </div>
          )}
        </div>

        <div className="mb-12 max-w-xl mx-auto relative">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, username, email, location, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-11 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
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
        </div>

        {/* BLOGGERS GRID */}
        {showEmptyState ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 text-gray-400 mb-4">
              <FiUser size={40} />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No bloggers found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or clear the filters
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredBloggers.map((blogger, idx) => {
                const img = getAvatarUrl(blogger.profile_images, blogger.id);
                const name = getDisplayName(blogger);
                const location = getLocation(blogger);
                const year = getJoinYear(blogger);
                const followerCount = getFollowerCount(blogger);

                return (
                  <motion.div
                    key={blogger.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link
                      to={`/bloggers/${blogger.id}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100">
                        {/* IMAGE SECTION */}
                        <div className="relative h-52 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
                          {img ? (
                            <img
                              src={img}
                              alt={name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={() => handleImageError(blogger.id)}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <div className="w-24 h-24 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                <FiUser size={48} className="text-indigo-500" />
                              </div>
                            </div>
                          )}

                          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs text-white flex items-center gap-1">
                            <FiUsers size={12} />
                            <span>
                              {followerCount}{" "}
                              {followerCount === 1 ? "follower" : "followers"}
                            </span>
                          </div>
                        </div>

                        {/* CONTENT SECTION */}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="mb-2">
                            <h3 className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors">
                              {name}
                            </h3>
                            <p className="text-indigo-500 text-sm font-medium">
                              @{blogger.username}
                            </p>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2 truncate">
                              <FiMail
                                className="flex-shrink-0 text-gray-400"
                                size={14}
                              />
                              <span className="truncate">{blogger.email}</span>
                            </div>

                            {location && (
                              <div className="flex items-center gap-2 truncate">
                                <FiMapPin
                                  className="flex-shrink-0 text-gray-400"
                                  size={14}
                                />
                                <span className="truncate">{location}</span>
                              </div>
                            )}
                          </div>

                          {/* BIO */}
                          {blogger.profile?.bio && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                              {blogger.profile.bio}
                            </p>
                          )}

                          {/* FOOTER */}
                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                            {year && (
                              <div className="text-xs text-gray-400 flex items-center gap-1">
                                <FiCalendar size={12} />
                                <span>Joined {year}</span>
                              </div>
                            )}
                            <div className="text-indigo-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                              View Profile
                              <FiBookOpen size={14} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
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
