import React, { useEffect, useState, useRef } from "react";
import {
  useDeleteAllNotificationsMutation,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useNotificationsQuery,
} from "../../features/notifications/notificationApi";
import { Link } from "react-router-dom";
import { formatDate, getImageUrl } from "../../helper";
import { FaComment, FaHeart, FaUserPlus } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import type { Notification as NotificationType } from "../../types/NotificationType";
import { showErrorToast } from "../../utils/showErrorToast";

const getIcon = (type: string) => {
  switch (type) {
    case "like":
      return <FaHeart className="text-pink-500" />;
    case "comment":
      return <FaComment className="text-blue-500" />;
    case "follow":
      return <FaUserPlus className="text-green-500" />;
    default:
      return <IoNotificationsOutline className="text-purple-500" />;
  }
};

const NotificationsPage = () => {
  const [page, setPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState<NotificationType[]>(
    [],
  );
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetching, refetch } = useNotificationsQuery(page);
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteAllNotifications, { isLoading: deleting }] =
    useDeleteAllNotificationsMutation();

  useEffect(() => {
    if (data?.results) {
      setAllNotifications((prev) => {
        const updated = [...prev];
        for (const newNotif of data.results) {
          const existingIndex = updated.findIndex(
            (item) => item.id === newNotif.id,
          );
          if (existingIndex !== -1) {
            updated[existingIndex] = newNotif;
          } else {
            updated.push(newNotif);
          }
        }
        return updated;
      });
      setHasMore(!!data.next);
    }
  }, [data]);

  useEffect(() => {
    if (isFetching || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isFetching, hasMore]);

  const handleClick = async (id: number) => {
    try {
      await markAsRead({ id }).unwrap();
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleRead = async () => {
    try {
      await markAllAsRead().unwrap();
      setAllNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      await refetch();
    } catch (error) {
      showErrorToast(error);
    }
  };

  const deleteAllNotification = async () => {
    try {
      await deleteAllNotifications().unwrap();
      setAllNotifications([]);
      await refetch();
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <IoNotificationsOutline className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
              <p className="text-sm text-gray-500">
                Stay updated with your latest activity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRead}
              className="cursor-pointer hover:underline text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full"
            >
              Mark All Read
            </button>

            <button
              onClick={deleteAllNotification}
              className="cursor-pointer hover:underline text-red-700 text-xs font-medium px-3 py-1.5 rounded-full"
            >
              {deleting
                ? "Deleting all notifications..."
                : "Delete All Notifications"}
            </button>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full">
              {data?.count || 0} total
            </span>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {allNotifications.length === 0 && !isLoading ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <div className="text-5xl mb-3 opacity-60">🔔</div>
              <h3 className="text-lg font-medium text-gray-700">
                No notifications yet
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                When someone interacts with your content, it will appear here.
              </p>
            </div>
          ) : (
            allNotifications.map((notification) => {
              const {
                id,
                blog_data,
                created_at,
                is_read,
                notification_type,
                user_data,
                profile_image,
                sender,
              } = notification;

              const displayName =
                user_data?.fullname || sender?.toString() || "Someone";
              const avatar = getImageUrl(
                profile_image?.find((img) => img.is_current)?.image,
              );
              const postTitle = blog_data?.title
                ? blog_data.title.length > 50
                  ? blog_data.title.slice(0, 50) + "..."
                  : blog_data.title
                : "your post";
              const blogSlug = blog_data?.slug;

              const getContent = () => {
                switch (notification_type) {
                  case "like":
                    return (
                      <span>
                        liked your blog post{" "}
                        <span className="font-medium text-gray-900">
                          “{postTitle}”
                        </span>
                      </span>
                    );
                  case "comment":
                    return (
                      <span>
                        commented on your blog{" "}
                        <span className="font-medium text-gray-900">
                          “{postTitle}”
                        </span>
                      </span>
                    );
                  case "follow":
                    return <span>started following you</span>;
                  default:
                    return <span>interacted with your content</span>;
                }
              };

              return (
                <Link
                  key={id}
                  onClick={() => handleClick(id)}
                  to={`/blog/details/${blogSlug}`}
                  className={`group block transition-all duration-200 rounded-xl ${
                    !is_read
                      ? "bg-indigo-50/40 border-l-4 border-indigo-500 shadow-sm"
                      : "bg-white hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-4 p-4 sm:p-5">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={displayName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <span className="font-semibold text-gray-900">
                          {displayName}
                        </span>{" "}
                        {getContent()}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          {formatDate(created_at)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:inline-block" />
                        <span className="flex items-center gap-1.5">
                          {getIcon(notification_type)}
                          <span className="capitalize">
                            {notification_type}
                          </span>
                        </span>
                      </div>
                    </div>

                    {!is_read && (
                      <div className="flex-shrink-0">
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          )}

          {isFetching && (
            <div className="flex justify-center py-6">
              <div className="flex items-center gap-2 text-gray-500">
                <svg
                  className="animate-spin h-5 w-5 text-indigo-500"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-sm">Loading more...</span>
              </div>
            </div>
          )}

          {hasMore && !isFetching && allNotifications.length > 0 && (
            <div ref={observerRef} className="h-8" />
          )}

          {!hasMore && allNotifications.length > 0 && (
            <div className="text-center py-6 text-sm text-gray-400 border-t border-gray-100 mt-4">
              You've seen all notifications
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
