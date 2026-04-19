import React, { useState, useEffect, type ComponentType } from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { HiMenu, HiX } from "react-icons/hi";

import Logo from "../../Logo";
import NotAuthenticatedButton from "./NotAuthenticatedButton";
import AuthenticatedButton from "./AuthenticatedButton";
import { useGetMeQuery } from "../../../features/profile/profileApi";
import { navLinks } from "./navbarUtils";
import Responsive from "./Responsive";
import Notifications from "../../Notifications";
import NotificationButton from "../NotificationButton";

const Navbar: React.FC = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const { data: user } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const prefetchMap: Record<string, () => Promise<{ default: ComponentType }>> =
    {
      "/": () => import("../../../pages/Blog/Home"),
      "/blogs": () => import("../../../pages/Blog/Blogs"),
      "/bloggers": () => import("../../../pages/Blog/BloggersPage"),
      "/profile": () => import("../../../pages/profile/UserProfile"),
      "/blogs/create": () => import("../../../pages/Blog/CreateBlogPage"),
    };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const getUserInitial = () => {
    if (user?.profile?.fullname)
      return user.profile.fullname.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const getUserDisplayName = () => {
    if (user?.profile?.fullname) return user.profile.fullname;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  if (isLoading) {
    return (
      <div className="h-16 flex items-center justify-center bg-white shadow">
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo className="text-black" />

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onMouseEnter={() => prefetchMap[link.path]?.()}
                  className={({ isActive }) =>
                    `text-gray-700 hover:text-amber-600 transition duration-200 font-medium ${
                      isActive
                        ? "text-amber-600 border-b-2 border-amber-600"
                        : ""
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <NotificationButton setOpenModal={setOpenModal} />

              {!isAuthenticated ? (
                <NotAuthenticatedButton />
              ) : (
                <AuthenticatedButton />
              )}
            </div>

            <div className="md:hidden flex items-center space-x-3">
              <NotificationButton setOpenModal={setOpenModal} />

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 rounded border border-gray-300 hover:border-black"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>
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
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default Navbar;
