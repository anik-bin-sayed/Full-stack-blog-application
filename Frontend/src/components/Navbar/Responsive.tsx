import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useLogoutUserMutation } from "../../features/auth/authApi";
import { navLinks } from "./navbarUtils";
import {
  FiLogOut,
  FiUser,
  FiPlusCircle,
  FiBookOpen,
  FiX,
} from "react-icons/fi";
import { showSuccessToast } from "../../utils/showSuccessToast";
import { getImageUrl } from "../../helper";
import NotificationButton from "../NotificationButton";

interface ResponsiveProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  getUserInitial: () => string;
  getUserDisplayName: () => string;
}

const Responsive = ({
  isOpen,
  onClose,
  user,
  getUserInitial,
  getUserDisplayName,
  setOpenModal,
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
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl animate-slideIn flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <div className="flex items-center gap-3">
            <NotificationButton setOpenModal={setOpenModal} />
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition"
              aria-label="Close menu"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {user ? (
            <>
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                {hasProfileImage ? (
                  <img
                    src={profileImage}
                    alt={getUserDisplayName()}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                    {getUserInitial()}
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-800">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[150px]">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium py-2 px-2 rounded-lg ${
                        isActive
                          ? "text-indigo-600 bg-indigo-50"
                          : "hover:bg-gray-50"
                      }`
                    }
                  >
                    {link.icon && <span className="w-5">{link.icon}</span>}
                    {link.name}
                  </NavLink>
                ))}

                <div className="pt-2 border-t border-gray-100 mt-2 space-y-2">
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50"
                  >
                    <FiUser className="w-5 h-5" /> Profile
                  </Link>
                  <Link
                    to="/blogs/create"
                    onClick={onClose}
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50"
                  >
                    <FiPlusCircle className="w-5 h-5" /> Create a Blog
                  </Link>
                  <Link
                    to="/my-blogs"
                    onClick={onClose}
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50"
                  >
                    <FiBookOpen className="w-5 h-5" /> My Blogs
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left text-gray-700 hover:text-indigo-600 transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50"
                  >
                    <FiLogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 mb-4">You are not logged in</p>
              <Link
                to="/login"
                onClick={onClose}
                className="w-full text-center px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Responsive;
