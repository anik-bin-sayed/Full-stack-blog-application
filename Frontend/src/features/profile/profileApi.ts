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

// User Full
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

interface Image {
  image: string;
}

interface ID {
  id: number;
}

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedUsers, { page?: number; search?: string }>(
      {
        query: ({ page = 1, search = "" }) => ({
          url: `profile?page=${page}&search=${search}`,
          method: "GET",
        }),
        providesTags: ["Profile"],
      },
    ),

    getMe: builder.query<PaginatedUsers, { page?: number; search?: string }>({
      query: () => ({
        url: `/profile/me`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation<any, FormData>({
      query: (data) => ({
        url: `/profile/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // profile
    profilePhoto: builder.query<Image, void>({
      query: () => ({
        url: `/profile/current-photo`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    uploadProfileImage: builder.mutation<Image, FormData>({
      query: (formdata) => ({
        url: `profile/upload-img`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["Profile"],
    }),

    profileImageGallery: builder.query<Image[], void>({
      query: () => ({
        url: `/profile/gallery`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    deleteProfileImage: builder.mutation<ID, number>({
      query: (id) => ({
        url: `profile/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),

    makeCurrentProfileImage: builder.mutation<ID, number>({
      query: (id) => ({
        url: `profile/make-profile-photo/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Profile"],
    }),

    //cover photo
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

    deleteCoverImage: builder.mutation<ID, number>({
      query: (id) => ({
        url: `profile/delete-cover-image/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),

    makeCurrentCoverImage: builder.mutation<ID, number>({
      query: (id) => ({
        url: `profile/make-cover-photo/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Profile"],
    }),

    uploadCoverImage: builder.mutation<Image, FormData>({
      query: (formdata) => ({
        url: `profile/upload-cover-img`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetMeQuery,
  useUpdateProfileMutation,
  useProfilePhotoQuery,
  useCoverPhotoQuery,
  useProfileImageGalleryQuery,
  useCoverImageGalleryQuery,
  useUploadProfileImageMutation,
  useUploadCoverImageMutation,

  useDeleteCoverImageMutation,
  useDeleteProfileImageMutation,

  useMakeCurrentCoverImageMutation,
  useMakeCurrentProfileImageMutation,
} = profileApi;
