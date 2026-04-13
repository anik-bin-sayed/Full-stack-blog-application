import React, { useState } from "react";
import { useCreateCommentMutation } from "../../features/blogs/blogApi";
import { showErrorToast } from "../../utils/showErrorToast";

const Comments = ({ blog_id }: { blog_id: number }) => {
  const [content, setContent] = useState("");
  const [createComment, { isLoading }] = useCreateCommentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await createComment({
        blog_id,
        data: { content },
      }).unwrap();
      setContent("");
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 bg-white rounded-xl p-5 shadow-sm"
    >
      <textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        disabled={isLoading}
        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="cursor-pointer px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Submitting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
};

export default Comments;
