import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { HiMenu, HiX } from "react-icons/hi";
import { IoIosNotificationsOutline } from "react-icons/io";

import Logo from "../Logo";
import NotAuthenticatedButton from "./NotAuthenticatedButton";
import AuthenticatedButton from "./AuthenticatedButton";
import { useGetMeQuery } from "../../features/profile/profileApi";
import { navLinks } from "./navbarUtils";
import Responsive from "./Responsive";
import Loader from "../Loader";
import Notifications from "../Notifications";
import { IoNotificationsOutline } from "react-icons/io5";

const Navbar: React.FC = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { data: user } = useGetMeQuery(undefined, { skip: !isAuthenticated });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [openModal, setOpenModal] = useState(false);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const getUserInitial = () => {
    if (user?.profile?.fullname) {
      return user.profile.fullname.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (user?.profile?.fullname) {
      return user.profile.fullname;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  if (isLoading) return <Loader />;
  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />

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

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && (
                <div>
                  <button
                    onClick={() => setOpenModal(true)}
                    className="relative p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
                  >
                    <IoNotificationsOutline className="w-6 h-6" />

                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full shadow-md">
                      0
                    </span>
                  </button>
                </div>
              )}
              {!isAuthenticated ? (
                <NotAuthenticatedButton />
              ) : (
                <AuthenticatedButton />
              )}
            </div>

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

      {openModal && <Notifications setOpenModal={setOpenModal} />}

      <Responsive
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        getUserInitial={getUserInitial}
        getUserDisplayName={getUserDisplayName}
      />
    </>
  );
};

export default Navbar;
