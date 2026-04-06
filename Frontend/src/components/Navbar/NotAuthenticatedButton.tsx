import React from "react";
import { Link } from "react-router-dom";

const NotAuthenticatedButton = () => {
  return (
    <Link
      to="/login"
      className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm hover:shadow"
    >
      Login
    </Link>
  );
};

export default NotAuthenticatedButton;
