import React from "react";
import { Link } from "react-router-dom";

interface ClassName {
  className: string;
}
const Logo = ({ className }: ClassName) => {
  return (
    <Link
      to="/"
      className={`text-2xl bg-clip-text hover:opacity-80 transition  ${className}`}
      style={{ fontFamily: "Pacifico, cursive" }}
    >
      PostVerse
    </Link>
  );
};

export default Logo;
