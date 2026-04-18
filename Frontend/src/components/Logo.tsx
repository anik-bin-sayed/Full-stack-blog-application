import React from "react";
import { FaBloggerB } from "react-icons/fa";
import { Link } from "react-router-dom";

const Logo = ({ className }: { className: string }) => {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2 transition-all duration-300 hover:opacity-90 my-4"
      style={{ fontFamily: "Satisfy, cursive" }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-rose-500 shadow-md transition-transform duration-300 group-hover:scale-105">
        <FaBloggerB className="text-xl text-white" />
      </div>

      <span
        className={`text-2xl font-bold  bg-clip-text  dark:from-gray-200 dark:to-gray-400 ${className}`}
      >
        Blogify
      </span>
    </Link>
  );
};

export default Logo;
