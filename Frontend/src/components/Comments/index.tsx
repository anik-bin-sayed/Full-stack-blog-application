import React, { useState, useRef, useEffect } from "react";
import { useCreateCommentMutation } from "../../features/blogs/blogApi";
import { showErrorToast } from "../../utils/showErrorToast";
import { useAppSelector } from "../../redux/hooks";
import { getImageUrl } from "../../helper";
import defaultProfileImage from "../../assets/default_profile_image.png";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { FaComment } from "react-icons/fa";

const MAX_COMMENT_LENGTH = 500;

const Comments = ({ blog_id }: { blog_id: number }) => {
  const [content, setContent] = useState("");
  const [createComment, { isLoading }] = useCreateCommentMutation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200,
      )}px`;
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.length > MAX_COMMENT_LENGTH) return;

    try {
      await createComment({
        blog_id,
        data: { content: content.trim() },
      }).unwrap();
      setContent("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (
        content.trim() &&
        !isLoading &&
        content.length <= MAX_COMMENT_LENGTH
      ) {
        handleSubmit(e);
      }
    }
  };

  const remainingChars = MAX_COMMENT_LENGTH - content.length;
  const isNearLimit = remainingChars <= 50;
  const isOverLimit = remainingChars < 0;

  const currentAvatar = user?.profile_images?.find(
    (img: any) => img.is_current,
  )?.image;
  const avatarUrl = getImageUrl(currentAvatar) || defaultProfileImage;
  const displayName = user?.profile?.fullname || user?.username || "You";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all focus-within:shadow-md focus-within:border-indigo-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
            />
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={content}
              onChange={(e) =>
                setContent(e.target.value.slice(0, MAX_COMMENT_LENGTH))
              }
              onKeyDown={handleKeyDown}
              placeholder="Write a thoughtful comment..."
              disabled={isLoading}
              className={`w-full p-3 pr-12 text-gray-700 bg-gray-50 rounded-xl border transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white focus:border-transparent
                resize-none overflow-hidden
                ${isOverLimit ? "border-red-400 focus:ring-red-400" : "border-gray-200"}
                disabled:bg-gray-100 disabled:cursor-not-allowed`}
              style={{ minHeight: "48px", maxHeight: "200px" }}
            />
            <button
              type="submit"
              disabled={isLoading || !content.trim() || isOverLimit}
              className="absolute right-2 bottom-4 p-1 rounded-full text-indigo-500 hover:bg-indigo-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Post comment"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <PaperAirplaneIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Footer with character counter and hint */}
        <div className="flex justify-between items-center text-xs pl-13">
          <div className="text-gray-400">
            {content.trim() === "" ? (
              <span className="flex items-center gap-2">
                <FaComment /> Share your thoughts
              </span>
            ) : (
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                  Ctrl
                </kbd>
                +
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                  Enter
                </kbd>{" "}
                to submit
              </span>
            )}
          </div>
          <div
            className={`text-xs font-mono ${
              isOverLimit
                ? "text-red-500 font-semibold"
                : isNearLimit
                  ? "text-amber-500"
                  : "text-gray-400"
            }`}
          >
            {remainingChars} / {MAX_COMMENT_LENGTH}
          </div>
        </div>

        {isOverLimit && (
          <p className="text-red-500 text-xs mt-1 pl-13">
            Comment exceeds {MAX_COMMENT_LENGTH} characters.
          </p>
        )}
      </form>
    </div>
  );
};

export default Comments;
