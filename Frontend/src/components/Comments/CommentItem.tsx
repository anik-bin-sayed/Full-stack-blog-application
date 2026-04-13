import { MdOutlineDelete, MdOutlineEdit, MdOutlineReply } from "react-icons/md";
import { formatDate, getImageUrl } from "../../helper";
import { useAppSelector } from "../../redux/hooks";
import { useState } from "react";
import { useUpdateCommentMutation } from "../../features/blogs/blogApi";
import { showErrorToast } from "../../utils/showErrorToast";

export type Comment = {
  id: number;
  authorId: number;
  user: User;
  content: string;
  created_at: string;
  replies?: Comment[];
  likeCount?: number;
  isLiked?: boolean;
};

const CommentItem: React.FC<{
  comment: Comment;
  authorId: number;
  blog_id: number;
  isReply?: boolean;
  onDelete: (id: number) => void;
  onReplyClick: (id: number) => void;
  replyingTo: number | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  handleReplySubmit: (e: React.FormEvent, parentId: number) => void;
  handleCancelReply: () => void;
  isReplying: boolean;
}> = ({
  comment,
  authorId,
  blog_id,
  isReply = false,
  onDelete,
  onReplyClick,
  replyingTo,
  replyContent,
  setReplyContent,
  handleReplySubmit,
  handleCancelReply,
  isReplying,
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [editComment, setEditComment] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const profileImage = getImageUrl(comment?.user?.profile_images?.[0]?.image);
  const loggedInUserImage = getImageUrl(user?.profile_images?.[0].image);
  const commentDate = formatDate(comment?.created_at);
  const displayName =
    comment.user?.profile?.fullname || comment.user?.username || "Anonymous";

  const [updateComment, { isLoading }] = useUpdateCommentMutation();

  console.log(comment?.id);
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      await updateComment({
        comment_id: comment?.id,
        data: { content: editContent },
      }).unwrap();
      setEditComment(false);
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleCancelEdit = () => {
    setEditComment(false);
    setEditContent(comment.content);
  };

  return (
    <div className={`${isReply ? "ml-10 mt-3" : "mt-4"}`}>
      <div className="flex gap-3">
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

        {/* Comment Bubble */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-100 rounded-2xl px-4 py-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">
                {displayName}
              </span>
              <span className="text-xs text-gray-500">{commentDate}</span>
            </div>
            <p className="text-gray-800 text-sm mt-1 break-words whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500">
            {isAuthenticated && (
              <button
                onClick={() => onReplyClick(comment.id)}
                className="flex items-center gap-1 hover:text-indigo-600 transition"
              >
                <MdOutlineReply className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            )}

            {isAuthenticated &&
              (user?.id === comment?.user?.id || user?.id === authorId) && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="flex items-center gap-1 hover:text-red-500 transition"
                >
                  <MdOutlineDelete className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}

            {isAuthenticated && user?.id === comment?.user?.id && (
              <button
                onClick={() => setEditComment(true)}
                className="flex items-center gap-1 hover:text-indigo-600 transition"
              >
                <MdOutlineEdit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {editComment && (
            <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 transition-all duration-200">
              <form onSubmit={handleEditSubmit}>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden">
                      {loggedInUserImage ? (
                        <img
                          src={loggedInUserImage}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.username?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <textarea
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Edit your comment..."
                      className="w-full p-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!editContent.trim() || isLoading}
                        className="px-4 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {replyingTo === comment.id && (
            <form
              onSubmit={(e) => handleReplySubmit(e, comment.id)}
              className="mt-3"
            >
              <div className="flex gap-2">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden">
                    {loggedInUserImage ? (
                      <img
                        src={loggedInUserImage}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.username?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-2 text-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none bg-gray-50"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleCancelReply}
                      className="px-3 py-1.5 text-xs text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!replyContent.trim() || isReplying}
                      className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      {isReplying ? "Replying..." : "Reply"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              authorId={authorId}
              blog_id={blog_id}
              isReply={true}
              onDelete={onDelete}
              onReplyClick={onReplyClick}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleReplySubmit={handleReplySubmit}
              handleCancelReply={handleCancelReply}
              isReplying={isReplying}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
