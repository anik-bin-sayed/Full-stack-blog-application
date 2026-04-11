import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useLogoutUserMutation } from "../../features/auth/authApi";
import { navLinks } from "./navbarUtils";
import { FiLogOut, FiUser, FiPlusCircle, FiBookOpen } from "react-icons/fi";
import { showSuccessToast } from "../../utils/showSuccessToast";
import { getImageUrl } from "../../helper";
import default_profile_Image from "../../assets/default_profile_image.png";

interface ResponsiveProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  getUserInitial: () => string;
  getUserDisplayName: () => string;
}

const Responsive = ({
  isOpen,
  onClose,
  user,
  getUserInitial,
  getUserDisplayName,
}: ResponsiveProps) => {
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      const res = await logoutUser().unwrap();
      showSuccessToast(res);
      onClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isOpen) return null;

  // Get profile image – use first image from user's profile_images array
  const profileImage = user?.profile_images?.[0]?.image
    ? getImageUrl(user.profile_images[0].image)
    : null;

  const hasProfileImage = !!profileImage;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-2xl animate-slideIn">
        <div className="flex flex-col p-5 pt-20">
          {user ? (
            <div className="mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                {/* Profile image or fallback initials circle */}
                {hasProfileImage ? (
                  <img
                    src={profileImage}
                    alt={getUserDisplayName()}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {getUserInitial()}
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-800">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <Link
                to="/login"
                onClick={onClose}
                className="block w-full text-center px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            </div>
          )}

          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `text-gray-700 hover:text-indigo-600 transition font-medium py-1 ${
                    isActive
                      ? "text-indigo-600 border-l-4 border-indigo-600 pl-2"
                      : ""
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {user && (
              <>
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="text-gray-700 hover:text-indigo-600 transition font-medium py-1 flex items-center gap-2"
                >
                  <FiUser className="w-4 h-4" /> Profile
                </Link>
                <Link
                  to="/blogs/create"
                  onClick={onClose}
                  className="text-gray-700 hover:text-indigo-600 transition font-medium py-1 flex items-center gap-2"
                >
                  <FiPlusCircle className="w-4 h-4" /> Create a Blog
                </Link>
                <Link
                  to="/my-blogs"
                  onClick={onClose}
                  className="text-gray-700 hover:text-indigo-600 transition font-medium py-1 flex items-center gap-2"
                >
                  <FiBookOpen className="w-4 h-4" /> My Blogs
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-gray-700 hover:text-indigo-600 transition font-medium py-1 flex items-center gap-2"
                >
                  <FiLogOut className="w-4 h-4" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Responsive;
