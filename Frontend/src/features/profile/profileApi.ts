import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../baseQueryWithReauth";

// Image
export interface Image {
  id: number;
  image: string;
  is_current: boolean;
  uploaded_at: string;
}

// Profile
export interface Profile {
  bio: string;
  phone: string;
  birthdate: string | null;
  gender: string;
  language: string;
  timezone: string;
  address: string;
  city: string;
  country: string;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
  portfolio_url: string;
  social_links: Record<string, any>;
  language_preference: string;
  dark_mode_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// User
export interface User {
  id: number;
  username: string;
  email: string;
  profile: Profile;
  profile_images: Image[];
  cover_images: Image[];
}

// Pagination Response
export interface PaginatedUsers {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

// Common ID response
type IdResponse = {
  id: number;
};

// ================= API =================

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile"],

  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedUsers, { page?: number; search?: string }>(
      {
        query: ({ page = 1, search = "" }) => ({
          url: `/profile?page=${page}&search=${search}`,
          method: "GET",
        }),
        providesTags: ["Profile"],
      },
    ),

    getMe: builder.query<User, void>({
      query: () => ({
        url: `/profile/me`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    getUserProfile: builder.query<User, number>({
      query: (id) => ({
        url: `/profile/${id}`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation<User, FormData>({
      query: (data) => ({
        url: `/profile/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // ================= PROFILE IMAGE =================

    profilePhoto: builder.query<Image, void>({
      query: () => ({
        url: `/profile/current-photo`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    profileImageGallery: builder.query<Image[], void>({
      query: () => ({
        url: `/profile/gallery`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    uploadProfileImage: builder.mutation<Image, FormData>({
      query: (formdata) => ({
        url: `/profile/upload-img`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["Profile"],
    }),

    deleteProfileImage: builder.mutation<IdResponse, number>({
      query: (id) => ({
        url: `/profile/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),

    makeCurrentProfileImage: builder.mutation<IdResponse, number>({
      query: (id) => ({
        url: `/profile/make-profile-photo/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Profile"],
    }),

    // COVER IMAGE

    coverPhoto: builder.query<Image, void>({
      query: () => ({
        url: `/profile/current-cover-photo`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    coverImageGallery: builder.query<Image[], void>({
      query: () => ({
        url: `/profile/cover-gallery`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    uploadCoverImage: builder.mutation<Image, FormData>({
      query: (formdata) => ({
        url: `/profile/upload-cover-img`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["Profile"],
    }),

    deleteCoverImage: builder.mutation<IdResponse, number>({
      query: (id) => ({
        url: `/profile/delete-cover-image/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),

    makeCurrentCoverImage: builder.mutation<IdResponse, number>({
      query: (id) => ({
        url: `/profile/make-cover-photo/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserProfileQuery,
  useGetMeQuery,
  useUpdateProfileMutation,

  useProfilePhotoQuery,
  useProfileImageGalleryQuery,
  useUploadProfileImageMutation,
  useDeleteProfileImageMutation,
  useMakeCurrentProfileImageMutation,

  useCoverPhotoQuery,
  useCoverImageGalleryQuery,
  useUploadCoverImageMutation,
  useDeleteCoverImageMutation,
  useMakeCurrentCoverImageMutation,
} = profileApi;
