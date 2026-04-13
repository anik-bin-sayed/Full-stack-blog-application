import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../baseQueryWithReauth";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["notification"],

  endpoints: (builder) => ({
    notifications: builder.query<any, void>({
      query: () => ({
        url: "notifications/",
        method: "GET",
      }),
      providesTags: ["notification"],
    }),
  }),
});

export const { useNotificationsQuery } = notificationsApi;
