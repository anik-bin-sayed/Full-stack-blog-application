import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../baseQueryWithReauth";

// Request body type
interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
}

// Response type
interface RegisterUserResponse {
  id: number;
  username: string;
  email: string;
  token?: string;
}

interface LoginUserRequest {
  email?: string;
  username?: string;
  password: string;
}

interface LoginUserResponse {
  message: string;
  user?: {
    id: number;
    email: string;
    username: string;
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    registerUser: builder.mutation<RegisterUserResponse, RegisterUserRequest>({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    loginUser: builder.mutation<LoginUserResponse, LoginUserRequest>({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<any, void>({
      query: () => ({
        url: "auth/refresh",
        method: "POST",
      }),
    }),

    logoutUser: builder.mutation<any, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useRefreshTokenMutation,
  useLogoutUserMutation,
} = authApi;
