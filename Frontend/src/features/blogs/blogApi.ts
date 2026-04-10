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

    createCategory: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/blog/category/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["blog"],
    }),

    createBlog: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/blog/create-blog",
        method: "POST",
        body,
      }),
      invalidatesTags: ["blog"],
    }),

    draftCategories: builder.query<any, void>({
      query: (params) => ({
        url: "blog/my-draft-blogs-category",
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    blogDetails: builder.query<any, { slug: string }>({
      query: ({ slug }) => ({
        url: `blog/blog-details/${slug}`,
        method: "GET",
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

    profileRecentPost: builder.query<any, void>({
      query: (id) => ({
        url: `/blog/my-recent-blog`,
        method: "GET",
      }),
      providesTags: ["blog"],
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
  useCreateCategoryMutation,
  useCreateBlogMutation,
  useBlogDetailsQuery,
  useProfileRecentPostQuery,
} = blogDataApi;
