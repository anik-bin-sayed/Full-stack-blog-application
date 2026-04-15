import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../baseQueryWithReauth";

export interface Notification {
  id: number;
  sender_name: string;
  notification_type: "like" | "comment";
  is_read: boolean;
  created_at: string;
  sender: number;
  receiver: number;
  blog: number;
  comment: number | null;

  blog_data: {
    id: number;
    title: string;
    slug: string;
  };

  user_data: {
    id: number;
    fullname: string;
  };

  profile_image: {
    id: number;
    image: string;
    is_current: boolean;
  }[];
}

export interface NotificationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["notification"],

  endpoints: (builder) => ({
    notifications: builder.query<NotificationResponse, number | void>({
      query: (page = 1) => ({
        url: `notifications/?page=${page}`,
        method: "GET",
      }),
      providesTags: ["notification"],
    }),

    markAsRead: builder.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: `notifications/mark-as-read/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["notification"],
    }),

    markAllAsRead: builder.mutation<any, void>({
      query: () => ({
        url: `notifications/mark-all-as-read`,
        method: "POST",
      }),
      invalidatesTags: ["notification"],
    }),

    deleteAllNotifications: builder.mutation<any, void>({
      query: () => ({
        url: `notifications/delete-all-notification`,
        method: "DELETE",
      }),
      invalidatesTags: ["notification"],
    }),
  }),
});

export const {
  useNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  // delete
  useDeleteAllNotificationsMutation,
} = notificationsApi;
