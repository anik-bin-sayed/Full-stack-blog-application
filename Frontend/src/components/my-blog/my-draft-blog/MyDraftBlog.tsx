import React, { useState, useEffect } from "react";
import {
  useDeleteBlogMutation,
  useDraftCategoriesQuery,
  useMyDraftBlogApiQuery,
  usePublishBlogMutation,
} from "../../../features/blogs/blogApi";
import { Link } from "react-router-dom";
import { showSuccessToast } from "../../../utils/showSuccessToast";
import Pagination from "../Pagination";
import Skeleton from "../Skeleton";
import ErrorState from "../ErrorState";
import EmptyState from "../EmptyState";
import { formatDate, getImageUrl } from "../../../helper";
import { MdOutlineWatchLater } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { CiCirclePlus } from "react-icons/ci";

import defaultProfileImage from "../../../assets/default_profile_image.png";
import MyBlogList from "../MyBlogList";

const MyDraftBlog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  const [publishingId, setPublishingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: categoriesData } = useDraftCategoriesQuery();
  const [deleteBlog, { isLoading: deleting }] = useDeleteBlogMutation();
  const [publishBlog] = usePublishBlogMutation();

  const { data, isLoading, isError, error, refetch } = useMyDraftBlogApiQuery({
    page: currentPage,
    search: debouncedSearch || undefined,
    category: selectedCategory || undefined,
    page_size: itemsPerPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value ? Number(value) : undefined);
    setCurrentPage(1);
  };

  const handlePublish = async (e: React.MouseEvent, blogId: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Publish this draft?")) return;

    setPublishingId(blogId);

    try {
      const res = await publishBlog(blogId).unwrap();
      showSuccessToast(res);
      await refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Publish failed");
    } finally {
      setPublishingId(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, blogId: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Delete this draft?")) return;

    setDeletingId(blogId);

    try {
      const res = await deleteBlog(blogId).unwrap();
      showSuccessToast(res);
      const remaining = (data?.count || 0) - 1;
      const totalPages = Math.ceil(remaining / itemsPerPage);

      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }

      await refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const drafts = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const hasFilters = searchTerm || selectedCategory;

  if (drafts.length === 0)
    return (
      <EmptyState
        hasFilters={hasFilters}
        setSearchTerm={setSearchTerm}
        setDebouncedSearch={setDebouncedSearch}
        setSelectedCategory={setSelectedCategory}
      />
    );

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorState error={error} refetch={refetch} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MyBlogList type="draft" />
    </div>
  );
};

export default MyDraftBlog;
