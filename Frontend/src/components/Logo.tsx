import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      className={`text-2xl bg-clip-text hover:opacity-80 transition  `}
      style={{ fontFamily: "Dancing Script, cursive" }}
    >
      PostVerse
    </Link>
  );
};

export default Logo;
