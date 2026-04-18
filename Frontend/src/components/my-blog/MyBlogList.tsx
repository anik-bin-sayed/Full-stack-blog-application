import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { MdOutlineWatchLater } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { CiCirclePlus } from "react-icons/ci";
import { LuCircleMinus } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { TbCategoryPlus } from "react-icons/tb";
import defaultProfileImage from "../../assets/default_profile_image.png";
import {
  useDeleteBlogMutation,
  useDraftCategoriesQuery,
  useMyDraftBlogApiQuery,
  useMyPublicBlogQuery,
  usePublicCategoriesQuery,
  usePublishBlogMutation,
} from "../../features/blogs/blogApi";
import { showSuccessToast } from "../../utils/showSuccessToast";
import Skeleton from "./Skeleton";
import EmptyState from "./EmptyState";
import { formatDate, getImageUrl } from "../../helper";
import Pagination from "./Pagination";
import ErrorState from "./ErrorState";

interface MyBlogListProps {
  type: "draft" | "published";
}

const MyBlogList: React.FC<MyBlogListProps> = ({ type }) => {
  const isDraft = type === "draft";

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

  const { data: draftCategories } = useDraftCategoriesQuery(undefined, {
    skip: !isDraft,
  });
  const { data: publicCategories } = usePublicCategoriesQuery(undefined, {
    skip: isDraft,
  });

  const categoriesData = isDraft ? draftCategories : publicCategories;

  const {
    data: draftData,
    isLoading: draftLoading,
    isError: draftError,
    error: draftErrorObj,
    refetch: refetchDraft,
  } = useMyDraftBlogApiQuery(
    {
      page: currentPage,
      search: debouncedSearch || undefined,
      category: selectedCategory || undefined,
      page_size: itemsPerPage,
    },
    { skip: !isDraft },
  );

  const {
    data: publishedData,
    isLoading: publishedLoading,
    isError: publishedError,
    error: publishedErrorObj,
    refetch: refetchPublished,
  } = useMyPublicBlogQuery(
    {
      page: currentPage,
      search: debouncedSearch || undefined,
      category: selectedCategory || undefined,
      page_size: itemsPerPage,
    },
    { skip: isDraft },
  );

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [publishBlog] = usePublishBlogMutation();

  const data = isDraft ? draftData : publishedData;
  const isLoading = isDraft ? draftLoading : publishedLoading;
  const isError = isDraft ? draftError : publishedError;
  const error = isDraft ? draftErrorObj : publishedErrorObj;
  const refetch = isDraft ? refetchDraft : refetchPublished;

  const blogs = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const hasFilters = searchTerm || selectedCategory;

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

    const action = isDraft ? "Publish this draft?" : "Move this blog to draft?";
    if (!window.confirm(action)) return;

    setPublishingId(blogId);
    try {
      const res = await publishBlog(blogId).unwrap();
      showSuccessToast(res);
      await refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Action failed");
    } finally {
      setPublishingId(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, blogId: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Delete this blog?")) return;

    setDeletingId(blogId);
    try {
      const res = await deleteBlog(blogId).unwrap();
      showSuccessToast(res);
      const remaining = totalCount - 1;
      const newTotalPages = Math.ceil(remaining / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      await refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // Loading & error states
  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorState error={error} refetch={refetch} />;
  if (blogs.length === 0) {
    return (
      <EmptyState
        hasFilters={hasFilters}
        setSearchTerm={setSearchTerm}
        setDebouncedSearch={setDebouncedSearch}
        setSelectedCategory={setSelectedCategory}
      />
    );
  }

  const title = isDraft ? "My Drafts" : "Published Blogs";
  const countColor = isDraft ? "text-amber-600" : "text-green-600";
  const badgeText = isDraft ? "Draft" : "Published";
  const badgeColor = isDraft
    ? "bg-amber-500/90 backdrop-blur-sm"
    : "bg-green-500/90 backdrop-blur-sm";
  const buttonPrimary = isDraft
    ? {
        text: "Publish",
        icon: <CiCirclePlus />,
        hoverClass: "hover:bg-green-100",
        ringColor: "focus:ring-green-400",
      }
    : {
        text: "Move to Draft",
        icon: <LuCircleMinus />,
        hoverClass: "hover:bg-amber-100",
        ringColor: "focus:ring-amber-400",
      };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 mt-1">
          You have{" "}
          <span className={`font-semibold ${countColor}`}>{totalCount}</span>{" "}
          {isDraft ? "draft" : "published"} blog
          {totalCount !== 1 && "s"} {isDraft ? "in progress" : "live"}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="sm:w-64 relative">
            <TbCategoryPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory ?? ""}
              onChange={handleCategoryChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categoriesData?.categories?.map((cat: any) => (
                <option key={cat.category__id} value={cat.category__id}>
                  {cat.category__name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={() => {
                setSearchTerm("");
                setDebouncedSearch("");
                setSelectedCategory(undefined);
              }}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {blogs.map((blog: any) => {
          const currentProfile = blog?.author?.profile_images.find(
            (img: { is_current: boolean }) => img.is_current,
          );
          const userImage =
            getImageUrl(currentProfile?.image) || defaultProfileImage;
          const authorName =
            blog.author?.profile?.fullname ||
            blog.author?.username ||
            "Anonymous";

          return (
            <div
              key={blog.id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden border border-gray-100"
            >
              <Link
                to={`/blog/details/${blog.slug}`}
                className="block relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
              >
                {blog?.image ? (
                  <img
                    src={blog?.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div
                  className={`absolute top-3 left-3 flex items-center gap-1.5 ${badgeColor} text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md`}
                >
                  <span
                    className={`w-1.5 h-1.5 bg-white rounded-full ${
                      isDraft ? "animate-pulse" : ""
                    }`}
                  ></span>
                  {badgeText}
                </div>
                {blog.category?.name && (
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                      {blog.category.name}
                    </span>
                  </div>
                )}
              </Link>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <MdOutlineWatchLater className="mr-1" />
                  {formatDate(blog.published_at || blog.created_at)}
                </div>

                <Link to={`/blog/details/${blog.slug}`} className="block mb-2">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                </Link>

                {blog.content && (
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                    {blog.content.replace(/<[^>]*>/g, "").slice(0, 80)}...
                  </p>
                )}

                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={authorName}
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {authorName}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={(e) => handlePublish(e, blog.id)}
                    disabled={publishingId === blog.id}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 
                      bg-green-50 text-green-700 ${buttonPrimary.hoverClass} 
                      focus:outline-none focus:ring-2 ${buttonPrimary.ringColor} focus:ring-offset-1 border w-full cursor-pointer`}
                  >
                    {publishingId === blog.id ? (
                      <span className="flex items-center gap-1">
                        {isDraft ? "Publishing..." : "Moving..."}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        {buttonPrimary.icon}
                        {buttonPrimary.text}
                      </span>
                    )}
                  </button>

                  <div className="w-full flex items-center justify-between gap-4">
                    <button
                      onClick={(e) => handleDelete(e, blog.id)}
                      disabled={deletingId === blog.id}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 
                        bg-red-50 text-red-700 hover:bg-red-100 
                        focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 border w-full cursor-pointer"
                    >
                      {deletingId === blog.id ? (
                        <span className="flex items-center gap-1">
                          Deleting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <AiOutlineDelete />
                          Delete
                        </span>
                      )}
                    </button>

                    <Link
                      to={`/blogs/edit/${blog.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 
                        bg-blue-50 text-blue-700 hover:bg-blue-100 
                        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 border w-full cursor-pointer"
                    >
                      <FaRegEdit />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default MyBlogList;
