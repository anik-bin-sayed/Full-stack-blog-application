import React from "react";
import { IoClose, IoNotificationsOutline } from "react-icons/io5";
import {
  useMarkAllAsReadMutation,
  useNotificationsQuery,
} from "../../features/notifications/notificationApi";
import NotificationElements from "./NotificationElements";
import { showErrorToast } from "../../utils/showErrorToast";

type Props = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Notifications: React.FC<Props> = ({ setOpenModal }) => {
  const { data: notifications } = useNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const unreadCount = notifications?.filter(
    (item) => item.is_read === false,
  ).length;

  const handleMarkAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      showErrorToast(error);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
      onClick={() => setOpenModal(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-95 opacity-0 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-2">
            <IoNotificationsOutline className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Notifications
            </h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
              {unreadCount || "0"} new
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAsRead}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition cursor-pointer hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={() => setOpenModal(false)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              aria-label="Close notifications"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {notifications?.length == 0 ? (
            <div className="py-12 text-center text-gray-400">
              <IoNotificationsOutline className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications?.map((notification, index) => {
              return (
                <NotificationElements
                  key={index}
                  notification={notification}
                  setOpenModal={setOpenModal}
                />
              );
            })
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-in {
          animation: modalIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Notifications;
