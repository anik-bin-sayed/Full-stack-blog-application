import React, { useCallback } from "react";
import { formatDate, getImageUrl } from "../../helper";
import { MdOutlineDelete, MdOutlineEdit, MdOutlineReply } from "react-icons/md";
import { useDeleteCommentMutation } from "../../features/blogs/blogApi";
import { showErrorToast } from "../../utils/showErrorToast";
import { showSuccessToast } from "../../utils/showSuccessToast";
import { useAppSelector } from "../../redux/hooks";

export type User = {
  id: number;
  username: string;
  email?: string;
  profile?: {
    fullname?: string;
  };
  profile_images?: {
    image: string;
  }[];
};

export type Comment = {
  id: number;
  authorId: number;
  user: User;
  content: string;
  created_at: string;
};

export type GetCommentsSectionProps = {
  comments?: Comment[]; // Made optional
  commentCount?: number; // Made optional
  onCommentDeleted?: () => void;
  authorId: number;
};

const GetCommentsSection: React.FC<GetCommentsSectionProps> = ({
  comments = [],
  authorId,
  onCommentDeleted,
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const handleDelete = useCallback(
    async (commentId: number) => {
      if (!window.confirm("Are you sure you want to delete this comment?"))
        return;
      try {
        await deleteComment({ comment_id: commentId }).unwrap();
        showSuccessToast("Comment deleted successfully");
        onCommentDeleted?.();
      } catch (error) {
        showErrorToast(error);
      }
    },
    [deleteComment, onCommentDeleted],
  );

  // Ensure comments is always an array
  const safeComments = Array.isArray(comments) ? comments : [];
  const hasComments = safeComments.length > 0;

  return (
    <div className="space-y-5">
      {hasComments ? (
        safeComments.map((comment) => {
          const profileImage = getImageUrl(
            comment?.user?.profile_images?.[0]?.image,
          );
          const commentDate = formatDate(comment.created_at);
          const displayName =
            comment.user?.profile?.fullname ||
            comment.user?.username ||
            "Anonymous";

          console.log(comment);

          return (
            <div
              key={comment.id}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{displayName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-none">
                        {displayName}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {commentDate}
                      </span>
                    </div>

                    {isAuthenticated &&
                      (user?.id === comment?.user?.id ||
                        user?.id === authorId) && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            className="text-gray-400 hover:text-indigo-500 p-1 rounded-full hover:bg-indigo-50 transition"
                            title="Reply"
                          >
                            <MdOutlineReply className="w-4 h-4" />
                          </button>

                          <button
                            className="text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50 transition"
                            title="Edit"
                          >
                            <MdOutlineEdit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(comment.id)}
                            disabled={isDeleting}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            <MdOutlineDelete className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                  </div>

                  <p className="text-gray-600 mt-1 leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
          <svg
            className="w-14 h-14 text-gray-300 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}
    </div>
  );
};

export default GetCommentsSection;
