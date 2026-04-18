import React from "react";
import { FaHeart, FaComment, FaUserPlus } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import type { NotificationType } from "../../types/NotificationType";
import { formatDate, getImageUrl } from "../../helper";
import { Link } from "react-router-dom";
import { useMarkAsReadMutation } from "../../features/notifications/notificationApi";
import { showErrorToast } from "../../utils/showErrorToast";

type NotificationProps = {
  notification: NotificationType;
  onMarkAsRead?: (id: number) => void;
};

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

const getContent = (notification: NotificationType): string => {
  const { notification_type, blog_data } = notification;

  const title = blog_data?.title;

  const postTitle = title?.length > 50 ? title.slice(0, 50) + "..." : title;

  switch (notification_type) {
    case "like":
      return (
        <span>
          liked your blog post{" "}
          <span className="font-semibold">"{postTitle || "your post"}"</span>
        </span>
      );

    case "comment":
      return (
        <span>
          commented on your blog:{" "}
          <span className="font-semibold">"{postTitle || "your post"}"</span>
        </span>
      );

    case "follow":
      return <span> started following you</span>;

    default:
      return <span> interacted with your content</span>;
  }
};

const NotificationElements: React.FC<NotificationProps> = ({
  notification,
  setOpenModal,
}) => {
  const [markAsRead] = useMarkAsReadMutation();

  const {
    id,
    sender,
    profile_image,
    created_at,
    is_read,
    notification_type,
    blog_data,
    user_data,
  } = notification;
  const displayName = user_data?.fullname || sender?.name || "Someone";

  const currentProfile = profile_image?.find(
    (img: { is_current: boolean }) => img.is_current,
  );

  const avatar = getImageUrl(currentProfile?.image);

  const blogSlug = blog_data?.slug;

  const handleClick = async () => {
    try {
      await markAsRead({ id }).unwrap();
    } catch (error) {
      showErrorToast(error);
    }
    setOpenModal(false);
  };

  return (
    <Link
      to={`/blog/details/${blogSlug}`}
      onClick={handleClick}
      className={`flex items-start gap-3 px-5 py-3 cursor-pointer transition hover:bg-gray-50 ${
        !is_read ? "bg-indigo-50/30" : ""
      }`}
    >
      <div className="flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-gray-800">
            <span className="font-semibold">{displayName}</span>{" "}
            <span className="text-gray-600">{getContent(notification)}</span>
          </p>
          <div className="flex-shrink-0 mt-0.5">
            {!is_read && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">
            {formatDate(created_at)}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            {getIcon(notification_type)}
            <span className="capitalize">{notification_type}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NotificationElements;
