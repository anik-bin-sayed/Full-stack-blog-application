import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiTwitter,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiPhone,
  FiLock,
  FiBookOpen,
  FiUsers,
  FiHeart,
  FiPlus,
  FiBriefcase,
  FiThumbsUp,
  FiMessageCircle,
  FiShare2,
  FiCamera,
  FiImage,
  FiGrid,
} from "react-icons/fi";
import { useAppSelector } from "../../redux/hooks";
import {
  useCoverPhotoQuery,
  useGetMeQuery,
  useProfilePhotoQuery,
} from "../../features/profile/profileApi";
import Loader from "../../components/Loader";
import default_profile_Image from "../../assets/default_profile_image.png";
import default_cover_Image from "../../assets/default_cover_image.png";
import ProfileEditModal from "./UserProfileEdit";
import ChangePasswordModal from "../../components/common/Modals/ChangePassword";
import ProfileImages from "../../components/media/ProfileImages";
import CoverImages from "../../components/media/CoverImages";
import CoverImage from "../../components/common/Modals/CoverImage";
import ProfileImage from "../../components/common/Modals/ProfileImage";
import ProfileRecentPost from "../../components/profile/ProfileRecentPost";
import { useProfileRecentPostQuery } from "../../features/blogs/blogApi";
import { getLocation } from "../../helper";
import Error from "../../components/Error";
import NotAuthenticate from "../../components/NotAuthenticate";

const formatDate = (dateString?: string) => {
  if (!dateString) return "Recently";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const UserProfile: React.FC = () => {
  const [profileImageModal, setProfileImageModal] = useState(false);
  const [coverImageModal, setCoverImageModal] = useState(false);

  const [imageSection, SetImageSection] = useState("profile");

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "about" | "photos">(
    "posts",
  );

  const { data: currentProfile } = useProfilePhotoQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: currentCover } = useCoverPhotoQuery(undefined, {
    skip: !isAuthenticated,
  });

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    refetch,
  } = useGetMeQuery(undefined, { skip: !isAuthenticated });

  const { data, isLoading, error } = useProfileRecentPostQuery();

  if (!isAuthenticated) return <NotAuthenticate />;
  if (userLoading) return <Loader />;
  if (userError) return <Error />;
  if (!user) return null;

  const profile = user.profile || {};
  const fullName = profile.fullname || user.username;
  const email = user.email || "";
  const joinDate = formatDate(profile.created_at);
  const location = getLocation(profile);
  const bio = profile.bio || "";
  const followerCount = user.followers?.length || 0;
  const followingCount = user.following?.length || 0;

  const socials = {
    twitter: profile.twitter || "",
    github: profile.github || "",
    linkedin: profile.linkedin || "",
    website: profile.website || profile.portfolio_url || "",
    email: email,
  };

  const phone = profile.phone || "";
  const gender = profile.gender || "";
  const language = profile.language || "";
  const company = profile.company || "";

  const aboutDetails = [
    { icon: FiBriefcase, label: "Company", value: company },
    { icon: FiMapPin, label: "Location", value: location },
    { icon: FiCalendar, label: "Joined", value: joinDate },
    { icon: FiMail, label: "Email", value: email },
    { icon: FiPhone, label: "Phone", value: phone },
    { icon: FiUser, label: "Gender", value: gender },
    { icon: FiGlobe, label: "Languages", value: language },
  ].filter((item) => item.value);

  const coverUrl = currentCover?.image || default_cover_Image;
  const avatarUrl = currentProfile?.image || default_profile_Image;
  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-10">
      <div className="relative">
        <div className="h-64 md:h-80 lg:h-96 w-full overflow-hidden bg-gray-200">
          <img
            src={coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <button
          onClick={() => setCoverImageModal(true)}
          className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 backdrop-blur-sm transition-all duration-200 z-10 cursor-pointer"
        >
          <FiCamera size={16} /> Edit Cover
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative">
        <div className="relative flex justify-center md:justify-start -mt-16 md:-mt-20 mb-4">
          <div className="relative group">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full ring-4 ring-white shadow-2xl overflow-hidden bg-white">
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <button
              onClick={() => setProfileImageModal(true)}
              className="absolute bottom-1 right-1 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
              aria-label="Edit profile picture"
            >
              <FiEdit2 size={14} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Profile Name & Details - directly below the picture */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 md:p-6 pt-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {fullName}
                </h1>
                <p className="text-gray-500 text-sm mt-1">@{user.username}</p>
                {bio && (
                  <p className="text-gray-700 mt-3 max-w-2xl leading-relaxed text-justify">
                    {bio}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#e4e6eb] hover:bg-gray-300 text-gray-800 font-semibold rounded-full transition text-sm cursor-pointer"
                >
                  <FiEdit2 size={16} /> Edit Profile
                </button>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#e4e6eb] hover:bg-gray-300 text-gray-800 font-semibold rounded-full transition text-sm cursor-pointer"
                >
                  <FiLock size={16} /> Change Password
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-5 pt-4 border-t border-gray-100">
              <div className="text-center md:text-left">
                <span className="font-bold text-gray-900">{followerCount}</span>
                <span className="text-gray-500 ml-1">followers</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-bold text-gray-900">
                  {followingCount}
                </span>
                <span className="text-gray-500 ml-1">following</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: "posts", label: "Posts", icon: FiBookOpen },
              { id: "about", label: "About", icon: FiUser },
              { id: "photos", label: "Photos", icon: FiImage },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 text-center font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
                    isActive
                      ? "text-[#1877f2] border-b-2 border-[#1877f2]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-4 md:p-6">
            {/* Posts Tab */}
            {activeTab === "posts" && (
              <>
                {data && data?.length > 0 ? (
                  <div className="space-y-4">
                    <ProfileRecentPost
                      data={data}
                      isLoading={isLoading}
                      error={error}
                    />
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FiBookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No posts yet.</p>
                    <Link
                      to="/blogs/create"
                      className="mt-3 inline-block text-[#1877f2] hover:underline text-sm"
                    >
                      Write your first blog post →
                    </Link>
                  </div>
                )}
              </>
            )}

            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aboutDetails.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 text-gray-700"
                        >
                          <Icon size={18} className="text-gray-500" />
                          <span>
                            <span className="font-medium">{item.label}:</span>{" "}
                            {item.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {Object.values(socials).some(Boolean) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Social Links
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {socials.twitter && (
                        <a
                          href={socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-[#1877f2]/10 rounded-full text-gray-700 hover:text-[#1877f2] transition"
                        >
                          <FiTwitter size={16} /> Twitter
                        </a>
                      )}
                      {socials.github && (
                        <a
                          href={socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-[#1877f2]/10 rounded-full text-gray-700 hover:text-[#1877f2] transition"
                        >
                          <FiGithub size={16} /> GitHub
                        </a>
                      )}
                      {socials.linkedin && (
                        <a
                          href={socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-[#1877f2]/10 rounded-full text-gray-700 hover:text-[#1877f2] transition"
                        >
                          <FiLinkedin size={16} /> LinkedIn
                        </a>
                      )}
                      {socials.website && (
                        <a
                          href={socials.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-[#1877f2]/10 rounded-full text-gray-700 hover:text-[#1877f2] transition"
                        >
                          <FiGlobe size={16} /> Website
                        </a>
                      )}
                      {socials.email && (
                        <a
                          href={`mailto:${socials.email}`}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-[#1877f2]/10 rounded-full text-gray-700 hover:text-[#1877f2] transition"
                        >
                          <FiMail size={16} /> Email
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === "photos" && (
              <div className="flex flex-col items-center justify-center">
                {/* Button Toggle Group */}
                <div className="relative bg-gray-100 p-1 rounded-full shadow-inner mb-6">
                  <div className="relative flex gap-1">
                    {/* Sliding background indicator */}
                    <div
                      className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-md transition-all duration-300 ease-out ${
                        imageSection === "profile"
                          ? "left-1"
                          : "left-[calc(50%+2px)]"
                      }`}
                    />

                    {/* Profile Button */}
                    <button
                      onClick={() => SetImageSection("profile")}
                      className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                        imageSection === "profile"
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        Profile Images
                      </span>
                    </button>

                    {/* Cover Button */}
                    <button
                      onClick={() => SetImageSection("cover")}
                      className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                        imageSection === "cover"
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        Cover Images
                      </span>
                    </button>
                  </div>
                </div>

                <div className="w-full">
                  {imageSection === "profile" ? (
                    <ProfileImages />
                  ) : (
                    <CoverImages />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSuccess={() => refetch()}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <CoverImage
        isOpen={coverImageModal}
        onClose={() => setCoverImageModal(false)}
      />
      <ProfileImage
        isOpen={profileImageModal}
        onClose={() => setProfileImageModal(false)}
      />
    </div>
  );
};

export default UserProfile;
