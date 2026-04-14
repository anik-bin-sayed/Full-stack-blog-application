import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../baseQueryWithReauth";

interface Notification {
  id: number;
  sender_name: string;
  notification_type: "like" | "comment";
  is_read: boolean;
  created_at: string;
  sender: number;
  receiver: number;
  blog: number;
  comment: number | null;
}

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["notification"],

  endpoints: (builder) => ({
    notifications: builder.query<Notification[], void>({
      query: () => ({
        url: "notifications/",
        method: "GET",
      }),
      providesTags: ["notification"],
    }),

    markAsRead: builder.mutation<any, { id: number }>({
      query: (id) => ({
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
  }),
});

export const {
  useNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;
