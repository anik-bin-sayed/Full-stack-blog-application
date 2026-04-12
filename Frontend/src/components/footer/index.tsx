import React from "react";
import { Link } from "react-router-dom";

import Logo from "../Logo";
import { useGetCategoriesQuery } from "../../features/blogs/blogApi";

const Footer = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="text-sm">
              Empowering readers with quality content since 2024.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/bloggers" className="hover:text-white transition">
                  Bloggers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories &&
                categories.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/blogs?category=${cat.id}`}
                      className="hover:text-white transition"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition">
                GitHub
              </a>
              <a href="#" className="hover:text-white transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          &copy; {new Date().getFullYear()} BlogSpace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
