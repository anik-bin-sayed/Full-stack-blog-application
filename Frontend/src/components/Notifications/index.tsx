import React, { useState } from "react";
import { IoClose, IoNotificationsOutline } from "react-icons/io5";
import { FaHeart, FaComment, FaUserPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationsQuery } from "../../features/notifications/notificationApi";

interface Notification {
  id: number;
  type: "like" | "comment" | "follow" | "mention";
  user: {
    name: string;
    avatar?: string;
    username: string;
  };
  content: string;
  time: string;
  isRead: boolean;
}

type Props = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Notifications: React.FC<Props> = ({ setOpenModal }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "like",
      user: { name: "Sarah Johnson", username: "sarahj", avatar: "" },
      content: "liked your blog post '10 Tips for Better UX'",
      time: "2 minutes ago",
      isRead: false,
    },
    {
      id: 2,
      type: "comment",
      user: { name: "Michael Chen", username: "mikechen", avatar: "" },
      content: "commented: 'Great insights! Really helpful.'",
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: 3,
      type: "follow",
      user: { name: "Emma Watson", username: "emmaw", avatar: "" },
      content: "started following you",
      time: "3 hours ago",
      isRead: true,
    },
    {
      id: 4,
      type: "mention",
      user: { name: "David Kim", username: "davidk", avatar: "" },
      content: "mentioned you in a comment",
      time: "yesterday",
      isRead: true,
    },
    {
      id: 5,
      type: "like",
      user: { name: "Olivia Martinez", username: "oliviam", avatar: "" },
      content: "liked your photo",
      time: "yesterday",
      isRead: true,
    },
  ]);
  const { data } = useNotificationsQuery();
  console.log(data);
  const getIcon = (type: Notification["type"]) => {
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

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <AnimatePresence>
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 border">
              <div className="flex items-center gap-2">
                <IoNotificationsOutline className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpenModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <IoNotificationsOutline className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`flex items-start gap-3 px-5 py-3 cursor-pointer transition hover:bg-gray-50 ${
                      !notif.isRead ? "bg-indigo-50/30" : ""
                    }`}
                  >
                    {/* Avatar / Icon */}
                    <div className="flex-shrink-0">
                      {notif.user.avatar ? (
                        <img
                          src={notif.user.avatar}
                          alt={notif.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {notif.user.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold">
                            {notif.user.name}
                          </span>{" "}
                          <span className="text-gray-600">{notif.content}</span>
                        </p>
                        <div className="flex-shrink-0 mt-0.5">
                          {!notif.isRead && (
                            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {notif.time}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          {getIcon(notif.type)}
                          <span className="capitalize">{notif.type}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-center">
              <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition">
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      </AnimatePresence>
    </>
  );
};

export default Notifications;
