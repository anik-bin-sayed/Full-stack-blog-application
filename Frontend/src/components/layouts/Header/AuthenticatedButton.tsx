import { useRef, useState, useEffect, useCallback } from "react";
import { FiLogOut, FiUser, FiUserCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { useLogoutUserMutation } from "../../../features/auth/authApi";
import {
  useGetMeQuery,
  useProfilePhotoQuery,
} from "../../../features/profile/profileApi";
import defaultProfileImage from "../../../assets/default_profile_image.png";
import { showSuccessToast } from "../../../utils/showSuccessToast";
import { logout } from "../../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { isCacheValid } from "../../../utils/cache/isCacheValid";
import { setUserCache } from "../../../features/profile/profileSlice";
import { selectUser } from "../../../features/profile/profileSelectors";

const AuthenticatedButton = () => {
  const cachedUser = useAppSelector((state) => state.profile.user);
  const cachedAt = useAppSelector((state) => state.profile.cachedAt);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isCacheReady = cachedUser && cachedAt && isCacheValid(cachedAt);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();

  const { data: apiUser, isLoading } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const user = useAppSelector((state) => selectUser(state, apiUser));

  const { data: currentProfile } = useProfilePhotoQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (apiUser && !isCacheReady) {
      dispatch(setUserCache(apiUser));
    }
  }, [apiUser, isCacheReady, dispatch]);

  const fullname = user?.profile?.fullname;
  const email = user?.email;

  const handleClickOutside = useCallback((event: PointerEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [handleClickOutside]);

  const handleLogout = useCallback(async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    try {
      const res = await logoutUser().unwrap();
      dispatch(logout());
      showSuccessToast(res);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logoutUser, dispatch]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-black/5 transition border border-gray-200 cursor-pointer"
        aria-label="User menu"
      >
        <img
          src={currentProfile?.image || defaultProfileImage}
          alt={fullname || "User"}
          loading="lazy"
          decoding="async"
          className="w-9 h-9 rounded-full object-cover"
        />

        <div className="text-left hidden lg:block">
          <div className="text-sm font-medium text-gray-800">{fullname}</div>
          <div className="text-xs text-gray-500">{email}</div>
        </div>

        <FiUserCheck className="text-gray-400 w-4 h-4 lg:hidden" />
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10 transition-all duration-150 ${
          isDropdownOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ willChange: "transform" }}
      >
        <Link
          to="/profile"
          onClick={toggleDropdown}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <FiUser className="mr-2" /> Profile
        </Link>

        <Link
          to="/blogs/create"
          onClick={toggleDropdown}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <FiUser className="mr-2" /> Create Blog
        </Link>

        <Link
          to="/my-blogs"
          onClick={toggleDropdown}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <FiUser className="mr-2" /> My Blogs
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <FiLogOut className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default AuthenticatedButton;
