import React, { useEffect, useRef, useState } from "react";
import { useGetCommentQuery } from "../../features/blogs/blogApi";
import GetCommentsSection from "./GetCommentsSection";

const CommentsWrapper = ({ blog_id, authorId }: any) => {
  const [page, setPage] = useState(1);
  const [allComments, setAllComments] = useState<any[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, isFetching } = useGetCommentQuery({
    blog_id,
    page,
  });

  useEffect(() => {
    if (data?.results) {
      setAllComments((prev) =>
        page === 1 ? data.results : [...prev, ...data.results],
      );
    }
  }, [data?.results, page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && data?.next && !isFetching) {
        setPage((prev) => prev + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [data?.next, isFetching]);

  return (
    <>
      <GetCommentsSection
        comments={allComments}
        authorId={authorId}
        blog_id={blog_id}
      />

      <div ref={loaderRef} className="h-10 flex justify-center">
        {isFetching && <p className="text-xs text-gray-400">Loading more...</p>}
      </div>
    </>
  );
};

export default CommentsWrapper;
