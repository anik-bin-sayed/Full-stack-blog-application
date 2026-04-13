import React, { useCallback, useState } from "react";

import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "../../features/blogs/blogApi";
import { showErrorToast } from "../../utils/showErrorToast";
import { showSuccessToast } from "../../utils/showSuccessToast";
import CommentItem from "./CommentItem";

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
  replies?: Comment[];
  likeCount?: number;
  isLiked?: boolean;
};

export type GetCommentsSectionProps = {
  comments?: Comment[];
  commentCount?: number;
  onCommentDeleted?: () => void;
  onReplyCreated?: () => void;
  authorId: number;
  blog_id: number;
};

const GetCommentsSection: React.FC<GetCommentsSectionProps> = ({
  comments = [],
  authorId,
  blog_id,
  onCommentDeleted,
  onReplyCreated,
}) => {
  const [deleteComment] = useDeleteCommentMutation();
  const [createComment, { isLoading: isReplying }] = useCreateCommentMutation();

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

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

  const handleReplyClick = (commentId: number) => {
    setReplyingTo(commentId);
    setReplyContent("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const handleReplySubmit = async (
    e: React.FormEvent,
    parentCommentId: number,
  ) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    try {
      await createComment({
        blog_id,
        data: {
          content: replyContent,
          parent_id: parentCommentId,
        },
      }).unwrap();
      showSuccessToast("Reply added successfully");
      setReplyingTo(null);
      setReplyContent("");
      onReplyCreated?.();
    } catch (error) {
      showErrorToast(error);
    }
  };

  const safeComments = Array.isArray(comments) ? comments : [];
  const hasComments = safeComments.length > 0;

  return (
    <div className="space-y-2">
      {hasComments ? (
        safeComments.map((comment, index) => (
          <CommentItem
            key={index}
            comment={comment}
            authorId={authorId}
            blog_id={blog_id}
            onDelete={handleDelete}
            onReplyClick={handleReplyClick}
            replyingTo={replyingTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            handleReplySubmit={handleReplySubmit}
            handleCancelReply={handleCancelReply}
            isReplying={isReplying}
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

export default GetCommentsSection;
