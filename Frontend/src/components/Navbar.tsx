import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { HiMenu, HiX } from "react-icons/hi";
import { FiUser, FiLogOut, FiUserCheck } from "react-icons/fi";
import LogoutModal from "./Modals/LogoutModal";
import {
  useGetMeQuery,
  useProfilePhotoQuery,
} from "../features/profile/profileApi";
import default_profile_Image from "../assets/default_profile_image.png";

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    data,
    isLoading: userLoading,
    error: userError,
  } = useGetMeQuery(undefined, { skip: !isAuthenticated });

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: currentProfile } = useProfilePhotoQuery();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blogs" },
    { name: "Bloggers", path: "/bloggers" },
  ];

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

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Handle logout confirmation
  const handleConfirmLogout = async () => {
    setIsLogoutOpen(false);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const openLogoutModal = () => {
    setIsLogoutOpen(true);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const fullname = data?.profile?.fullname;
  const email = data?.email;
  const avatarUrl = currentProfile?.image || default_profile_Image;

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="text-2xl bg-clip-text hover:opacity-80 transition text-black"
              style={{ fontFamily: "Pacifico, cursive" }}
            >
              Draft
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-gray-700 hover:text-indigo-600 transition duration-200 font-medium ${
                      isActive
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : ""
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center space-x-4">
              {!data ? (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm hover:shadow"
                >
                  Login
                </Link>
              ) : (
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
                        className="w-9 h-9 rounded-full"
                      />
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-sm font-medium text-gray-800">
                        {fullname}
                      </div>
                      <div className="text-xs text-gray-500">{email}</div>
                    </div>
                    <FiUserCheck className="text-gray-400 w-4 h-4 lg:hidden" />
                  </button>

                  {/* Dropdown Menu */}
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
                        to="/create-blog"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition"
                      >
                        <FiUser className="mr-2" /> Create a Blog
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition"
                      >
                        <FiUser className="mr-2" /> My Blogs
                      </Link>
                      <button
                        onClick={openLogoutModal}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
                      >
                        <FiLogOut className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-2xl animate-slideIn">
            <div className="flex flex-col p-5 pt-20">
              {user ? (
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {getUserInitial()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {getUserDisplayName()}
                      </div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
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
                    onClick={() => setIsMenuOpen(false)}
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
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-indigo-600 transition font-medium py-1 flex items-center"
                    >
                      <FiUser className="mr-2" /> Profile
                    </Link>
                    <button
                      onClick={openLogoutModal}
                      className="text-left text-gray-700 hover:text-indigo-600 transition font-medium py-1 flex items-center"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal rendered outside all conditionals */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutOpen(false)}
      />
    </>
  );
};

export default Navbar;
