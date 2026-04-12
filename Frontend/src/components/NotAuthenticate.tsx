import React from "react";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

const NotAuthenticate = () => {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <div className="w-20 h-20 bg-[#1877f2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiUser className="w-10 h-10 text-[#1877f2]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Please Log In</h2>
        <p className="text-gray-500 mt-2">
          You need to be logged in to view your profile.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1877f2] text-white rounded-full hover:bg-[#166fe5] transition w-full"
        >
          Go to Login →
        </Link>
      </div>
    </div>
  );
};

export default NotAuthenticate;
