import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useAppSelector } from "../../redux/hooks";
import { useNotificationsQuery } from "../../features/notifications/notificationApi";

const NotificationButton = ({
  setOpenModal,
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data } = useNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });
  const notifications = data?.results;
  const unreadCount = notifications?.filter(
    (item) => item?.is_read === false,
  ).length;

  console.log(unreadCount);

  return (
    <div>
      {isAuthenticated && (
        <div>
          <button
            onClick={() => setOpenModal(true)}
            className="relative p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-100 transition-all duration-200 cursor-pointer"
          >
            <IoNotificationsOutline className="w-6 h-6" />

            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full shadow-md ">
              {unreadCount || "0"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
