import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetUserProfileQuery } from "../../features/profile/profileApi";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiCalendar,
  FiUsers,
  FiBookOpen,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiLink,
  FiBriefcase,
  FiFlag,
  FiHeart,
  FiUserPlus,
} from "react-icons/fi";
import { motion } from "framer-motion";

// ================= TYPES (based on actual API response) =================

interface Profile {
  bio: string;
  fullname: string;
  phone: string;
  birthdate: string;
  gender: string;
  language: string;
  timezone: string;
  address: string;
  city: string;
  country: string;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
  portfolio_url: string;
  social_links: Record<string, string>;
  language_preference: string;
  dark_mode_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface ProfileImage {
  id: number;
  image: string;
  is_current: boolean;
  uploaded_at: string;
}

interface CoverImage {
  id: number;
  image: string;
  is_current: boolean;
  uploaded_at: string;
}

interface FollowerUser {
  id: number;
  username: string;
  email: string;
}

interface FollowRelation {
  id: number;
  follower: FollowerUser;
  following: FollowerUser;
  created_at: string;
}

interface Blogger {
  id: number;
  username: string;
  email: string;
  profile: Profile;
  profile_images: ProfileImage[];
  cover_images: CoverImage[];
  followers: FollowRelation[];
  following: FollowRelation[];
}

// ================= HELPER COMPONENTS =================

const SocialLink: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
}> = ({ href, icon, label }) => {
  if (!href) return null;
  return (
    <a
      href={href.startsWith("http") ? href : `https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition group"
    >
      <span className="text-indigo-500">{icon}</span>
      <span className="text-sm group-hover:underline">{label}</span>
    </a>
  );
};

// ================= MAIN COMPONENT =================

const AuthorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [imageError, setImageError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const {
    data: blogger,
    isLoading,
    error,
  } = useGetUserProfileQuery(Number(id), {
    skip: !id,
  });
  // console.log(blogger[0].email);

  // Helper: Get avatar URL
  const getAvatarUrl = (): string => {
    if (!blogger?.profile_images || imageError) return "";
    const current = blogger.profile_images.find((img) => img.is_current);
    const imagePath = current?.image || blogger.profile_images[0]?.image;
    console.log(imagePath);

    if (!imagePath) return "";
    return `https://res.cloudinary.com/dtuxqsiuc/${imagePath}`;
  };

  // Helper: Get cover image URL
  const getCoverUrl = (): string => {
    if (!blogger?.cover_images || coverError) return "";
    const current = blogger.cover_images.find((img) => img.is_current);
    const imagePath = current?.image || blogger.cover_images[0]?.image;
    if (!imagePath) return "";
    return `https://res.cloudinary.com/dtuxqsiuc/${imagePath}`;
  };

  // Helper: Get full location string
  const getFullLocation = (): string => {
    if (!blogger?.profile) return "";
    const parts = [];
    if (blogger[0].profile.address) parts.push(blogger.profile.address);
    if (blogger.profile.city) parts.push(blogger.profile.city);
    if (blogger.profile.country) parts.push(blogger.profile.country);
    return parts.join(", ");
  };

  // Helper: Format join date
  const getFormattedJoinDate = (): string => {
    if (!blogger?.profile?.created_at) return "";
    return new Date(blogger.profile.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper: Format birthdate
  const getFormattedBirthdate = (): string => {
    if (!blogger?.profile?.birthdate) return "";
    return new Date(blogger.profile.birthdate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Counts

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-10 w-24 bg-gray-200 rounded-lg mb-6" />
            <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl mb-8" />
            <div className="flex flex-col items-center -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg" />
              <div className="h-7 w-48 bg-gray-200 rounded mt-4" />
              <div className="h-5 w-32 bg-gray-200 rounded mt-2" />
            </div>
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="h-8 w-16 bg-gray-200 rounded mx-auto" />
                <div className="h-4 w-20 bg-gray-200 rounded mt-1" />
              </div>
              <div className="text-center">
                <div className="h-8 w-16 bg-gray-200 rounded mx-auto" />
                <div className="h-4 w-20 bg-gray-200 rounded mt-1" />
              </div>
            </div>
            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or not found
  if (error || !blogger) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-500 mb-4">
            <FiUser size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Author not found
          </h2>
          <p className="text-gray-500 mb-6">
            The blogger you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/bloggers"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <FiArrowLeft /> Back to Bloggers
          </Link>
        </div>
      </div>
    );
  }

  const avatarUrl = getAvatarUrl();
  const coverUrl = getCoverUrl();
  const email = blogger[0]?.email;
  const displayName = blogger[0]?.profile?.fullname || blogger[0]?.username;
  const bio = blogger[0]?.profile?.bio;
  const location = getFullLocation();
  const joinDate = getFormattedJoinDate();
  const birthdate = getFormattedBirthdate();
  const website = blogger[0]?.profile?.website;
  const linkedin = blogger[0]?.profile?.linkedin;
  const github = blogger[0]?.profile?.github;
  const twitter = blogger[0]?.profile?.twitter;
  const portfolioUrl = blogger[0]?.profile?.portfolio_url;
  const gender = blogger[0]?.profile?.gender;
  const language = blogger[0]?.profile?.language;
  const phone = blogger[0]?.profile?.phone;
  const followerCount = blogger?.followers?.length || 0;
  const followingCount = blogger?.following?.length || 0;

  console.log(avatarUrl);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          to="/bloggers"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition mb-6 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Bloggers
        </Link>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {coverUrl && !coverError ? (
              <img
                src={coverUrl}
                alt="Cover"
                className="w-full h-full object-cover"
                onError={() => setCoverError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            )}
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center -mt-16 mb-4">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-indigo-100 border-4 border-white shadow-lg flex items-center justify-center">
                  <FiUser size={48} className="text-indigo-500" />
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              {displayName}
            </h1>
            <p className="text-indigo-600 font-medium">@{blogger.username}</p>
          </div>

          {/* Stats Row */}
          <div className="flex justify-center gap-8 py-4 border-t border-b border-gray-100">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">
                {followerCount}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <FiUsers size={14} /> Followers
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">
                {followingCount}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <FiUserPlus size={14} /> Following
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Bio */}
            {bio && (
              <div className="text-center max-w-2xl mx-auto">
                <p className="text-gray-600 leading-relaxed">{bio}</p>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="flex items-center gap-3 text-gray-600">
                <FiMail className="text-indigo-500 flex-shrink-0" size={18} />
                <span className="break-all">{email}</span>
              </div>

              {/* Phone */}
              {phone && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FiPhone
                    className="text-indigo-500 flex-shrink-0"
                    size={18}
                  />
                  <span>{phone}</span>
                </div>
              )}

              {/* Location */}
              {location && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FiMapPin
                    className="text-indigo-500 flex-shrink-0"
                    size={18}
                  />
                  <span className="truncate">{location}</span>
                </div>
              )}

              {/* Gender */}
              {gender && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FiFlag className="text-indigo-500 flex-shrink-0" size={18} />
                  <span>{gender}</span>
                </div>
              )}

              {/* Language */}
              {language && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FiGlobe
                    className="text-indigo-500 flex-shrink-0"
                    size={18}
                  />
                  <span>{language}</span>
                </div>
              )}

              {/* Birthdate */}
              {birthdate && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FiCalendar
                    className="text-indigo-500 flex-shrink-0"
                    size={18}
                  />
                  <span>Born {birthdate}</span>
                </div>
              )}

              {/* Join Date */}
              {joinDate && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FiHeart
                    className="text-indigo-500 flex-shrink-0"
                    size={18}
                  />
                  <span>Joined {joinDate}</span>
                </div>
              )}
            </div>

            {/* Social Links Section */}
            {(website || linkedin || github || twitter || portfolioUrl) && (
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FiLink /> Connect & Social
                </h3>
                <div className="flex flex-wrap gap-4">
                  {website && (
                    <SocialLink
                      href={website}
                      icon={<FiGlobe size={16} />}
                      label="Website"
                    />
                  )}
                  {github && (
                    <SocialLink
                      href={github}
                      icon={<FiGithub size={16} />}
                      label="GitHub"
                    />
                  )}
                  {linkedin && (
                    <SocialLink
                      href={linkedin}
                      icon={<FiLinkedin size={16} />}
                      label="LinkedIn"
                    />
                  )}
                  {twitter && (
                    <SocialLink
                      href={twitter}
                      icon={<FiTwitter size={16} />}
                      label="Twitter"
                    />
                  )}
                  {portfolioUrl && (
                    <SocialLink
                      href={portfolioUrl}
                      icon={<FiBriefcase size={16} />}
                      label="Portfolio"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Gallery: Profile Images (if multiple) */}
            {blogger.profile_images && blogger.profile_images.length > 1 && (
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Profile Gallery
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {blogger.profile_images.map((img) => (
                    <img
                      key={img.id}
                      src={`https://res.cloudinary.com/dtuxqsiuc/${img.image}`}
                      alt="Profile"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 hover:border-indigo-500 transition cursor-pointer"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 pt-0 flex justify-center gap-4">
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center gap-2">
              <FiBookOpen /> View Posts
            </button>
            <button className="px-6 py-2.5 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition flex items-center gap-2">
              <FiUsers /> Follow
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthorProfile;
