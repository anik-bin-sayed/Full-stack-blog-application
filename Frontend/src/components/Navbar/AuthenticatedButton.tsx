import React, { useRef, useState, useEffect } from "react";
import { FiLogOut, FiUser, FiUserCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useProfilePhotoQuery } from "../../features/profile/profileApi";
import { useAppSelector } from "../../redux/hooks";
import { useLogoutUserMutation } from "../../features/auth/authApi";
import default_profile_Image from "../../assets/default_profile_image.png";
import { showSuccessToast } from "../../utils/showSuccessToast";
import { logout } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import Loader from "../Loader";

const AuthenticatedButton = () => {
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: currentProfile } = useProfilePhotoQuery(undefined, {
    skip: !isAuthenticated,
  });
  const dispatch = useDispatch();

  const [logoutUser] = useLogoutUserMutation();

  const fullname = user?.profile?.fullname;
  const email = user?.email;
  const avatarUrl = currentProfile?.image || default_profile_Image;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logging out?")) {
      try {
        const res = await logoutUser().unwrap();
        dispatch(logout());
        showSuccessToast(res);
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  if (isLoading) return <Loader />;
  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 focus:outline-none group cursor-pointer outline outline-black/20 hover:bg-black/5 px-2 py-2 rounded-md"
        aria-label="User menu"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
          <img
            src={avatarUrl}
            alt={fullname}
            className="w-9 h-9 rounded-full object-cover"
          />
        </div>
        <div className="text-left hidden lg:block">
          <div className="text-sm font-medium text-gray-800">{fullname}</div>
          <div className="text-xs text-gray-500">{email}</div>
        </div>
        <FiUserCheck className="text-gray-400 w-4 h-4 lg:hidden" />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10 animate-fadeIn">
          <Link
            to="/profile"
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <FiUser className="mr-2" /> Profile
          </Link>
          <Link
            to="/blogs/create"
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <FiUser className="mr-2" /> Create a Blog
          </Link>
          <Link
            to="/my-blogs"
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <FiUser className="mr-2" /> My Blogs
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthenticatedButton;
