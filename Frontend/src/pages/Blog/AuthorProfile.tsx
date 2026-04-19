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
  FiBriefcase,
  FiFlag,
  FiHeart,
  FiUserPlus,
  FiGrid,
  FiInfo,
  FiUserCheck,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuthorRecentBlogsQuery } from "../../features/blogs/blogApi";
import AuthorProfilePost from "../../components/profile/AuthorProfilePost";
import { formatDate, getImageUrl, getLocation } from "../../helper";
import Error from "../../components/Error";

import defaultCoverImage from "../../assets/default_cover_image.png";

type TabType = "posts" | "about" | "friends" | "photos";

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
      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition group"
    >
      <span className="text-blue-500">{icon}</span>
      <span className="text-sm group-hover:underline">{label}</span>
    </a>
  );
};

const FriendAvatar: React.FC<{ username: string; email: string }> = ({
  username,
  email,
}) => {
  const initial = username?.charAt(0)?.toUpperCase() || "U";
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
        {initial}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-800 text-sm">@{username}</p>
        <p className="text-xs text-gray-500">{email}</p>
      </div>
      <button className="text-blue-600 text-xs font-medium hover:underline">
        Follow
      </button>
    </div>
  );
};

const AuthorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [coverError, setCoverError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("posts");

  const {
    data: blogger,
    isLoading,
    error,
  } = useGetUserProfileQuery(Number(id), {
    skip: !id,
  });

  const { data: authorProfileRecentPost } = useAuthorRecentBlogsQuery(
    { id: Number(id) },
    { skip: !id },
  );
  const user = Array.isArray(blogger) ? blogger[0] : blogger;

  const email = user?.email;
  const displayName = user?.profile?.fullname || user?.username;
  const bio = user?.profile?.bio;
  const location = getLocation(user?.profile);
  const joinDate = formatDate(user?.profile.created_at);
  const birthdate = formatDate(user?.profile.birthdate);
  const website = user?.profile?.website;
  const linkedin = user?.profile?.linkedin;
  const github = user?.profile?.github;
  const twitter = user?.profile?.twitter;
  const portfolioUrl = user?.profile?.portfolio_url;
  const gender = user?.profile?.gender;
  const language = user?.profile?.language;
  const phone = user?.profile?.phone;
  const followerCount = user?.followers?.length || 0;
  const followingCount = user?.following?.length || 0;
  const username = user?.username;

  const currentProfile = user?.profile_images.find(
    (img: { is_current: boolean }) => img.is_current,
  );
  const profilePath = currentProfile?.image || user?.profile_images[0]?.image;
  const avatarUrl = getImageUrl(profilePath);

  const currentCoverImage = user?.cover_images.find(
    (img: { is_current: boolean }) => img.is_current,
  );

  const imagePathCoverImage = currentCoverImage?.image;
  const coverUrl = getImageUrl(imagePathCoverImage) || defaultCoverImage;

  if (isLoading)
    return (
      <div className=" flex items-center h-screen justify-center p-8">
        {" "}
        <p>Loading...</p>{" "}
      </div>
    );
  if (error || !user) return <Error />;

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="space-y-6">
            {bio && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2">Bio</h3>
                <p className="text-gray-600 leading-relaxed">{bio}</p>
              </div>
            )}

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {email && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiMail className="text-blue-500" size={18} />
                    <span className="break-all">{email}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiPhone className="text-blue-500" size={18} />
                    <span>{phone}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiMapPin className="text-blue-500" size={18} />
                    <span>{location}</span>
                  </div>
                )}
                {gender && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiFlag className="text-blue-500" size={18} />
                    <span>{gender}</span>
                  </div>
                )}
                {language && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiGlobe className="text-blue-500" size={18} />
                    <span>{language}</span>
                  </div>
                )}
                {birthdate && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiCalendar className="text-blue-500" size={18} />
                    <span>Born {birthdate}</span> adf
                  </div>
                )}
                {joinDate && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiHeart className="text-blue-500" size={18} />
                    <span>Joined {joinDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(website || linkedin || github || twitter || portfolioUrl) && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Social Profiles
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
          </div>
        );

      case "friends":
        return (
          <div className="space-y-6">
            {/* Followers */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiUserCheck className="text-blue-500" /> Followers (
                {followerCount})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {user.followers && user.followers.length > 0 ? (
                  user.followers.map((rel) => (
                    <FriendAvatar
                      key={rel.id}
                      username={rel.follower.username}
                      email={rel.follower.email}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No followers yet.
                  </p>
                )}
              </div>
            </div>

            {/* Following */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiUserPlus className="text-blue-500" /> Following (
                {followingCount})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {user.following && user.following.length > 0 ? (
                  user.following.map((rel) => (
                    <FriendAvatar
                      key={rel.id}
                      username={rel.following.username}
                      email={rel.following.email}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Not following anyone yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "posts":
      default:
        return (
          <>
            {authorProfileRecentPost ? (
              <AuthorProfilePost
                authorProfileRecentPost={authorProfileRecentPost}
              />
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <FiBookOpen className="mx-auto text-gray-400 text-4xl mb-3" />
                <h3 className="text-lg font-medium text-gray-700">
                  No posts yet
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Blog posts from {displayName} will appear here.
                </p>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/bloggers"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-4 group text-sm"
        >
          <FiArrowLeft
            className="group-hover:-translate-x-1 transition-transform"
            size={16}
          />
          Back to Bloggers
        </Link>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          {/* Cover Photo */}
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-indigo-600">
            {coverUrl && !coverError ? (
              <img
                src={coverUrl}
                alt="Cover"
                className="w-full h-full object-cover"
                onError={() => setCoverError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600" />
            )}
          </div>

          {/* Profile Picture & Actions */}
          <div className="relative px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-12 md:-mt-16 mb-4">
              <div className="flex items-end gap-4">
                <div className="relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
                    />
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-indigo-100 border-4 border-white shadow-md flex items-center justify-center">
                      <FiUser size={48} className="text-indigo-500" />
                    </div>
                  )}
                </div>
                <div className="pb-2">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    {displayName}
                  </h1>
                  <p className="text-gray-500 text-sm">@{username}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
                  <FiUserPlus size={16} /> Follow
                </button>
              </div>
            </div>

            {/* Stats Row (Friends style) */}
            <div className="flex gap-6 py-3 border-t border-gray-100 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <FiUsers size={16} />
                <span className="font-semibold text-gray-800">
                  {followerCount}
                </span>
                <span>followers</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <FiUserPlus size={16} />
                <span className="font-semibold text-gray-800">
                  {followingCount}
                </span>
                <span>following</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200 mt-2">
            <div className="flex overflow-x-auto px-4 md:px-6">
              {[
                { id: "posts", label: "Posts", icon: FiGrid },
                { id: "about", label: "About", icon: FiInfo },
                { id: "friends", label: "Friends", icon: FiUsers },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition border-b-2 cursor-pointer ${
                      isActive
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-6 bg-gray-50">{renderTabContent()}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthorProfile;
