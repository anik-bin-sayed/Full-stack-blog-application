import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../baseQueryWithReauth";
import type {
  BlogListResponse,
  BlogQueryParams,
} from "../../types/blog/blogApiResponse";

export const blogDataApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["blog"],

  endpoints: (builder) => ({
    myDraftBlogApi: builder.query<BlogListResponse, BlogQueryParams>({
      query: (params) => ({
        url: "/blog/my-draft-blog",
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    myPublicBlog: builder.query<BlogListResponse, BlogQueryParams>({
      query: (params) => ({
        url: `/blog/my-public-blog`,
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    getCategories: builder.query<any, void>({
      query: (params) => ({
        url: "blog/categories",
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    draftCategories: builder.query<any, void>({
      query: (params) => ({
        url: "blog/my-draft-blogs-category",
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    publicCategories: builder.query<any, void>({
      query: (params) => ({
        url: "blog/my-public-blogs-category",
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    deleteBlog: builder.mutation<any, void>({
      query: (id) => ({
        url: `/blog/delete-blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),

    publishBlog: builder.mutation<any, void>({
      query: (id) => ({
        url: `/blog/toggle-publish/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["blog"],
    }),
  }),
});

export const {
  useMyDraftBlogApiQuery,
  useGetCategoriesQuery,
  useDraftCategoriesQuery,
  useDeleteBlogMutation,
  usePublishBlogMutation,
  useMyPublicBlogQuery,
  usePublicCategoriesQuery,
} = blogDataApi;
