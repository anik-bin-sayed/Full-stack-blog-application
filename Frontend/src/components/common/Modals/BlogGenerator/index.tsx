import React, { useState } from "react";
import { showErrorToast } from "../../../../utils/showErrorToast";
import { IoClose } from "react-icons/io5";
import { useGenerateBlogMutation } from "../../../../features/blogs/blogApi";
import { useDispatch } from "react-redux";
import { setBlogData } from "../../../../features/blogs/blogSlice";

const BlogGenerator = ({
  setShowPromptModal,
}: {
  setShowPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [topic, setTopic] = useState("");

  const dispatch = useDispatch();

  const [generateBlog, { isLoading }] = useGenerateBlogMutation();

  const handleGenerateFromPrompt = async () => {
    if (!topic.trim()) {
      showErrorToast("Please describe what your blog is about");
      return;
    }

    try {
      const res = await generateBlog({ topic }).unwrap();

      dispatch(setBlogData(res));
      console.log(res);
      setTopic("");
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Blog Prompt</h3>
          <button
            onClick={() => setShowPromptModal(false)}
            className="text-gray-400 hover:text-gray-600 transition border p-1 text-xl rounded border-gray-300 hover:border-green-600 cursor-pointer"
          >
            <IoClose />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Describe what your blog is about (e.g.,{" "}
          <em>"healthy vegan recipes"</em> or{" "}
          <em>"future of artificial intelligence"</em>).
        </p>

        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., travel tips for solo adventurers"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          autoFocus
        />
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowPromptModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700  transition cursor-pointer bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateFromPrompt}
            // disabled={isGeneratingPrompt}
            className="flex-1 bg-green-500 hover:bg-green-600  text-white rounded-lg py-2 font-medium hover:from-green-600 border hover:to-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? "Generating Blog..." : "Generate Blog"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogGenerator;
