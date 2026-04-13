import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  useDeleteCommentMutation,
  useGetCommentQuery,
} from "../../features/blogs/blogApi";
import { formatDate, getImageUrl } from "../../helper";
import { MdOutlineDelete, MdOutlineEdit, MdOutlineReply } from "react-icons/md";
import { showErrorToast } from "../../utils/showErrorToast";

type Props = {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  blog_id: number;
};

const GetCommentModal = React.memo(({ setModalOpen, blog_id }: Props) => {
  const [page, setPage] = useState(1);
  const [allComments, setAllComments] = useState<any[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetCommentQuery({
    blog_id,
    page,
  });

  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  // Append comments when data arrives
  useEffect(() => {
    if (data?.results) {
      setAllComments((prev) =>
        page === 1 ? data.results : [...prev, ...data.results],
      );
    }
  }, [data, page]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data?.next && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [data?.next, isFetching]);

  const handleDelete = useCallback(
    async (commentId: number) => {
      if (!window.confirm("Are you sure you want to delete this comment?"))
        return;
      try {
        await deleteComment({ comment_id: commentId }).unwrap();
        setPage(1);
        await refetch();
        setAllComments([]); // Clear existing, will be repopulated by useEffect
      } catch (error) {
        showErrorToast(error);
      }
    },
    [deleteComment, refetch],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Comments ({data?.count || 0})
          </h3>
          <button
            onClick={() => setModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Comments List (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {allComments.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-3"
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
              <p className="text-gray-500">No comments yet.</p>
            </div>
          )}

          {allComments.map((comment, index) => {
            // Safely extract profile image
            const profileImage =
              comment.user?.profile_images?.[0]?.image &&
              getImageUrl(comment.user.profile_images[0].image);
            const formattedDate = formatDate(comment.created_at);
            const displayName =
              comment.user?.profile?.fullname ||
              comment.user?.username ||
              "Anonymous";
            console.log(comment?.id);
            return (
              <div key={index} className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm overflow-hidden">
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
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">
                          {displayName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formattedDate}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          className="text-gray-400 hover:text-indigo-500 p-1 rounded-full hover:bg-gray-200 transition"
                          title="Reply"
                        >
                          <MdOutlineReply className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-200 transition"
                          title="Edit"
                        >
                          <MdOutlineEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          disabled={isDeleting}
                          className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <MdOutlineDelete className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Infinite scroll loader */}
          <div ref={loaderRef} className="flex justify-center py-4">
            {isFetching && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <svg
                  className="animate-spin h-4 w-4"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading more...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

GetCommentModal.displayName = "GetCommentModal";

export default GetCommentModal;
