import React, { useState } from "react";
import MyPublishBlog from "../../components/my-blog/my-publish-blog/MyPublishBlog";
import MyDraftBlog from "../../components/my-blog/my-draft-blog/MyDraftBlog";
import { Link } from "react-router-dom";

const MyBlog = () => {
  const [selected, setSelected] = useState("publish");

  return (
    <div className="w-full bg-slate-50 ">
      <div className="max-w-7xl p-6 mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">My Blog Dashboard</h1>
        <Link
          to="/blogs/create"
          className="px-4 py-2 rounded-md text-sm font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
        >
          Create Blog
        </Link>
      </div>

      <div className="mx-auto flex gap-4 justify-center mb-8">
        <button
          onClick={() => setSelected("publish")}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
            ${
              selected === "publish"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }
          `}
        >
          Public
        </button>
        <button
          onClick={() => setSelected("draft")}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
            ${
              selected === "draft"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }
          `}
        >
          Draft
        </button>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100">
        {selected === "publish" && <MyPublishBlog />}
        {selected === "draft" && <MyDraftBlog />}
      </div>
    </div>
  );
};

export default MyBlog;
